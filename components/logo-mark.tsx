interface LogoMarkProps {
  className?: string;
  accentColor?: string;
  title?: string;
}

/**
 * Modern Artify mark: Arranged squares representing album covers being composed into
 * a wallpaper. The overlapping/arranged squares show the core functionality of
 * arranging album art into visual wallpapers.
 */
export default function LogoMark({
  className = 'h-6 w-6',
  accentColor = '#4ADE80',
  title = 'Spotify Wallpaper Generator logo',
}: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label={title}
      className={className}
    >
      {/* Arranged album covers in a square grid - representing wallpaper composition */}
      <rect x="6" y="6" width="16" height="16" fill="currentColor" />
      <rect x="26" y="6" width="16" height="16" fill={accentColor} />
      <rect x="6" y="26" width="16" height="16" fill="currentColor" />
      <rect x="26" y="26" width="16" height="16" fill="currentColor" />
    </svg>
  );
}



