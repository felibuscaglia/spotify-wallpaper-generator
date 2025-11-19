/**
 * Spotify API Type Definitions
 * Based on Spotify Web API documentation
 */

export interface SpotifyImage {
  url: string;
  height: number | null;
  width: number | null;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  external_urls: {
    spotify: string;
  };
  images?: SpotifyImage[];
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  album_type: string;
  artists: SpotifyArtist[];
  external_urls: {
    spotify: string;
  };
  images: SpotifyImage[];
  release_date: string;
  release_date_precision: 'year' | 'month' | 'day';
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  duration_ms: number;
  external_urls: {
    spotify: string;
  };
  preview_url: string | null;
  track_number: number;
  disc_number: number;
}

export interface SpotifyPlaylistOwner {
  id: string;
  display_name: string | null;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string | null;
  owner: SpotifyPlaylistOwner;
  images: SpotifyImage[];
  external_urls: {
    spotify: string;
  };
  public: boolean;
  collaborative: boolean;
  followers: {
    total: number;
  };
  tracks: {
    href: string;
    total: number;
    items: Array<{
      added_at: string;
      track: SpotifyTrack | null;
    }>;
    next: string | null;
    previous: string | null;
  };
}

export interface SpotifyError {
  error: {
    status: number;
    message: string;
  };
}

export interface SpotifyClientConfig {
  clientId: string;
  clientSecret: string;
}


