interface LogoMarkProps {
  className?: string;
  accentColor?: string;
  title?: string;
}

/**
 * Minimal Artify mark inspired by vinyl grooves + equalizer bar.
 * Uses a monochrome base with a restrained accent highlight.
 */
export default function LogoMark({
  className = 'h-6 w-6',
  accentColor = '#FF4D6D',
  title = 'Artify logo',
}: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label={title}
      className={className}
    >
      {/* Stylized A / waveform */}
      <path
        d="M12 38L24 12L36 38"
        stroke="currentColor"
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M17 29H31"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.7}
      />
      {/* Accent bar */}
      <path
        d="M18 34H34"
        stroke={accentColor}
        strokeWidth={3.5}
        strokeLinecap="round"
      />
      {/* Accent pulse */}
      <circle cx={36.5} cy={15.5} r={3} fill={accentColor} />
    </svg>
  );
}


