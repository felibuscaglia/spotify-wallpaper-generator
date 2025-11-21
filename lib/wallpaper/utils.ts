/**
 * Utility functions for wallpaper generation
 */

import { SpotifyPlaylist } from '@/lib/integrations/spotify/types';
import { AlbumData, TrackData, DeviceSize } from './types';

/**
 * Extract unique albums from playlist tracks
 */
export function extractUniqueAlbums(playlist: SpotifyPlaylist): AlbumData[] {
  const albumMap = new Map<string, AlbumData>();

  playlist.tracks.items.forEach((item) => {
    if (!item.track) return;

    const track = item.track;
    const album = track.album;

    if (!albumMap.has(album.id)) {
      albumMap.set(album.id, {
        id: album.id,
        name: album.name,
        imageUrl: album.images[0]?.url || '',
        artist: album.artists.map((a) => a.name).join(', '),
      });
    }
  });

  return Array.from(albumMap.values());
}

/**
 * Extract all tracks from playlist
 */
export function extractTracks(playlist: SpotifyPlaylist): TrackData[] {
  return playlist.tracks.items
    .filter((item) => item.track !== null)
    .map((item) => {
      const track = item.track!;
      return {
        id: track.id,
        name: track.name,
        albumName: track.album.name,
        imageUrl: track.album.images[0]?.url || '',
        artist: track.artists.map((a) => a.name).join(', '),
      };
    });
}

/**
 * Load image from URL
 */
export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Draw blurred background
 */
export function drawBlurredBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string,
  opacity: number
): void {
  ctx.fillStyle = color;
  ctx.globalAlpha = opacity;
  ctx.fillRect(0, 0, width, height);
  ctx.globalAlpha = 1.0;
}

/**
 * Draw text with background blur
 */
export function drawTextWithBlur(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fontSize: number,
  fontFamily: string,
  textColor: string,
  blurColor: string,
  blurOpacity: number,
  maxWidth?: number
): void {
  ctx.save();

  // Set font
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Calculate text dimensions
  const metrics = ctx.measureText(text);
  const textWidth = metrics.width;
  const textHeight = fontSize;
  const padding = 16;

  // Draw blur background
  ctx.fillStyle = blurColor;
  ctx.globalAlpha = blurOpacity;
  ctx.fillRect(
    x - (maxWidth || textWidth) / 2 - padding,
    y - textHeight / 2 - padding,
    (maxWidth || textWidth) + padding * 2,
    textHeight + padding * 2
  );

  // Draw text
  ctx.globalAlpha = 1.0;
  ctx.fillStyle = textColor;
  if (maxWidth) {
    // Handle text wrapping if needed
    const words = text.split(' ');
    let line = '';
    let lineY = y - (words.length - 1) * (textHeight + 4) / 2;
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const testWidth = ctx.measureText(testLine).width;
      
      if (testWidth > maxWidth && i > 0) {
        ctx.fillText(line, x, lineY);
        line = words[i] + ' ';
        lineY += textHeight + 4;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, lineY);
  } else {
    ctx.fillText(text, x, y);
  }

  ctx.restore();
}

/**
 * Calculate optimal grid configuration based on device and item count
 */
export function calculateOptimalGrid(
  device: DeviceSize,
  itemCount: number
): { tilesPerRow: number; rows: number } {
  const aspectRatio = device.width / device.height;
  
  // For landscape devices (computers), prefer more columns
  // For portrait devices (phones), prefer more rows
  let tilesPerRow = 4;
  if (aspectRatio > 1.5) {
    // Landscape (computers)
    tilesPerRow = Math.min(6, Math.max(3, Math.floor(Math.sqrt(itemCount * aspectRatio))));
  } else if (aspectRatio < 0.8) {
    // Portrait (phones)
    tilesPerRow = Math.min(4, Math.max(2, Math.floor(Math.sqrt(itemCount / aspectRatio))));
  } else {
    // Square-ish (tablets)
    tilesPerRow = Math.min(5, Math.max(3, Math.floor(Math.sqrt(itemCount))));
  }
  
  // Calculate rows - use fewer rows for better aesthetics
  // Aim for 2-4 rows for most cases, max 6 rows
  const maxRows = aspectRatio > 1.5 ? 4 : aspectRatio < 0.8 ? 6 : 5;
  const rows = Math.min(maxRows, Math.ceil(itemCount / tilesPerRow));
  
  return { tilesPerRow, rows };
}

/**
 * Calculate optimal rows count for rows layout
 */
export function calculateOptimalRows(
  device: DeviceSize,
  itemCount: number
): number {
  // For taller devices, we can fit more rows
  // Aim to show as many as possible while maintaining good visual appearance
  const aspectRatio = device.width / device.height;
  
  // Use fewer rows for better aesthetics - aim for 4-8 rows typically
  if (aspectRatio < 0.8) {
    // Portrait devices - can fit more but keep it aesthetic
    return Math.min(itemCount, Math.max(4, Math.floor(device.height / 300)));
  } else if (aspectRatio > 1.5) {
    // Landscape devices - fewer rows for better look
    return Math.min(itemCount, Math.max(3, Math.floor(device.height / 400)));
  } else {
    // Square-ish devices
    return Math.min(itemCount, Math.max(4, Math.floor(device.height / 350)));
  }
}
