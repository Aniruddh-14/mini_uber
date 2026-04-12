'use client';

import React from 'react';

export default function LiveMap({ activeRide, driverLocation }: { activeRide: any, driverLocation?: any }) {
  // We simulate a map using a grid and absolute positioned dots
  // The map area is 40.7000 to 40.7500 (Lat), -74.0500 to -73.9500 (Lng)
  
  const mapLatToY = (lat: number) => {
    const minLat = 40.7000;
    const maxLat = 40.7500;
    // inverse because higher lat is "up" but Y goes down in CSS
    return 100 - ((lat - minLat) / (maxLat - minLat)) * 100;
  };

  const mapLngToX = (lng: number) => {
    const minLng = -74.0500;
    const maxLng = -73.9500;
    return ((lng - minLng) / (maxLng - minLng)) * 100;
  };

  return (
    <div style={{
      width: '100%',
      height: '300px',
      background: 'url("data:image/svg+xml;utf8,<svg xmlns=\\\'http://www.w3.org/2000/svg\\\' width=\\\'100\\\' height=\\\'100\\\'><rect width=\\\'100\\\' height=\\\'100\\\' fill=\\\'%231f1f3a\\\'/><path d=\\\'M0 20 L100 20 M0 40 L100 40 M0 60 L100 60 M0 80 L100 80 M20 0 L20 100 M40 0 L40 100 M60 0 L60 100 M80 0 L80 100\\\' stroke=\\\'%23333355\\\' stroke-width=\\\'1\\\'/></svg>")',
      borderRadius: '8px',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid var(--glass-border)'
    }}>
      {/* Pickup Location Point */}
      {activeRide && activeRide.pickupLocation && (
        <div style={{
          position: 'absolute',
          top: `${mapLatToY(activeRide.pickupLocation.lat)}%`,
          left: `${mapLngToX(activeRide.pickupLocation.lng)}%`,
          width: '16px', height: '16px', background: 'var(--accent-primary)',
          borderRadius: '50%', transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 10px var(--accent-primary)'
        }} title="Pickup" />
      )}

      {/* Drop Location Point */}
      {activeRide && activeRide.dropLocation && (
        <div style={{
           position: 'absolute',
           top: `${mapLatToY(activeRide.dropLocation.lat)}%`,
           left: `${mapLngToX(activeRide.dropLocation.lng)}%`,
           width: '16px', height: '16px', background: 'var(--success)',
           borderRadius: '50%', transform: 'translate(-50%, -50%)',
           boxShadow: '0 0 10px var(--success)',
           border: '2px solid white'
        }} title="Drop-off" />
      )}

      {/* Connecting Line if matched/ongoing */}
      {activeRide && activeRide.driver && activeRide.status !== 'COMPLETED' && (
         <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
           <line 
             x1={`${mapLngToX(activeRide.pickupLocation.lng)}%`} 
             y1={`${mapLatToY(activeRide.pickupLocation.lat)}%`} 
             x2={`${mapLngToX(driverLocation?.lng || activeRide.dropLocation.lng)}%`} 
             y2={`${mapLatToY(driverLocation?.lat || activeRide.dropLocation.lat)}%`} 
             stroke="var(--accent-primary)" 
             strokeWidth="2" 
             strokeDasharray="4" 
           />
         </svg>
      )}

      {/* Driver Location Point */}
      {driverLocation && (
        <div style={{
           position: 'absolute',
           top: `${mapLatToY(driverLocation.lat)}%`,
           left: `${mapLngToX(driverLocation.lng)}%`,
           width: '20px', height: '20px', background: 'black',
           borderRadius: '4px', transform: 'translate(-50%, -50%)',
           border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center',
           fontSize: '10px'
        }} title="Driver">🚗</div>
      )}
    </div>
  );
}
