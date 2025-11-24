/**
 * Device size constants for Apple devices
 */

import { DeviceSize, DeviceType } from './types';

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

export const DEFAULT_CONFIG = {
  device: DEFAULT_DEVICE,
  contentType: 'albums' as const,
  layout: 'grid' as const,
  gridTiles: 4,
  showTitles: false,
  titleFont: 'Courier New',
  blurColor: '#000000',
  blurOpacity: 0.5,
};
