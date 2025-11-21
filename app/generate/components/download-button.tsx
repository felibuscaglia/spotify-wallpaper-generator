'use client';

interface DownloadButtonProps {
  getCanvas: () => HTMLCanvasElement | null;
  filename?: string;
}

export default function DownloadButton({ getCanvas, filename = 'wallpaper' }: DownloadButtonProps) {
  const handleDownload = () => {
    const canvas = getCanvas();
    if (!canvas) return;

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = url;
    link.click();
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="w-full px-6 py-3 bg-black text-white font-bold uppercase tracking-wider hover:bg-[#1DB954] transition-all border-2 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
    >
      Download Wallpaper
    </button>
  );
}

