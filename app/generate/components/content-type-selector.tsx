'use client';

import { ContentType } from '@/lib/wallpaper/types';

interface ContentTypeSelectorProps {
  contentType: ContentType;
  onContentTypeChange: (type: ContentType) => void;
}

export default function ContentTypeSelector({
  contentType,
  onContentTypeChange,
}: ContentTypeSelectorProps) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-black dark:text-white uppercase tracking-wider">
        Content
      </label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onContentTypeChange('albums')}
          className={`flex-1 px-4 py-3 border-2 font-semibold uppercase tracking-wider transition-all ${
            contentType === 'albums'
              ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
              : 'bg-white dark:bg-[#0f0f0f] text-black dark:text-white border-black dark:border-white hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          Albums
        </button>
        <button
          type="button"
          onClick={() => onContentTypeChange('tracks')}
          className={`flex-1 px-4 py-3 border-2 font-semibold uppercase tracking-wider transition-all ${
            contentType === 'tracks'
              ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
              : 'bg-white dark:bg-[#0f0f0f] text-black dark:text-white border-black dark:border-white hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          Tracks
        </button>
      </div>
    </div>
  );
}
