'use client';

import { Layout } from '@/lib/wallpaper/types';
import {
  GRID_TILES_PER_ROW_OPTIONS,
  GRID_ROWS_OPTIONS,
  ROWS_COUNT_OPTIONS,
} from '@/lib/wallpaper/constants';

interface LayoutSelectorProps {
  layout: Layout;
  gridTiles: number;
  gridRows?: number;
  rowsCount?: number;
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
  onLayoutChange,
  onGridTilesChange,
  onGridRowsChange,
  onRowsCountChange,
}: LayoutSelectorProps) {
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
              Tiles per Row: {gridTiles}
            </label>
            <select
              value={gridTiles}
              onChange={(e) => onGridTilesChange(Number(e.target.value))}
              className="w-full px-3 py-2 border-2 border-black text-black focus:outline-none focus:border-[#1DB954] focus:ring-2 focus:ring-[#1DB954]/20 bg-white"
            >
              {GRID_TILES_PER_ROW_OPTIONS.map((tiles) => (
                <option key={tiles} value={tiles}>
                  {tiles}
                </option>
              ))}
            </select>
          </div>

          {gridRows !== undefined && (
            <div>
              <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-2">
                Rows: {gridRows}
              </label>
              <select
                value={gridRows}
                onChange={(e) => onGridRowsChange(Number(e.target.value))}
                className="w-full px-3 py-2 border-2 border-black text-black focus:outline-none focus:border-[#1DB954] focus:ring-2 focus:ring-[#1DB954]/20 bg-white"
              >
                {GRID_ROWS_OPTIONS.map((rows) => (
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
              Rows Count: {rowsCount}
            </label>
            <select
              value={rowsCount}
              onChange={(e) => onRowsCountChange(Number(e.target.value))}
              className="w-full px-3 py-2 border-2 border-black text-black focus:outline-none focus:border-[#1DB954] focus:ring-2 focus:ring-[#1DB954]/20 bg-white"
            >
              {ROWS_COUNT_OPTIONS.map((count) => (
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
