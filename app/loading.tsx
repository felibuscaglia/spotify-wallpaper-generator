export default function Loading() {
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
          <div className="flex items-center justify-center gap-3 mb-8">
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

          {/* Loading Card */}
          <div className="bg-white border-2 border-black shadow-[8px_8px_0_0_#000]">
            <div className="p-8 md:p-12">
              <div className="space-y-6">
                {/* Loading Animation */}
                <div className="flex flex-col items-center justify-center space-y-6 py-12">
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-2 border-black bg-[#1DB954]"></div>
                    <div className="absolute inset-0 border-2 border-transparent border-t-black animate-spin" style={{
                      animationDuration: '0.8s'
                    }}></div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-lg font-bold text-black uppercase tracking-wider">Loading Playlist</p>
                    <p className="text-sm text-gray-600 font-medium">Preparing your wallpaper generator...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

