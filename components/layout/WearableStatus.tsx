'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function WearableStatus() {
  const [isConnected, setIsConnected] = useState(true);
  const [deviceName] = useState('Apple Watch Series 9');
  // Cache-Busting: Erhöhe diese Version, wenn das Bild aktualisiert wurde
  const imageVersion = '2';

  return (
    <div className="wearable-status">
      <div className="wearable-image-container">
        <Image
          src={`/images/watch.png?v=${imageVersion}`}
          alt="Wearable Device"
          width={60}
          height={60}
          style={{ objectFit: 'contain' }}
          unoptimized
        />
      </div>
      <div className="wearable-info">
        <div className="wearable-name">{deviceName}</div>
        <div className="wearable-status-indicator">
          <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
          <span className="status-text">
            {isConnected ? 'Verbunden' : 'Nicht verbunden'}
          </span>
        </div>
      </div>
    </div>
  );
}

