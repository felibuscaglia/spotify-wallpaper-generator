/**
 * Device size constants for Apple devices
 */

import { DeviceSize, DeviceType, BackgroundStyle, WallpaperConfig } from './types';

export const DEVICE_SIZES: Record<DeviceType, DeviceSize[]> = {
  computer: [
    { width: 2560, height: 1440, name: 'Computer', type: 'computer' },
  ],
  phone: [
    { width: 1170, height: 2532, name: 'Phone', type: 'phone' },
  ],
  tablet: [
    { width: 2048, height: 2732, name: 'Tablet', type: 'tablet' },
  ],
  custom: [],
};

export const DEFAULT_DEVICE: DeviceSize = DEVICE_SIZES.computer[0];

export const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Verdana', label: 'Verdana' },
];

export const GRID_TILES_PER_ROW_OPTIONS = [2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30];
export const GRID_ROWS_OPTIONS = [2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50, 60];
export const ROWS_COUNT_OPTIONS = [3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50, 60];

export const DEFAULT_BACKGROUND_STYLE: BackgroundStyle = {
  mode: 'solid',
  colors: ['#050505'],
  angle: 45,
};

export interface BackgroundPreset extends BackgroundStyle {
  label: string;
  description: string;
}

export const BACKGROUND_VIBE_PRESETS: BackgroundPreset[] = [
  {
    label: 'Synthwave',
    description: 'Neon pinks + purples for a retro rave',
    mode: 'linear',
    colors: ['#4ADE80', '#7A5AF8'],
    angle: 125,
  },
  {
    label: 'After Hours',
    description: 'Moody blues for late-night listens',
    mode: 'radial',
    colors: ['#040308', '#1B264F', '#3A7BD5'],
    angle: 90,
  },
  {
    label: 'Golden Hour',
    description: 'Warm amber fade for vibey sunsets',
    mode: 'linear',
    colors: ['#FDE047', '#FB923C'],
    angle: 32,
  },
  {
    label: 'Electric Mint',
    description: 'Punchy neon green pop',
    mode: 'solid',
    colors: ['#00F5A0'],
    angle: 0,
  },
];

export const DEFAULT_CONFIG: WallpaperConfig = {
  device: DEFAULT_DEVICE,
  contentType: 'albums' as const,
  layout: 'grid' as const,
  gridTiles: 4,
  showTitles: false,
  titleFont: 'Courier New',
  blurColor: '#000000',
  blurOpacity: 0.5,
  background: DEFAULT_BACKGROUND_STYLE,
};
