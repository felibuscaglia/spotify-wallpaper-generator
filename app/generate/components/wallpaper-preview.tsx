'use client';

import { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { WallpaperConfig, AlbumData, TrackData } from '@/lib/wallpaper/types';
import { loadImage, drawTextWithBlur } from '@/lib/wallpaper/utils';
import DeviceFrame from './device-frame';

export interface WallpaperPreviewHandle {
  getCanvas: () => HTMLCanvasElement | null;
}

interface WallpaperPreviewProps {
  config: WallpaperConfig;
  items: (AlbumData | TrackData)[];
  isLoading?: boolean;
  maxHeight?: number | null;
}

const WallpaperPreview = forwardRef<WallpaperPreviewHandle, WallpaperPreviewProps>(
  ({ config, items, isLoading = false, maxHeight }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isRendering, setIsRendering] = useState(false);

    const {
      device,
      layout,
      gridTiles = 4,
      gridRows,
      rowsCount,
      showTitles,
      titleFont,
      blurColor,
      blurOpacity,
    } = config;

    useImperativeHandle(ref, () => ({
      getCanvas: () => canvasRef.current,
    }));

    // Initialize canvas size
    useEffect(() => {
      if (canvasRef.current) {
        canvasRef.current.width = device.width;
        canvasRef.current.height = device.height;
      }
    }, [device.width, device.height]);

    useEffect(() => {
      if (!canvasRef.current || items.length === 0) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Ensure canvas size is set
      canvas.width = device.width;
      canvas.height = device.height;

      setIsRendering(true);

      const renderWallpaper = async () => {
        // Clear canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Load all images
        const imagePromises = items.map((item) => loadImage(item.imageUrl));
        const loadedImages = await Promise.all(imagePromises);

        if (layout === 'grid') {
          await renderGridLayout(ctx, canvas, loadedImages, items);
        } else {
          await renderRowsLayout(ctx, canvas, loadedImages, items);
        }

        setIsRendering(false);
      };

      renderWallpaper();
    }, [
      config,
      items,
      device,
      layout,
      gridTiles,
      gridRows,
      rowsCount,
      showTitles,
      titleFont,
      blurColor,
      blurOpacity,
    ]);

    const renderGridLayout = async (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      images: HTMLImageElement[],
      items: (AlbumData | TrackData)[]
    ) => {
      const cols = gridTiles || 4; // Tiles per row
      const rows = gridRows || Math.ceil(images.length / cols);
      const tileWidth = canvas.width / cols;
      const tileHeight = canvas.height / rows;
      let imageIndex = 0;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (imageIndex >= images.length) break;

          const x = col * tileWidth;
          const y = row * tileHeight;
          const img = images[imageIndex];
          const item = items[imageIndex];

          // Draw image filling the entire tile (cover mode - crop to fill)
          const imgAspect = img.width / img.height;
          const tileAspect = tileWidth / tileHeight;
          
          let sourceX = 0;
          let sourceY = 0;
          let sourceWidth = img.width;
          let sourceHeight = img.height;

          // Calculate source crop to fill tile while maintaining aspect ratio
          if (imgAspect > tileAspect) {
            // Image is wider than tile - crop width
            sourceWidth = img.height * tileAspect;
            sourceX = (img.width - sourceWidth) / 2;
          } else {
            // Image is taller than tile - crop height
            sourceHeight = img.width / tileAspect;
            sourceY = (img.height - sourceHeight) / 2;
          }

          // Draw image filling the entire tile
          ctx.drawImage(
            img,
            sourceX, sourceY, sourceWidth, sourceHeight, // Source rectangle (cropped)
            x, y, tileWidth, tileHeight // Destination rectangle (full tile)
          );

          // Draw title if enabled
          if (showTitles && item) {
            const title = item.name;
            const fontSize = Math.min(tileWidth, tileHeight) * 0.08;
            drawTextWithBlur(
              ctx,
              title,
              x + tileWidth / 2,
              y + tileHeight - fontSize - 10,
              fontSize,
              titleFont,
              '#FFFFFF',
              blurColor,
              blurOpacity,
              tileWidth - 20
            );
          }

          imageIndex++;
        }
      }
    };

    const renderRowsLayout = async (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      images: HTMLImageElement[],
      items: (AlbumData | TrackData)[]
    ) => {
      const count = rowsCount || images.length;
      const visibleImages = images.slice(0, count);
      const visibleItems = items.slice(0, count);
      const rowHeight = canvas.height / count;

      visibleImages.forEach((img, index) => {
        const y = index * rowHeight;
        const item = visibleItems[index];

        // Draw image stretched to full width
        ctx.drawImage(img, 0, y, canvas.width, rowHeight);

        // Draw title if enabled
        if (showTitles && item) {
          const title = item.name;
          const fontSize = rowHeight * 0.15;
          drawTextWithBlur(
            ctx,
            title,
            canvas.width / 2,
            y + rowHeight / 2,
            fontSize,
            titleFont,
            '#FFFFFF',
            blurColor,
            blurOpacity,
            canvas.width - 40
          );
        }
      });
    };

    // Calculate scale based on width and available height
    const maxWidth = 600;
    const widthScale = maxWidth / device.width;
    
    // If maxHeight is provided, calculate height scale
    // Account for device frame bezel (thin Apple-style bezels)
    // Use base bezel for initial calculation, then refine with actual scale
    const baseBezel = device.type === 'phone' ? 8 : device.type === 'tablet' ? 12 : 16;
    let heightScale = Infinity;
    if (maxHeight !== null && maxHeight !== undefined) {
      // Estimate bezel for calculation (will be refined after scale is known)
      const estimatedBezel = Math.max(6, baseBezel * 0.5); // Use a conservative estimate
      const availableForContent = maxHeight - estimatedBezel * 2;
      heightScale = availableForContent / device.height;
    }
    
    const scale = Math.min(1, Math.min(widthScale, heightScale));
    const scaledWidth = device.width * scale;
    const scaledHeight = device.height * scale;

    return (
      <div className="flex flex-col items-center">
        {isRendering && (
          <div className="mb-4 text-sm text-gray-500">Rendering...</div>
        )}
        <DeviceFrame device={device} scale={scale}>
          <canvas
            ref={canvasRef}
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
            }}
            className="bg-black"
          />
        </DeviceFrame>
      </div>
    );
  }
);

WallpaperPreview.displayName = 'WallpaperPreview';

export default WallpaperPreview;
