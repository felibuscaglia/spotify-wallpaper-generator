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
      <label className="block text-sm font-semibold text-black uppercase tracking-wider">
        Content
      </label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onContentTypeChange('tracks')}
          className={`flex-1 px-4 py-3 border-2 font-semibold uppercase tracking-wider transition-all ${
            contentType === 'tracks'
              ? 'bg-black text-white border-black'
              : 'bg-white text-black border-black hover:bg-gray-100'
          }`}
        >
          Tracks
        </button>
        <button
          type="button"
          onClick={() => onContentTypeChange('albums')}
          className={`flex-1 px-4 py-3 border-2 font-semibold uppercase tracking-wider transition-all ${
            contentType === 'albums'
              ? 'bg-black text-white border-black'
              : 'bg-white text-black border-black hover:bg-gray-100'
          }`}
        >
          Albums
        </button>
      </div>
    </div>
  );
}


