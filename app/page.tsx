'use client';

import { useState } from 'react';

export default function Home() {
  const [playlistInput, setPlaylistInput] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);

  const extractPlaylistId = (input: string) => {
    // Extract ID from URL or return the input if it's already an ID
    const urlMatch = input.match(/playlist\/([a-zA-Z0-9]+)/);
    return urlMatch ? urlMatch[1] : input;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const playlistId = extractPlaylistId(playlistInput);
    if (playlistId) {
      // TODO: Navigate to customization page
      console.log('Playlist ID:', playlistId);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-3xl">
          {/* Logo and App Name */}
          <div className="flex items-center justify-center gap-3 mb-8 animate-fade-in">
            <div className="w-12 h-12 border-2 border-black bg-[#1DB954] flex items-center justify-center relative">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 6L8 9V19L14 22L20 19V9L14 6Z" fill="black"/>
                <path d="M14 6V22" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M8 9L14 12.5L20 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 19L14 15.5L20 19" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-3xl font-bold text-black tracking-tight">Artify</span>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-10 space-y-3 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-black mb-2 tracking-tight leading-tight">
              <span className="whitespace-nowrap">Turn Your <span className="relative inline-block">
                <span className="relative z-10">Playlists</span>
                <span className="absolute bottom-2 left-0 right-0 h-3 bg-[#1DB954] opacity-20 z-0"></span>
              </span> Into Art</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto font-light leading-relaxed">
              Create stunning wallpapers from your Spotify playlists.<br />
              Customize every detail to match your style.
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white border-2 border-black shadow-[8px_8px_0_0_#000] animate-fade-in-delay">
            <div className="p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Playlist Input */}
                <div className="space-y-3">
                  <label htmlFor="playlist" className="block text-sm font-semibold text-black uppercase tracking-wider">
                    Spotify Playlist URL or ID
                  </label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      id="playlist"
                      type="text"
                      value={playlistInput}
                      onChange={(e) => setPlaylistInput(e.target.value)}
                      placeholder="https://open.spotify.com/playlist/... or paste playlist ID"
                      className="flex-1 px-5 py-4 border-2 border-black text-black placeholder:text-gray-400 focus:outline-none focus:border-[#1DB954] focus:ring-4 focus:ring-[#1DB954]/20 transition-all bg-white font-medium"
                    />
                    <button
                      type="submit"
                      disabled={!playlistInput.trim()}
                      className="px-10 py-4 bg-black text-white font-bold uppercase tracking-wider hover:bg-[#1DB954] hover:border-[#1DB954] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-black transition-all border-2 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                    >
                      Create
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t-2 border-black"></div>

                {/* Instructions Toggle */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowInstructions(!showInstructions)}
                    className="flex items-center justify-between w-full text-left text-black hover:text-[#1DB954] transition-colors group"
                  >
                    <span className="text-sm font-semibold uppercase tracking-wider">How to get your Playlist ID</span>
                    <svg
                      className={`w-5 h-5 transition-transform ${showInstructions ? 'rotate-180' : ''} group-hover:text-[#1DB954]`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showInstructions && (
                    <div className="mt-6 space-y-4 text-gray-700 animate-slide-down">
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <div className="shrink-0">
                            <div className="w-8 h-8 rounded-full border-2 border-black bg-[#1DB954] text-black flex items-center justify-center text-sm font-bold">
                              1
                            </div>
                          </div>
                          <div className="flex-1 pt-1">
                            <h3 className="text-black font-bold mb-1">Open Spotify</h3>
                            <p className="text-sm leading-relaxed">Go to your Spotify app (web or desktop) and navigate to the playlist you want to use.</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-4">
                          <div className="shrink-0">
                            <div className="w-8 h-8 rounded-full border-2 border-black bg-[#1DB954] text-black flex items-center justify-center text-sm font-bold">
                              2
                            </div>
                          </div>
                          <div className="flex-1 pt-1">
                            <h3 className="text-black font-bold mb-1">Copy the Playlist Link</h3>
                            <p className="text-sm leading-relaxed">Click the three dots (⋯) on the playlist, then select "Share" → "Copy link to playlist".</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-4">
                          <div className="shrink-0">
                            <div className="w-8 h-8 rounded-full border-2 border-black bg-[#1DB954] text-black flex items-center justify-center text-sm font-bold">
                              3
                            </div>
                          </div>
                          <div className="flex-1 pt-1">
                            <h3 className="text-black font-bold mb-1">Paste it Here</h3>
                            <p className="text-sm leading-relaxed">Simply paste the entire URL in the input above, or extract just the ID from the URL.</p>
                          </div>
                        </div>

                        <div className="mt-4 p-5 bg-black text-white border-2 border-black">
                          <p className="text-xs text-gray-300 mb-3 font-semibold uppercase tracking-wider">Example URL format:</p>
                          <code className="text-[#1DB954] text-sm break-all font-mono block mb-4">
                            https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M
                          </code>
                          <p className="text-xs text-gray-300 mb-2 font-semibold uppercase tracking-wider">Or just the ID:</p>
                          <code className="text-[#1DB954] text-sm font-mono">37i9dQZF1DXcBWIGoYBM5M</code>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
