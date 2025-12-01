'use client';

import { Layout, DeviceSize } from '@/lib/wallpaper/types';
import {
  GRID_TILES_PER_ROW_OPTIONS,
  GRID_ROWS_OPTIONS,
  ROWS_COUNT_OPTIONS,
} from '@/lib/wallpaper/constants';
import { calculateMaxGrid } from '@/lib/wallpaper/utils';

interface LayoutSelectorProps {
  layout: Layout;
  gridTiles: number;
  gridRows?: number;
  rowsCount?: number;
  itemCount?: number;
  device?: DeviceSize;
  onLayoutChange: (layout: Layout) => void;
  onGridTilesChange: (tiles: number) => void;
  onGridRowsChange: (rows: number) => void;
  onRowsCountChange: (count: number) => void;
}

export default function LayoutSelector({
  layout,
  gridTiles,
  gridRows,
  rowsCount,
  itemCount = 0,
  device,
  onLayoutChange,
  onGridTilesChange,
  onGridRowsChange,
  onRowsCountChange,
}: LayoutSelectorProps) {
  // Calculate dynamic options based on item count
  const getDynamicTilesPerRowOptions = () => {
    if (itemCount === 0) return GRID_TILES_PER_ROW_OPTIONS;
    
    // For large playlists, generate additional options dynamically
    const baseMax = Math.max(...GRID_TILES_PER_ROW_OPTIONS);
    let maxReasonableTiles = baseMax;
    
    // For very large playlists, allow more tiles per row
    if (itemCount > baseMax * 20) {
      // Calculate optimal tiles per row for large playlists
      const optimalTiles = Math.ceil(Math.sqrt(itemCount / 30)); // Aim for ~30 rows
      maxReasonableTiles = Math.min(optimalTiles * 1.5, itemCount, 50); // Cap at 50
    } else {
      maxReasonableTiles = Math.min(
        baseMax,
        itemCount,
        Math.ceil(Math.sqrt(itemCount) * 1.5)
      );
    }
    
    const filtered = GRID_TILES_PER_ROW_OPTIONS.filter(tiles => tiles <= maxReasonableTiles);
    
    // For large playlists, add intermediate values if needed
    if (itemCount > 200 && maxReasonableTiles > baseMax) {
      const additionalOptions: number[] = [];
      for (let i = baseMax + 5; i <= maxReasonableTiles; i += 5) {
        additionalOptions.push(i);
      }
      filtered.push(...additionalOptions);
    }
    
    // Always include at least the minimum option and current selection
    const minOption = Math.min(...GRID_TILES_PER_ROW_OPTIONS);
    const options = new Set([minOption, gridTiles, ...filtered]);
    return Array.from(options).sort((a, b) => a - b);
  };

  const getDynamicRowsOptions = () => {
    if (itemCount === 0) return GRID_ROWS_OPTIONS;
    
    // Calculate minimum rows needed to show all items
    const minRowsNeeded = Math.ceil(itemCount / gridTiles);
    
    // For large playlists, generate additional options dynamically
    const baseMax = Math.max(...GRID_ROWS_OPTIONS);
    let maxReasonableRows = baseMax;
    
    // For very large playlists, allow more rows
    if (itemCount > baseMax * gridTiles) {
      // Allow enough rows to show all items, plus some buffer
      maxReasonableRows = Math.min(minRowsNeeded + 10, 100); // Cap at 100 rows
    } else {
      maxReasonableRows = Math.min(
        baseMax,
        Math.max(minRowsNeeded + 2, Math.ceil(itemCount / 2))
      );
    }
    
    const filtered = GRID_ROWS_OPTIONS.filter(rows => rows <= maxReasonableRows);
    
    // For large playlists, add intermediate values if needed
    if (itemCount > 200 && maxReasonableRows > baseMax) {
      const additionalOptions: number[] = [];
      for (let i = baseMax + 5; i <= maxReasonableRows; i += 5) {
        additionalOptions.push(i);
      }
      filtered.push(...additionalOptions);
    }
    
    // Always include at least the minimum option and current selection
    const minOption = Math.min(...GRID_ROWS_OPTIONS);
    const options = new Set([minOption, gridRows || minOption, ...filtered]);
    return Array.from(options).sort((a, b) => a - b);
  };

  const getDynamicRowsCountOptions = () => {
    if (itemCount === 0) return ROWS_COUNT_OPTIONS;
    
    // Maximum rows count should not exceed item count
    const baseMax = Math.max(...ROWS_COUNT_OPTIONS);
    const maxReasonableRows = Math.min(baseMax, itemCount);
    
    const filtered = ROWS_COUNT_OPTIONS.filter(count => count <= maxReasonableRows);
    
    // For large playlists, add intermediate values if needed
    if (itemCount > 200 && maxReasonableRows === baseMax && itemCount > baseMax) {
      const additionalOptions: number[] = [];
      for (let i = baseMax + 5; i <= Math.min(itemCount, 100); i += 5) {
        additionalOptions.push(i);
      }
      filtered.push(...additionalOptions);
    }
    
    // Always include at least the minimum option and current selection
    const minOption = Math.min(...ROWS_COUNT_OPTIONS);
    const options = new Set([minOption, rowsCount || minOption, ...filtered]);
    return Array.from(options).sort((a, b) => a - b);
  };

  const dynamicTilesPerRowOptions = getDynamicTilesPerRowOptions();
  const dynamicRowsOptions = getDynamicRowsOptions();
  const dynamicRowsCountOptions = getDynamicRowsCountOptions();
  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-black uppercase tracking-wider">
        Layout
      </label>

      {/* Layout Type Selector */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onLayoutChange('grid')}
          className={`flex-1 px-4 py-3 border-2 font-semibold uppercase tracking-wider transition-all ${
            layout === 'grid'
              ? 'bg-black text-white border-black'
              : 'bg-white text-black border-black hover:bg-gray-100'
          }`}
        >
          Grid
        </button>
        <button
          type="button"
          onClick={() => onLayoutChange('rows')}
          className={`flex-1 px-4 py-3 border-2 font-semibold uppercase tracking-wider transition-all ${
            layout === 'rows'
              ? 'bg-black text-white border-black'
              : 'bg-white text-black border-black hover:bg-gray-100'
          }`}
        >
          Rows
        </button>
      </div>

      {/* Grid Layout Options */}
      {layout === 'grid' && (
        <div className="space-y-4 p-4 border-2 border-black bg-white">
          <div>
            <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-2">
              Tiles per Row
            </label>
            <select
              value={gridTiles}
              onChange={(e) => onGridTilesChange(Number(e.target.value))}
              className="w-full px-3 py-2 border-2 border-black text-black focus:outline-none focus:border-[#4ADE80] focus:ring-2 focus:ring-[#4ADE80]/20 bg-white"
            >
              {dynamicTilesPerRowOptions.map((tiles) => (
                <option key={tiles} value={tiles}>
                  {tiles}
                </option>
              ))}
            </select>
          </div>

          {gridRows !== undefined && (
            <div>
              <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-2">
                Rows
              </label>
              <select
                value={gridRows}
                onChange={(e) => onGridRowsChange(Number(e.target.value))}
                className="w-full px-3 py-2 border-2 border-black text-black focus:outline-none focus:border-[#4ADE80] focus:ring-2 focus:ring-[#4ADE80]/20 bg-white"
              >
                {dynamicRowsOptions.map((rows) => (
                  <option key={rows} value={rows}>
                    {rows}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Rows Layout Options */}
      {layout === 'rows' && rowsCount !== undefined && (
        <div className="space-y-4 p-4 border-2 border-black bg-white">
          <div>
            <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-2">
              Rows Count
            </label>
            <select
              value={rowsCount}
              onChange={(e) => onRowsCountChange(Number(e.target.value))}
              className="w-full px-3 py-2 border-2 border-black text-black focus:outline-none focus:border-[#4ADE80] focus:ring-2 focus:ring-[#4ADE80]/20 bg-white"
            >
              {dynamicRowsCountOptions.map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
