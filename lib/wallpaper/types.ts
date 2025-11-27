/**
 * Type definitions for wallpaper generation
 */

export type ContentType = 'tracks' | 'albums';
export type Layout = 'grid' | 'rows';
export type DeviceType = 'computer' | 'phone' | 'tablet' | 'custom';
export type BackgroundMode = 'solid' | 'linear' | 'radial';

export interface DeviceSize {
  width: number;
  height: number;
  name: string;
  type: DeviceType;
}

export interface AlbumData {
  id: string;
  name: string;
  imageUrl: string;
  artist: string;
}

export interface TrackData {
  id: string;
  name: string;
  albumName: string;
  imageUrl: string;
  artist: string;
}

export interface BackgroundStyle {
  mode: BackgroundMode;
  colors: string[];
  angle: number;
}

export interface WallpaperConfig {
  device: DeviceSize;
  contentType: ContentType;
  layout: Layout;
  gridTiles?: number;
  gridRows?: number;
  rowsCount?: number;
  showTitles: boolean;
  titleFont: string;
  blurColor: string;
  blurOpacity: number;
  background: BackgroundStyle;
}
