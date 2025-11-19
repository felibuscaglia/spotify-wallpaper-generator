import { createSpotifyClient } from '@/lib/integrations/spotify/client';
import { SpotifyNotFoundError } from '@/lib/integrations/spotify/errors';

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
    if (error instanceof SpotifyNotFoundError) {
      throw new Error('Playlist not found');
    }
    throw error;
  }
}

export default async function GeneratePage({ searchParams }: GeneratePageProps) {
  const params = await searchParams;
  const playlistId = params.id;

  if (!playlistId) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-4">Missing Playlist ID</h1>
          <p className="text-gray-600">Please provide a valid playlist ID.</p>
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
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-black mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error || 'Failed to load playlist'}</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-black text-white font-bold uppercase tracking-wider hover:bg-[#1DB954] transition-all border-2 border-black"
          >
            Go Back
          </a>
        </div>
      </div>
    );
  }

  // For now, just show the playlist data
  // This will be replaced with the wallpaper generator UI
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <a
            href="/"
            className="inline-block text-sm font-semibold text-black uppercase tracking-wider hover:text-[#1DB954] transition-colors mb-6"
          >
            ← Back
          </a>
          <h1 className="text-4xl font-bold text-black mb-2">{playlist.name}</h1>
          {playlist.description && (
            <p className="text-gray-600 mb-4">{playlist.description}</p>
          )}
          <p className="text-sm text-gray-500">
            {playlist.tracks.total} tracks • By {playlist.owner.display_name || 'Unknown'}
          </p>
        </div>

        {/* Placeholder for wallpaper generator */}
        <div className="bg-white border-2 border-black shadow-[8px_8px_0_0_#000] p-8">
          <p className="text-center text-gray-600">
            Wallpaper generator UI will be implemented here
          </p>
        </div>
      </div>
    </div>
  );
}

