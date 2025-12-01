import LogoMark from "@/components/logo-mark";

export default function Loading() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-black">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #0f172a 1px, transparent 0)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16">
        <div className="flex w-full max-w-xs flex-col items-center space-y-8 text-center">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl border border-black bg-black text-white shadow-[6px_6px_0_0_#000]">
            <div
              aria-hidden="true"
              className="absolute inset-[4px] rounded-[22px] border border-white/10"
            />
            <LogoMark
              className="relative h-10 w-10 text-white"
              accentColor="#4ADE80"
            />
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center gap-2">
              {[...Array(3)].map((_, index) => (
                <span
                  key={index}
                  className="h-2.5 w-2.5 rounded-full bg-[#4ADE80] animate-bounce-dot"
                  style={{
                    animationDelay: `${index * 0.15}s`,
                  }}
                />
              ))}
            </div>

            <p className="text-xs uppercase tracking-[0.4em] text-neutral-400">
              Loading playlist
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
