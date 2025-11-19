import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { SpotifyClientConfig, SpotifyPlaylist, SpotifyError } from "./types";
import {
  SpotifyClientError,
  SpotifyAuthenticationError,
  SpotifyRateLimitError,
  SpotifyNotFoundError,
} from "./errors";

interface AccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export class SpotifyClient {
  private axiosInstance: AxiosInstance;
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

    // Initialize Axios instance with default configuration
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor to add authentication token
    this.axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        await this.ensureAuthenticated();
        if (this.accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<SpotifyError>) => {
        return this.handleError(error);
      }
    );
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

      const response = await axios.post<AccessTokenResponse>(
        "https://accounts.spotify.com/api/token",
        "grant_type=client_credentials",
        {
          headers: {
            Authorization: `Basic ${authString}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      this.accessToken = response.data.access_token;
      // Set expiration time (subtract 60 seconds as buffer)
      this.tokenExpiresAt = Date.now() + (response.data.expires_in - 60) * 1000;
    } catch (error) {
      throw new SpotifyAuthenticationError(
        "Failed to authenticate with Spotify API",
        error
      );
    }
  }

  /**
   * Handle API errors with proper error types
   */
  private async handleError(error: AxiosError<SpotifyError>): Promise<never> {
    if (!error.response) {
      // Network error or timeout
      throw new SpotifyClientError(
        error.message || "Network error occurred",
        undefined,
        error
      );
    }

    const { status, data } = error.response;

    switch (status) {
      case 401:
        // Token might be expired, try to refresh
        this.accessToken = null;
        throw new SpotifyAuthenticationError(
          data?.error?.message || "Authentication failed",
          error
        );

      case 404:
        throw new SpotifyNotFoundError(
          data?.error?.message || "Resource not found",
          error
        );

      case 429:
        const retryAfter = error.response.headers["retry-after"];
        throw new SpotifyRateLimitError(
          data?.error?.message || "Rate limit exceeded",
          retryAfter ? parseInt(retryAfter, 10) : undefined,
          error
        );

      default:
        throw new SpotifyClientError(
          data?.error?.message || `Spotify API error: ${status}`,
          status,
          error
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
      const playlistResponse = await this.axiosInstance.get<SpotifyPlaylist>(
        `/playlists/${playlistId}`,
        {
          params: {
            market: "US", // Required for some track data
          },
        }
      );

      let playlist = playlistResponse.data;

      // Fetch all tracks if there are more pages
      if (playlist.tracks.next) {
        const allTracks = [...playlist.tracks.items];
        let nextUrl: string | null = playlist.tracks.next;

        // Follow pagination
        while (nextUrl) {
          const tracksResponse: { data: SpotifyPlaylist["tracks"] } =
            await this.axiosInstance.get<SpotifyPlaylist["tracks"]>(
              nextUrl.replace(this.baseURL, "")
            );

          allTracks.push(...tracksResponse.data.items);
          nextUrl = tracksResponse.data.next;
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
