/**
 * Spotify Integration Module
 * 
 * Centralized exports for Spotify API integration
 */

export { SpotifyClient, createSpotifyClient } from './client';
export {
  SpotifyClientError,
  SpotifyAuthenticationError,
  SpotifyRateLimitError,
  SpotifyNotFoundError,
} from './errors';
export type {
  SpotifyPlaylist,
  SpotifyTrack,
  SpotifyAlbum,
  SpotifyArtist,
  SpotifyImage,
  SpotifyPlaylistOwner,
  SpotifyClientConfig,
  SpotifyError,
} from './types';


