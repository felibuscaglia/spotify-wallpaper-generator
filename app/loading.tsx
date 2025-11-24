export default function Loading() {
  return (
    <div className="h-screen bg-white relative overflow-hidden flex items-center justify-center">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative flex flex-col items-center justify-center space-y-8">
        {/* Logo */}
        <div className="w-16 h-16 border-2 border-black bg-black flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="7" height="7" fill="#1DB954" stroke="#1DB954" strokeWidth="1"/>
            <rect x="14" y="3" width="7" height="7" fill="#1DB954" stroke="#1DB954" strokeWidth="1"/>
            <rect x="3" y="14" width="7" height="7" fill="#1DB954" stroke="#1DB954" strokeWidth="1"/>
            <rect x="14" y="14" width="7" height="7" fill="#1DB954" stroke="#1DB954" strokeWidth="1"/>
          </svg>
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold text-black uppercase tracking-wider">
            Loading Playlist
          </h2>
          <div className="flex items-center justify-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-[#1DB954] border border-black rounded-full animate-bounce-dot"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1.2s'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
