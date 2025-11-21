'use client';

import { DeviceSize } from '@/lib/wallpaper/types';
import { DEVICE_SIZES } from '@/lib/wallpaper/constants';

interface DeviceSelectorProps {
  selectedDevice: DeviceSize;
  onDeviceChange: (device: DeviceSize) => void;
}

export default function DeviceSelector({
  selectedDevice,
  onDeviceChange,
}: DeviceSelectorProps) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-black uppercase tracking-wider">
        Device
      </label>
      <div className="space-y-3">
        {Object.entries(DEVICE_SIZES).map(([type, devices]) => {
          if (type === 'custom' || devices.length === 0) return null;
          
          return devices.map((device) => (
            <button
              key={`${type}-${device.width}x${device.height}`}
              type="button"
              onClick={() => onDeviceChange(device)}
              className={`w-full px-4 py-3 border-2 font-semibold uppercase tracking-wider transition-all text-left ${
                selectedDevice.width === device.width &&
                selectedDevice.height === device.height
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-black hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{device.name}</span>
                <span className="text-xs opacity-75">
                  {device.width} × {device.height}
                </span>
              </div>
            </button>
          ));
        })}
      </div>
    </div>
  );
}
