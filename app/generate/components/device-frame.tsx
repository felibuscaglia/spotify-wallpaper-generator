'use client';

import { DeviceSize } from '@/lib/wallpaper/types';
import { ReactNode } from 'react';

interface DeviceFrameProps {
  device: DeviceSize;
  children: ReactNode;
  scale?: number;
}

export default function DeviceFrame({ device, children, scale = 1 }: DeviceFrameProps) {
  const scaledWidth = device.width * scale;
  const scaledHeight = device.height * scale;

  // Thin bezels - Apple devices have very minimal bezels
  // iPhone: ~3-4mm in real life, scaled proportionally
  // iPad: ~5-6mm
  // Mac: ~8-10mm
  const baseBezel = device.type === 'phone' ? 8 : device.type === 'tablet' ? 12 : 16;
  const bezelWidth = Math.max(6, baseBezel * scale);
  
  // Very rounded corners for iPhone (Apple's signature pill shape)
  // Corner radius should be proportional to device size
  const cornerRadius = device.type === 'phone' 
    ? Math.min(60 * scale, scaledHeight * 0.12) // Very rounded, but not more than 12% of height
    : device.type === 'tablet' 
    ? 32 * scale 
    : 12 * scale;
  
  // Screen corner radius - slightly smaller than frame
  const screenRadius = device.type === 'phone' 
    ? Math.min(55 * scale, scaledHeight * 0.11)
    : device.type === 'tablet' 
    ? 28 * scale 
    : 8 * scale;

  // Notch for iPhone - more subtle and realistic
  const notchWidth = 110 * scale;
  const notchHeight = 25 * scale;
  const notchRadius = 16 * scale;

  const frameStyle: React.CSSProperties = {
    width: `${scaledWidth + bezelWidth * 2}px`,
    height: `${scaledHeight + bezelWidth * 2}px`,
    padding: `${bezelWidth}px`,
    borderRadius: `${cornerRadius}px`,
    backgroundColor: '#000000',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    position: 'relative',
    display: 'inline-block',
  };

  const screenStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    borderRadius: `${screenRadius}px`,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000000',
  };

  return (
    <div style={frameStyle} className="device-frame">
      {/* Notch for iPhone */}
      {device.type === 'phone' && (
        <div
          style={{
            position: 'absolute',
            top: `${bezelWidth - notchHeight / 2}px`,
            left: '50%',
            transform: 'translateX(-50%)',
            width: `${notchWidth}px`,
            height: `${notchHeight}px`,
            backgroundColor: '#000000',
            borderRadius: `0 0 ${notchRadius}px ${notchRadius}px`,
            zIndex: 10,
          }}
        />
      )}

      {/* Screen container */}
      <div style={screenStyle}>
        {children}
      </div>

      {/* Home indicator for iPhone - subtle white bar */}
      {device.type === 'phone' && (
        <div
          style={{
            position: 'absolute',
            bottom: `${bezelWidth * 0.6}px`,
            left: '50%',
            transform: 'translateX(-50%)',
            width: `${134 * scale}px`,
            height: `${4 * scale}px`,
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            borderRadius: `${2 * scale}px`,
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
}
