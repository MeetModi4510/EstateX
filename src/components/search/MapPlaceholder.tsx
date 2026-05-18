import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { motion } from 'framer-motion';

// Fix for default leaflet icons not showing in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapPlaceholderProps {
  properties?: any[];
}

export const MapPlaceholder: React.FC<MapPlaceholderProps> = ({ properties = [] }) => {
  const defaultCenter: [number, number] = [28.6139, 77.2090]; // New Delhi

  return (
    <div className="w-full h-[calc(100vh-200px)] sticky top-36 bg-neutral-bg-secondary rounded-2xl border border-neutral-border overflow-hidden relative group hidden lg:block">
      <MapContainer center={defaultCenter} zoom={11} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {properties.map((prop, idx) => {
          // Fake coordinates if latitude/longitude are missing, just for demonstration
          // In production, these should be populated by the geocoding service on the backend
          const lat = prop.latitude || defaultCenter[0] + (Math.random() - 0.5) * 0.1;
          const lng = prop.longitude || defaultCenter[1] + (Math.random() - 0.5) * 0.1;

          return (
            <Marker key={prop.id || idx} position={[lat, lng]}>
              <Popup>
                <div className="text-sm">
                  <div className="font-bold">{prop.title}</div>
                  <div>{prop.price}</div>
                  <div className="text-xs text-neutral-500">{prop.location}</div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
