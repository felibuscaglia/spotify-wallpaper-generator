import { SpotifyClientConfig, SpotifyPlaylist, SpotifyError } from "./types";
import {
  SpotifyClientError,
  SpotifyAuthenticationError,
  SpotifyRateLimitError,
  SpotifyNotFoundError,
  SpotifyForbiddenError,
} from "./errors";

interface AccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export class SpotifyClient {
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly baseURL: string;

  private static instance: SpotifyClient | null = null;

  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor(config: SpotifyClientConfig) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.baseURL = "https://api.spotify.com/v1";
  }

  /**
   * Get or create singleton instance
   */
  public static getInstance(config?: SpotifyClientConfig): SpotifyClient {
    if (!SpotifyClient.instance) {
      if (!config) {
        throw new SpotifyClientError(
          "SpotifyClient configuration is required for first initialization. " +
            "Provide clientId and clientSecret via config parameter or environment variables."
        );
      }
      SpotifyClient.instance = new SpotifyClient(config);
    }
    return SpotifyClient.instance;
  }

  /**
   * Reset singleton instance (useful for testing)
   */
  public static resetInstance(): void {
    SpotifyClient.instance = null;
  }

  /**
   * Ensure we have a valid access token
   */
  private async ensureAuthenticated(): Promise<void> {
    const now = Date.now();

    // Check if token is still valid (with 60 second buffer)
    if (this.accessToken && this.tokenExpiresAt > now + 60000) {
      return;
    }

    await this.authenticate();
  }

  /**
   * Authenticate using Client Credentials flow
   * This is suitable for server-side applications
   */
  private async authenticate(): Promise<void> {
    try {
      const authString = Buffer.from(
        `${this.clientId}:${this.clientSecret}`
      ).toString("base64");

      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          Authorization: `Basic ${authString}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
        }).toString(),
      });

      const payload = (await response
        .json()
        .catch(() => null)) as (Partial<AccessTokenResponse> & {
        error?: string;
        error_description?: string;
      }) | null;

      if (
        !payload ||
        !payload.access_token ||
        !payload.expires_in ||
        !response.ok
      ) {
        const message =
          payload?.error_description ||
          payload?.error ||
          "Failed to authenticate with Spotify API";
        throw new SpotifyAuthenticationError(message, payload);
      }

      this.accessToken = payload.access_token;
      // Set expiration time (subtract 60 seconds as buffer)
      this.tokenExpiresAt = Date.now() + (payload.expires_in - 60) * 1000;
    } catch (error) {
      throw new SpotifyAuthenticationError(
        "Failed to authenticate with Spotify API",
        error
      );
    }
  }

  /**
   * Build absolute Spotify API URL
   */
  private buildUrl(pathOrUrl: string): string {
    if (/^https?:\/\//i.test(pathOrUrl)) {
      return pathOrUrl;
    }
    return `${this.baseURL}${pathOrUrl}`;
  }

  /**
   * Perform a Spotify API request with automatic authentication
   */
  private async request<T>(
    pathOrUrl: string,
    init: RequestInit = {}
  ): Promise<T> {
    await this.ensureAuthenticated();

    const url = this.buildUrl(pathOrUrl);
    const headers = new Headers(init.headers);

    if (this.accessToken && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${this.accessToken}`);
    }

    if (init.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    headers.set("Accept", "application/json");

    let response: Response;
    try {
      response = await fetch(url, {
        ...init,
        headers,
      });
    } catch (error) {
      throw new SpotifyClientError(
        (error as Error)?.message || "Network error occurred",
        undefined,
        error
      );
    }

    const text = await response.text();
    let data: unknown = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }
    }

    if (!response.ok) {
      this.handleErrorResponse(
        response.status,
        (data as SpotifyError) || null,
        response.headers.get("retry-after") || undefined
      );
    }

    return data as T;
  }

  /**
   * Handle API errors with proper error types
   */
  private handleErrorResponse(
    status: number,
    data: SpotifyError | null,
    retryAfter?: string
  ): never {
    switch (status) {
      case 401:
        this.accessToken = null;
        throw new SpotifyAuthenticationError(
          data?.error?.message || "Authentication failed",
          data
        );

      case 403:
        throw new SpotifyForbiddenError(
          data?.error?.message || "Access forbidden",
          data
        );

      case 404:
        throw new SpotifyNotFoundError(
          data?.error?.message || "Resource not found",
          data
        );

      case 429:
        throw new SpotifyRateLimitError(
          data?.error?.message || "Rate limit exceeded",
          retryAfter ? parseInt(retryAfter, 10) : undefined,
          data
        );

      default:
        throw new SpotifyClientError(
          data?.error?.message || `Spotify API error: ${status}`,
          status,
          data
        );
    }
  }

  /**
   * Get playlist by ID
   * Fetches all tracks by following pagination
   */
  public async getPlaylist(playlistId: string): Promise<SpotifyPlaylist> {
    try {
      // First, get the playlist metadata
      let playlist = await this.request<SpotifyPlaylist>(
        `/playlists/${playlistId}?market=US`
      );

      // Fetch all tracks if there are more pages
      if (playlist.tracks.next) {
        const allTracks = [...playlist.tracks.items];
        let nextUrl: string | null = playlist.tracks.next;

        // Follow pagination
        while (nextUrl) {
          const tracksResponse: SpotifyPlaylist["tracks"] =
            await this.request<SpotifyPlaylist["tracks"]>(nextUrl);

          allTracks.push(...tracksResponse.items);
          nextUrl = tracksResponse.next;
        }

        playlist = {
          ...playlist,
          tracks: {
            ...playlist.tracks,
            items: allTracks,
            next: null,
            previous: null,
          },
        };
      }

      return playlist;
    } catch (error) {
      if (error instanceof SpotifyClientError) {
        throw error;
      }
      throw new SpotifyClientError(
        `Failed to fetch playlist: ${playlistId}`,
        undefined,
        error
      );
    }
  }

  /**
   * Validate playlist ID format
   */
  public static isValidPlaylistId(id: string): boolean {
    return /^[a-zA-Z0-9]{15,25}$/.test(id);
  }
}

/**
 * Factory function to create and configure Spotify client
 * Reads configuration from environment variables
 */
export function createSpotifyClient(): SpotifyClient {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new SpotifyClientError(
      "Spotify API credentials not found. " +
        "Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET environment variables."
    );
  }

  return SpotifyClient.getInstance({
    clientId,
    clientSecret,
  });
}
