import { createSpotifyClient } from '@/lib/integrations/spotify/client';
import { SpotifyNotFoundError, SpotifyForbiddenError } from '@/lib/integrations/spotify/errors';
import GenerateClient from './generate-client';

interface GeneratePageProps {
  searchParams: Promise<{
    id?: string;
  }>;
}

async function fetchPlaylist(playlistId: string) {
  try {
    const client = createSpotifyClient();
    const playlist = await client.getPlaylist(playlistId);
    return playlist;
  } catch (error) {
    // Log the actual error for debugging
    console.error('Error fetching playlist:', error);

    if (error instanceof SpotifyForbiddenError) {
      throw new Error('This playlist is private. Only public playlists can be accessed with the current authentication method.');
    }

    if (error instanceof SpotifyNotFoundError) {
      throw new Error('Playlist not found. Please check that the playlist ID is correct and the playlist is public.');
    }

    // Check if it's a client error with status code
    if (error instanceof Error && 'statusCode' in error) {
      const statusCode = (error as any).statusCode;
      if (statusCode === 401) {
        throw new Error('Authentication failed. Please check your Spotify API credentials.');
      }
    }

    throw error;
  }
}

export default async function GeneratePage({ searchParams }: GeneratePageProps) {
  const params = await searchParams;
  const playlistId = params.id;

  if (!playlistId) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0f0f0f] flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black dark:text-white mb-4">Missing Playlist ID</h1>
          <p className="text-gray-600 dark:text-gray-400">Please provide a valid playlist ID.</p>
        </div>
      </div>
    );
  }

  let playlist: Awaited<ReturnType<typeof fetchPlaylist>> | null = null;
  let error: string | null = null;

  try {
    playlist = await fetchPlaylist(playlistId);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load playlist';
  }

  if (error || !playlist) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0f0f0f] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-black dark:text-white mb-4">Error</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'Failed to load playlist'}</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-wider hover:bg-[#4ADE80] dark:hover:bg-[#4ADE80] transition-all border-2 border-black dark:border-white"
          >
            Go Back
          </a>
        </div>
      </div>
    );
  }

  return <GenerateClient playlist={playlist} />;
}
