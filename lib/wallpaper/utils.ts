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
 * Apply blur effect to entire canvas using filter
 */
export function applyCanvasBlur(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  blurAmount: number = 20
): void {
  // Create a temporary canvas to apply blur
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;

  // Copy current canvas content to temp canvas
  tempCtx.drawImage(canvas, 0, 0);

  // Clear original canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Apply blur filter and draw blurred image back
  ctx.filter = `blur(${blurAmount}px)`;
  ctx.drawImage(tempCanvas, 0, 0);
  ctx.filter = 'none';
}

/**
 * Draw text with natural backdrop blur - blends with cover art
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
  maxWidth?: number,
  canvas?: HTMLCanvasElement
): void {
  ctx.save();

  // Set font with better weight
  ctx.font = `600 ${fontSize}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Calculate text dimensions
  const metrics = ctx.measureText(text);
  const textWidth = metrics.width;
  const textHeight = fontSize;
  const padding = Math.max(16, fontSize * 0.4);
  const borderRadius = 12;

  // Calculate actual text bounds for wrapping
  let lines: string[] = [];
  if (maxWidth) {
    // Handle text wrapping if needed
    const words = text.split(' ');
    let line = '';
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const testWidth = ctx.measureText(testLine).width;
      
      if (testWidth > maxWidth && i > 0) {
        lines.push(line.trim());
        line = words[i] + ' ';
      } else {
        line = testLine;
      }
    }
    if (line.trim()) {
      lines.push(line.trim());
    }
  } else {
    lines = [text];
  }

  const totalTextHeight = lines.length * (textHeight + 4) - 4;
  const bgWidth = maxWidth ? maxWidth + padding * 2 : textWidth + padding * 2;
  const bgHeight = totalTextHeight + padding * 2;
  const bgX = x - bgWidth / 2;
  const bgY = y - bgHeight / 2;

  // Helper function to draw rounded rectangle path
  const drawRoundedRect = (x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  // Create natural backdrop blur effect - blur the cover art behind the text
  if (canvas) {
    // Extract the area behind the text from the canvas
    const sourceCanvas = document.createElement('canvas');
    sourceCanvas.width = bgWidth;
    sourceCanvas.height = bgHeight;
    const sourceCtx = sourceCanvas.getContext('2d');
    
    if (sourceCtx) {
      // Draw the area behind text to source canvas
      sourceCtx.drawImage(
        canvas,
        bgX, bgY, bgWidth, bgHeight,
        0, 0, bgWidth, bgHeight
      );

      // Create blurred version
      const blurredCanvas = document.createElement('canvas');
      blurredCanvas.width = bgWidth;
      blurredCanvas.height = bgHeight;
      const blurredCtx = blurredCanvas.getContext('2d');
      
      if (blurredCtx) {
        // Apply blur filter to create backdrop blur
        blurredCtx.filter = `blur(25px)`;
        blurredCtx.drawImage(sourceCanvas, 0, 0);
        blurredCtx.filter = 'none';

        // Draw the blurred backdrop with rounded corners and transparency
        ctx.save();
        drawRoundedRect(bgX, bgY, bgWidth, bgHeight, borderRadius);
        ctx.clip();
        
        // Draw blurred background with subtle tint
        ctx.globalAlpha = blurOpacity * 0.4;
        ctx.drawImage(blurredCanvas, bgX, bgY);
        
        // Add a very subtle overlay for better text contrast (optional, very light)
        ctx.globalAlpha = blurOpacity * 0.15;
        ctx.fillStyle = blurColor;
        ctx.fill();
        
        ctx.restore();
      }
    }
  }

  // Draw text with strong shadow/outline for readability
  ctx.globalAlpha = 1.0;
  ctx.fillStyle = textColor;
  
  // Multiple text shadows for better readability (outline effect)
  const shadowOffsets = [
    { x: 0, y: -1, blur: 3, alpha: 0.8 },
    { x: 0, y: 1, blur: 3, alpha: 0.8 },
    { x: -1, y: 0, blur: 3, alpha: 0.8 },
    { x: 1, y: 0, blur: 3, alpha: 0.8 },
    { x: 0, y: 0, blur: 8, alpha: 0.6 },
  ];

  const startY = y - (lines.length - 1) * (textHeight + 4) / 2;
  lines.forEach((line, index) => {
    const lineY = startY + index * (textHeight + 4);
    
    // Draw shadows first
    shadowOffsets.forEach(offset => {
      ctx.shadowColor = `rgba(0, 0, 0, ${offset.alpha})`;
      ctx.shadowBlur = offset.blur;
      ctx.shadowOffsetX = offset.x;
      ctx.shadowOffsetY = offset.y;
      ctx.fillText(line, x, lineY);
    });
    
    // Draw main text
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillText(line, x, lineY);
  });

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

/**
 * Calculate maximum grid configuration to show as many items as possible
 */
export function calculateMaxGrid(
  device: DeviceSize,
  itemCount: number,
  availableTilesPerRow: number[],
  availableRows: number[]
): { tilesPerRow: number; rows: number; totalShown: number } {
  let maxShown = 0;
  let bestConfig = { tilesPerRow: 4, rows: 2, totalShown: 0 };

  // Try all combinations to find the one that shows the most items
  for (const tilesPerRow of availableTilesPerRow) {
    for (const rows of availableRows) {
      const totalShown = tilesPerRow * rows;
      if (totalShown <= itemCount && totalShown > maxShown) {
        maxShown = totalShown;
        bestConfig = { tilesPerRow, rows, totalShown };
      }
    }
  }

  // If we found a perfect fit or close to it, return it
  if (maxShown > 0) {
    return bestConfig;
  }

  // Fallback: use the largest configuration that fits
  const maxTiles = Math.max(...availableTilesPerRow);
  const maxRows = Math.max(...availableRows);
  const fallbackTotal = maxTiles * maxRows;
  
  return {
    tilesPerRow: maxTiles,
    rows: maxRows,
    totalShown: Math.min(fallbackTotal, itemCount)
  };
}
