'use client';

import { FONT_OPTIONS } from '@/lib/wallpaper/constants';

interface TitleCustomizerProps {
  showTitles: boolean;
  titleFont: string;
  blurColor: string;
  blurOpacity: number;
  onShowTitlesChange: (show: boolean) => void;
  onTitleFontChange: (font: string) => void;
  onBlurColorChange: (color: string) => void;
  onBlurOpacityChange: (opacity: number) => void;
}

export default function TitleCustomizer({
  showTitles,
  titleFont,
  blurColor,
  blurOpacity,
  onShowTitlesChange,
  onTitleFontChange,
  onBlurColorChange,
  onBlurOpacityChange,
}: TitleCustomizerProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-black uppercase tracking-wider">
          Titles
        </label>
        <button
          type="button"
          onClick={() => onShowTitlesChange(!showTitles)}
          className={`relative w-14 h-7 border-2 border-black transition-all ${
            showTitles ? 'bg-[#1DB954]' : 'bg-white'
          }`}
          aria-label="Toggle titles"
        >
          <div
            className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white border-2 border-black transition-transform duration-200 ${
              showTitles ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {showTitles && (
        <div className="space-y-4 p-4 border-2 border-black bg-white">
          {/* Font Selector */}
          <div>
            <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-2">
              Font
            </label>
            <select
              value={titleFont}
              onChange={(e) => onTitleFontChange(e.target.value)}
              className="w-full px-3 py-2 border-2 border-black text-black focus:outline-none focus:border-[#1DB954] focus:ring-2 focus:ring-[#1DB954]/20 bg-white"
            >
              {FONT_OPTIONS.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>

          {/* Blur Color */}
          <div>
            <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-2">
              Blur Color
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={blurColor}
                onChange={(e) => onBlurColorChange(e.target.value)}
                className="w-16 h-10 border-2 border-black cursor-pointer"
              />
              <input
                type="text"
                value={blurColor}
                onChange={(e) => onBlurColorChange(e.target.value)}
                className="flex-1 px-3 py-2 border-2 border-black text-black focus:outline-none focus:border-[#1DB954] focus:ring-2 focus:ring-[#1DB954]/20"
                placeholder="#000000"
              />
            </div>
          </div>

          {/* Blur Opacity */}
          <div>
            <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-2">
              Blur Opacity: {Math.round(blurOpacity * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={blurOpacity}
              onChange={(e) => onBlurOpacityChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 border-2 border-black appearance-none cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
}

