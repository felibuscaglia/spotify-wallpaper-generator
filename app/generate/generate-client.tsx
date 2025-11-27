'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { SpotifyPlaylist } from '@/lib/integrations/spotify/types';
import { WallpaperConfig, AlbumData, TrackData } from '@/lib/wallpaper/types';
import { DEFAULT_CONFIG, DEFAULT_DEVICE } from '@/lib/wallpaper/constants';
import { extractUniqueAlbums, extractTracks, calculateOptimalGrid, calculateOptimalRows, calculateLayoutFillStats } from '@/lib/wallpaper/utils';
import DeviceSelector from './components/device-selector';
import LayoutSelector from './components/layout-selector';
import ContentTypeSelector from './components/content-type-selector';
import WallpaperPreview, { WallpaperPreviewHandle } from './components/wallpaper-preview';
import BackgroundCustomizer from './components/background-customizer';

interface GenerateClientProps {
  playlist: SpotifyPlaylist;
}

export default function GenerateClient({ playlist }: GenerateClientProps) {
  const previewRef = useRef<WallpaperPreviewHandle>(null);
  const controlsPanelRef = useRef<HTMLDivElement>(null);
  const previewPanelRef = useRef<HTMLDivElement>(null);
  const previewContentRef = useRef<HTMLDivElement>(null);
  const [formStep, setFormStep] = useState<'layout' | 'background'>('layout');
  const [config, setConfig] = useState<WallpaperConfig>({
    ...DEFAULT_CONFIG,
    device: DEFAULT_DEVICE,
  });
  const [availableHeight, setAvailableHeight] = useState<number | null>(null);

  // Match preview panel height to controls panel height
  useEffect(() => {
    const updateHeight = () => {
      if (controlsPanelRef.current && previewPanelRef.current && previewContentRef.current) {
        const controlsHeight = controlsPanelRef.current.offsetHeight;
        previewPanelRef.current.style.height = `${controlsHeight}px`;
        
        // Calculate available height for preview content (subtract padding and header)
        const headerHeight = 48; // h2 + mb-6
        const padding = 48; // p-6 top and bottom
        const available = controlsHeight - headerHeight - padding;
        setAvailableHeight(available);
      }
    };

    updateHeight();
    
    // Use ResizeObserver for more accurate tracking
    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });
    
    if (controlsPanelRef.current) {
      resizeObserver.observe(controlsPanelRef.current);
    }
    
    window.addEventListener('resize', updateHeight);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, [config]);

  // Extract data based on content type
  const albums = useMemo(() => extractUniqueAlbums(playlist), [playlist]);
  const tracks = useMemo(() => extractTracks(playlist), [playlist]);

  const displayItems = useMemo(() => {
    return config.contentType === 'albums' ? albums : tracks;
  }, [config.contentType, albums, tracks]);

  const fillStats = useMemo(
    () => calculateLayoutFillStats(config, displayItems.length),
    [config, displayItems.length]
  );

  const hasEmptySpace = fillStats.emptySlots > 0 && displayItems.length > 0;
  const shouldShowBackgroundStep = hasEmptySpace;

  useEffect(() => {
    if (!shouldShowBackgroundStep && formStep === 'background') {
      setFormStep('layout');
    }
  }, [formStep, shouldShowBackgroundStep]);

  // Calculate optimal defaults when device or items change
  useEffect(() => {
    if (displayItems.length === 0) return;

    const optimalGrid = calculateOptimalGrid(config.device, displayItems.length);
    const optimalRows = calculateOptimalRows(config.device, displayItems.length);

    setConfig((prev) => {
      // Only update if values are not already set or if device dimensions changed
      const deviceChanged = 
        prev.device.width !== config.device.width ||
        prev.device.height !== config.device.height;
      
      const needsUpdate = 
        deviceChanged ||
        !prev.gridTiles || 
        !prev.gridRows || 
        !prev.rowsCount;

      if (needsUpdate) {
        return {
          ...prev,
          gridTiles: optimalGrid.tilesPerRow,
          gridRows: optimalGrid.rows,
          rowsCount: optimalRows,
        };
      }
      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.device.width, config.device.height, displayItems.length]);

  const updateConfig = <K extends keyof WallpaperConfig>(
    key: K,
    value: WallpaperConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <a
            href="/"
            className="inline-block text-sm font-semibold text-black uppercase tracking-wider hover:text-[#FF4D6D] transition-colors mb-6"
          >
            ← Back
          </a>
          <h1 className="text-4xl font-bold text-black mb-2">{playlist.name}</h1>
          {playlist.description && (
            <p className="text-gray-600 mb-4">{playlist.description}</p>
          )}
          <p className="text-sm text-gray-500">
            {playlist.tracks.total} tracks • By {playlist.owner.display_name || 'Unknown'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Controls Panel */}
          <div className="lg:col-span-1">
            <div ref={controlsPanelRef} className="bg-white border-2 border-black shadow-[8px_8px_0_0_#000] p-6 space-y-6">
              {shouldShowBackgroundStep && (
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-black">
                  <span>
                    Step {formStep === 'layout' ? '1' : '2'} of 2
                  </span>
                </div>
              )}

              {formStep === 'layout' && (
                <>
                  <ContentTypeSelector
                    contentType={config.contentType}
                    onContentTypeChange={(type) => updateConfig('contentType', type)}
                  />

                  <div className="border-t-2 border-black"></div>

                  <DeviceSelector
                    selectedDevice={config.device}
                    onDeviceChange={(device) => updateConfig('device', device)}
                  />

                  <div className="border-t-2 border-black"></div>

                  <LayoutSelector
                    layout={config.layout}
                    gridTiles={config.gridTiles || 4}
                    gridRows={config.gridRows}
                    rowsCount={config.rowsCount}
                    itemCount={displayItems.length}
                    device={config.device}
                    onLayoutChange={(layout) => updateConfig('layout', layout)}
                    onGridTilesChange={(tiles) => updateConfig('gridTiles', tiles)}
                    onGridRowsChange={(rows) => updateConfig('gridRows', rows)}
                    onRowsCountChange={(count) => updateConfig('rowsCount', count)}
                  />

                  {shouldShowBackgroundStep && (
                    <button
                      type="button"
                      onClick={() => setFormStep('background')}
                      className="w-full px-4 py-3 border-2 border-black bg-black text-white text-sm font-semibold uppercase tracking-wider hover:bg-[#FF4D6D] transition"
                    >
                      Next: Fill The Empty Space
                    </button>
                  )}
                </>
              )}

              {formStep === 'background' && shouldShowBackgroundStep && (
                <>
                  <BackgroundCustomizer
                    background={config.background}
                    fillStats={fillStats}
                    itemCount={displayItems.length}
                    onChange={(background) => updateConfig('background', background)}
                  />
                  <button
                    type="button"
                    onClick={() => setFormStep('layout')}
                    className="w-full px-4 py-3 border-2 border-black text-black text-sm font-semibold uppercase tracking-wider hover:bg-gray-50 transition -mt-4"
                  >
                    Back to Layout Details
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <div ref={previewPanelRef} className="bg-white border-2 border-black shadow-[8px_8px_0_0_#000] p-6 flex flex-col">
              <h2 className="text-xl font-bold text-black mb-6 uppercase tracking-wider">
                Preview
              </h2>
              <div ref={previewContentRef} className="flex-1 flex flex-col items-center justify-center min-h-0">
                {displayItems.length > 0 ? (
                  <WallpaperPreview 
                    ref={previewRef} 
                    config={config} 
                    items={displayItems}
                    maxHeight={availableHeight}
                  />
                ) : (
                  <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300">
                    <p className="text-gray-500">No items to display</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

