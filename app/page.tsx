'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LogoMark from '@/components/logo-mark';

export default function Home() {
  const [playlistInput, setPlaylistInput] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const router = useRouter();

  const validatePlaylistInput = (input: string): { isValid: boolean; playlistId: string | null; error: string } => {
    const trimmed = input.trim();
    
    if (!trimmed) {
      return { isValid: false, playlistId: null, error: '' };
    }

    // Check if it's a Spotify playlist URL
    const urlPatterns = [
      /(?:https?:\/\/)?(?:open\.)?spotify\.com\/playlist\/([a-zA-Z0-9]+)/,
      /spotify:playlist:([a-zA-Z0-9]+)/,
    ];

    for (const pattern of urlPatterns) {
      const match = trimmed.match(pattern);
      if (match && match[1]) {
        const id = match[1];
        // Spotify playlist IDs are typically 22 characters
        if (id.length >= 15 && id.length <= 25) {
          return { isValid: true, playlistId: id, error: '' };
        }
      }
    }

    // Check if it's just a playlist ID (alphanumeric, 15-25 chars)
    const idPattern = /^[a-zA-Z0-9]{15,25}$/;
    if (idPattern.test(trimmed)) {
      return { isValid: true, playlistId: trimmed, error: '' };
    }

    return {
      isValid: false,
      playlistId: null,
      error: 'Please enter a valid Spotify playlist URL or ID',
    };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPlaylistInput(value);
    
    if (touched) {
      const validation = validatePlaylistInput(value);
      setError(validation.error);
    }
  };

  const handleInputBlur = () => {
    setTouched(true);
    const validation = validatePlaylistInput(playlistInput);
    setError(validation.error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    
    const validation = validatePlaylistInput(playlistInput);
    
    if (validation.isValid && validation.playlistId) {
      setError('');
      router.push(`/generate?id=${validation.playlistId}`);
    } else {
      setError(validation.error || 'Please enter a valid Spotify playlist URL or ID');
    }
  };

  const validation = validatePlaylistInput(playlistInput);
  const isButtonDisabled = !validation.isValid || !playlistInput.trim();

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
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-black bg-gradient-to-br from-white via-[#4ADE80]/10 to-[#4ADE80]/20 shadow-[4px_4px_0_0_#000]">
              <LogoMark className="h-7 w-7 text-black" accentColor="#4ADE80" />
            </div>
            <span className="text-3xl font-bold text-black tracking-tight">Artify</span>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-10 space-y-3 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-black mb-2 tracking-tight leading-tight">
              <span className="whitespace-nowrap">Turn Your <span className="relative inline-block">
                <span className="relative z-10">Playlists</span>
                <span className="absolute bottom-2 left-0 right-0 h-3 bg-[#4ADE80] opacity-20 z-0"></span>
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
                  <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
                    <div className="flex-1">
                      <input
                        id="playlist"
                        type="text"
                        value={playlistInput}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        placeholder="https://open.spotify.com/playlist/... or paste playlist ID"
                        className={`w-full px-5 py-4 border-2 text-black placeholder:text-gray-400 focus:outline-none focus:ring-4 transition-all bg-white font-medium ${
                          touched && error
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : touched && validation.isValid
                            ? 'border-[#4ADE80] focus:border-[#4ADE80] focus:ring-[#4ADE80]/20'
                            : 'border-black focus:border-[#4ADE80] focus:ring-[#4ADE80]/20'
                        }`}
                      />
                      {touched && error && (
                        <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={isButtonDisabled}
                      className="px-10 py-4 bg-black text-white font-bold uppercase tracking-wider hover:bg-[#4ADE80] hover:border-[#4ADE80] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-black transition-all border-2 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] sm:self-start"
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
                    className="flex items-center justify-between w-full text-left text-black hover:text-[#4ADE80] transition-colors group"
                  >
                    <span className="text-sm font-semibold uppercase tracking-wider">How to get a Playlist ID</span>
                    <svg
                      className={`w-5 h-5 transition-transform ${showInstructions ? 'rotate-180' : ''} group-hover:text-[#4ADE80]`}
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
                            <div className="w-8 h-8 rounded-full border-2 border-black bg-[#4ADE80] text-white flex items-center justify-center text-sm font-bold">
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
                            <div className="w-8 h-8 rounded-full border-2 border-black bg-[#4ADE80] text-white flex items-center justify-center text-sm font-bold">
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
                            <div className="w-8 h-8 rounded-full border-2 border-black bg-[#4ADE80] text-white flex items-center justify-center text-sm font-bold">
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
                          <code className="text-[#4ADE80] text-sm break-all font-mono block mb-4">
                            https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M
                          </code>
                          <p className="text-xs text-gray-300 mb-2 font-semibold uppercase tracking-wider">Or just the ID:</p>
                          <code className="text-[#4ADE80] text-sm font-mono">37i9dQZF1DXcBWIGoYBM5M</code>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Showcase Section */}
          <div className="mt-16 mb-8 animate-fade-in-delay-2">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">
                See What You Can Create
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
                Different layouts, devices, and styles to match your vibe
              </p>
            </div>

            {/* Example Wallpapers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {/* Example 1: Grid Layout - Phone */}
              <div className="bg-white border-2 border-black shadow-[4px_4px_0_0_#000] p-3 hover:shadow-[6px_6px_0_0_#000] transition-all flex flex-col h-full group">
                <div className="aspect-video bg-black rounded-lg overflow-hidden mb-2 relative flex-shrink-0 border border-black/10">
                  {/* Grid wallpaper with real album covers - 3x4 grid */}
                  <div className="absolute inset-0 grid grid-cols-3 gap-0">
                    {[
                      'blonde', 'damn', 'folklore',
                      'graduation', 'igor', 'mbdtf',
                      'okcomputer', 'rainbows', 'tdsotm',
                      'tpab', 'blonde', 'damn'
                    ].map((album, i) => (
                      <div key={`art-cover-${i}`} className="relative w-full h-full overflow-hidden">
                        <Image
                          src={`/assets/examples/${album}.webp`}
                          alt={`${album} album cover`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 33vw, 16vw"
                          quality={90}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-center mt-auto">
                  <p className="text-xs font-semibold text-black uppercase tracking-wider group-hover:text-[#4ADE80] transition-colors">Grid Layout</p>
                  <p className="text-xs text-gray-500 mt-0.5">Phone • 12 tiles</p>
                </div>
              </div>

              {/* Example 2: Rows Layout - Computer */}
              <div className="bg-white border-2 border-black shadow-[4px_4px_0_0_#000] p-3 hover:shadow-[6px_6px_0_0_#000] transition-all flex flex-col h-full group">
                <div className="aspect-video bg-black rounded-lg overflow-hidden mb-2 relative flex-shrink-0 border border-black/10">
                  {/* Rows wallpaper with real album covers - 6 rows */}
                  <div className="absolute inset-0 flex flex-col gap-0">
                    {['tdsotm', 'tpab', 'mbdtf', 'okcomputer', 'folklore', 'igor'].map((album, i) => (
                      <div key={i} className="flex-1 relative w-full overflow-hidden">
                        <Image
                          src={`/assets/examples/${album}.webp`}
                          alt={`${album} album cover`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          quality={90}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-center mt-auto">
                  <p className="text-xs font-semibold text-black uppercase tracking-wider group-hover:text-[#4ADE80] transition-colors">Rows Layout</p>
                  <p className="text-xs text-gray-500 mt-0.5">Computer • 6 rows</p>
                </div>
              </div>

            </div>

            {/* Features List */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full border-2 border-black bg-[#4ADE80]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-black mb-1">Transform Playlists Into Art</h3>
                <p className="text-xs text-gray-600">Turn your favorite Spotify playlists into stunning visual wallpapers</p>
              </div>

              <div className="text-center p-4">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full border-2 border-black bg-[#4ADE80]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-black mb-1">Perfect For Any Screen</h3>
                <p className="text-xs text-gray-600">Generate custom wallpapers optimized for phone, tablet, or desktop</p>
              </div>

              <div className="text-center p-4">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full border-2 border-black bg-[#4ADE80]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-black mb-1">Complete Creative Control</h3>
                <p className="text-xs text-gray-600">Customize layouts, colors, fonts, and backgrounds to match your vibe</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
