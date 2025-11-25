import LogoMark from '@/components/logo-mark';

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
        <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl border border-black bg-black text-white shadow-[6px_6px_0_0_#000]">
          <div
            aria-hidden="true"
            className="absolute inset-[4px] rounded-[22px] border border-white/10"
          />
          <LogoMark className="relative h-10 w-10 text-white" accentColor="#FF4D6D" />
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
                className="w-2 h-2 bg-[#FF4D6D] border border-black rounded-full animate-bounce-dot"
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
