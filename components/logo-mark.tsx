interface LogoMarkProps {
  className?: string;
  accentColor?: string;
  title?: string;
}

/**
 * Modern Artify mark: A clean, geometric waveform that represents music and visual art.
 * Simple, memorable design perfect for 18-30 year olds who love music and design.
 * The accent color highlights the center peak, creating a focal point.
 */
export default function LogoMark({
  className = 'h-6 w-6',
  accentColor = '#4ADE80',
  title = 'Artify logo',
}: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label={title}
      className={className}
    >
      {/* Simplified waveform - 5 bars forming a peak */}
      <rect x="6" y="36" width="5" height="6" fill="currentColor" />
      <rect x="13" y="28" width="5" height="14" fill="currentColor" />
      <rect x="20" y="8" width="8" height="34" fill={accentColor} />
      <rect x="30" y="28" width="5" height="14" fill="currentColor" />
      <rect x="37" y="36" width="5" height="6" fill="currentColor" />
    </svg>
  );
}



