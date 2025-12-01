'use client';

import { BackgroundPreset, BACKGROUND_VIBE_PRESETS } from '@/lib/wallpaper/constants';
import { BackgroundStyle } from '@/lib/wallpaper/types';
import { LayoutFillStats } from '@/lib/wallpaper/utils';

interface BackgroundCustomizerProps {
  background: BackgroundStyle;
  fillStats: LayoutFillStats;
  itemCount: number;
  onChange: (background: BackgroundStyle) => void;
}

const MAX_COLOR_STOPS = 4;

const FALLBACK_GRADIENT = ['#111111', '#1F2937'];

const FREESTYLE_PALETTES = [
  ['#4ADE80', '#F9A8D4'],
  ['#00F5A0', '#00D9F5'],
  ['#FDE047', '#F97316'],
  ['#6366F1', '#14B8A6'],
  ['#F472B6', '#8B5CF6'],
];

function buildPreviewBackground(style: BackgroundStyle): string {
  const colors = style.colors.length
    ? style.colors
    : style.mode === 'solid'
      ? ['#050505']
      : FALLBACK_GRADIENT;

  if (style.mode === 'solid') {
    return colors[0];
  }

  if (style.mode === 'linear') {
    return `linear-gradient(${style.angle || 0}deg, ${colors.join(', ')})`;
  }

  return `radial-gradient(circle at center, ${colors.join(', ')})`;
}

function generateFreestyleGradient(): BackgroundStyle {
  const palette = FREESTYLE_PALETTES[Math.floor(Math.random() * FREESTYLE_PALETTES.length)];
  const shuffled = [...palette].sort(() => Math.random() - 0.5);
  const angle = Math.floor(Math.random() * 360);

  return {
    mode: 'linear',
    colors: shuffled,
    angle,
  };
}

export default function BackgroundCustomizer({
  background,
  fillStats,
  itemCount,
  onChange,
}: BackgroundCustomizerProps) {
  const filledPercent = fillStats.totalSlots
    ? Math.round((fillStats.usedSlots / fillStats.totalSlots) * 100)
    : 0;

  const infoCopy =
    fillStats.layout === 'grid'
      ? `You're using ${fillStats.usedSlots}/${fillStats.totalSlots} tiles. ${fillStats.emptySlots} empty slot${fillStats.emptySlots === 1 ? '' : 's'} to color.`
      : `Showing ${fillStats.usedSlots}/${fillStats.totalSlots} rows. ${fillStats.emptySlots} row${fillStats.emptySlots === 1 ? '' : 's'} waiting for a vibe.`;

  const ensureColorsForMode = (mode: BackgroundStyle['mode'], colors: string[]) => {
    if (mode === 'solid') {
      return [colors[0] || '#050505'];
    }

    if (colors.length < 2) {
      const base = colors[0] || '#1F2937';
      return [base, '#4ADE80'];
    }

    return colors;
  };

  const handleModeChange = (mode: BackgroundStyle['mode']) => {
    onChange({
      ...background,
      mode,
      colors: ensureColorsForMode(mode, background.colors),
    });
  };

  const handleColorChange = (index: number, color: string) => {
    const next = [...background.colors];
    next[index] = color;
    onChange({ ...background, colors: next });
  };

  const handleAddColorStop = () => {
    if (background.colors.length >= MAX_COLOR_STOPS) return;
    const last = background.colors[background.colors.length - 1] || '#FFFFFF';
    onChange({ ...background, colors: [...background.colors, last] });
  };

  const handleRemoveColorStop = (index: number) => {
    const minStops = background.mode === 'solid' ? 1 : 2;
    if (background.colors.length <= minStops) return;
    const next = background.colors.filter((_, i) => i !== index);
    onChange({ ...background, colors: next });
  };

  const handleAngleChange = (value: number) => {
    onChange({ ...background, angle: value });
  };

  const handleApplyPreset = (preset: BackgroundPreset) => {
    onChange({
      mode: preset.mode,
      colors: [...preset.colors],
      angle: preset.angle,
    });
  };

  const handleFreestyle = () => {
    onChange(generateFreestyleGradient());
  };

  const minStops = background.mode === 'solid' ? 1 : 2;
  const colorStops =
    background.colors.length >= minStops
      ? background.colors
      : ensureColorsForMode(background.mode, background.colors);
  const displayAngle = Number.isFinite(background.angle) ? background.angle : 0;
  const anglePreviewBackground =
    background.mode === 'linear'
      ? buildPreviewBackground({
          ...background,
          mode: 'linear',
          angle: displayAngle,
          colors: colorStops,
        })
      : undefined;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-black uppercase tracking-wider">
            Fill The Empty Space
          </p>
          <p className="text-xs text-gray-500">{infoCopy}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-black">{filledPercent}% full</p>
          <p className="text-xs text-gray-500">{itemCount} total items selected</p>
        </div>
      </div>

      <div
        className="rounded-lg border-2 border-black p-4 shadow-[4px_4px_0_0_#000]"
        style={{ background: buildPreviewBackground(background) }}
      >
        <p className="text-white text-sm font-semibold uppercase tracking-wider drop-shadow">
          Live Preview
        </p>
        <p className="text-white/80 text-xs mt-1">This gradient fills the leftover canvas</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {(['solid', 'linear', 'radial'] as BackgroundStyle['mode'][]).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => handleModeChange(mode)}
            className={`px-3 py-2 border-2 text-xs font-semibold uppercase tracking-wider transition-all ${
              background.mode === mode
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-black hover:bg-gray-100'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {colorStops.map((color, index) => (
          <div
            key={`${color}-${index}`}
            className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-3"
          >
            <div className="flex-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-black">
                {background.mode === 'solid' ? 'Color' : `Color Stop ${index + 1}`}
              </label>

              <div className="w-full border-2 border-black bg-white flex items-stretch">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  className="cursor-pointer appearance-none border-none p-0 w-full h-8"
                  style={{
                    WebkitAppearance: 'none',
                    background: 'transparent',
                  }}
                />
              </div>
            </div>

            {background.mode !== 'solid' && (
              <button
                type="button"
                onClick={() => handleRemoveColorStop(index)}
                className="px-3 py-2 text-xs font-semibold uppercase tracking-wider border-2 border-black text-black hover:bg-gray-100 transition sm:self-end"
                disabled={colorStops.length <= minStops}
              >
                Remove
              </button>
            )}
          </div>
        ))}

        {background.mode !== 'solid' && colorStops.length < MAX_COLOR_STOPS && (
          <button
            type="button"
            onClick={handleAddColorStop}
            className="w-full px-3 py-2 border-2 border-dashed border-black text-xs font-semibold uppercase tracking-wider hover:bg-gray-50 transition"
          >
            Add Color Stop
          </button>
        )}
      </div>

      {background.mode === 'linear' && (
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-black mb-2">
            Gradient Angle ({displayAngle}°)
          </label>
          <div className="space-y-3">
            <div className="relative h-5 flex items-center">
              <div
                className="pointer-events-none absolute inset-0 border-2 border-black shadow-[4px_4px_0_0_#000]"
                style={{ background: anglePreviewBackground || '#0f0f0f' }}
              />
              <input
                type="range"
                min={0}
                max={360}
                value={displayAngle}
                onChange={(e) => handleAngleChange(Number(e.target.value))}
                className="angle-slider relative z-10 w-full h-full"
              />
            </div>
            <div className="flex justify-between text-[10px] font-semibold uppercase tracking-widest text-gray-500">
              <span>0°</span>
              <span>90°</span>
              <span>180°</span>
              <span>270°</span>
              <span>360°</span>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-black">Preset Vibes</p>
        <div className="flex flex-wrap gap-2">
          {BACKGROUND_VIBE_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="flex-1 min-w-[120px] px-3 py-2 border-2 border-black text-left bg-white hover:bg-gray-50 transition"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-black">
                {preset.label}
              </p>
              <p className="text-[10px] text-gray-500">{preset.description}</p>
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleFreestyle}
        className="w-full px-4 py-3 border-2 border-black bg-black text-white text-sm font-semibold uppercase tracking-wider hover:bg-[#4ADE80] transition"
      >
        Feeling Lucky
      </button>
    </div>
  );
}

