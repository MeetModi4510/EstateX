import React from 'react';
import { Dumbbell, Trees, Waves, ShieldCheck, Wifi, Flame, Car, Droplets } from 'lucide-react';

export const AmenitiesGrid: React.FC = () => {
  const amenities = [
    { icon: Dumbbell, label: 'Gym' }, { icon: Trees, label: 'Garden' },
    { icon: Waves, label: 'Swimming Pool' }, { icon: ShieldCheck, label: '24/7 Security' },
    { icon: Wifi, label: 'High-speed Internet' }, { icon: Flame, label: 'Gas Pipeline' },
    { icon: Car, label: 'Visitor Parking' }, { icon: Droplets, label: 'Rain Water Harvesting' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {amenities.map((item, idx) => (
        <div key={idx} className="flex items-center gap-3 bg-white border border-neutral-border p-3 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/30 transition-all group cursor-default">
          <div className="w-10 h-10 rounded-full bg-secondary/20 group-hover:bg-secondary/40 text-primary flex items-center justify-center transition-colors">
            <item.icon className="w-5 h-5" />
          </div>
          <span className="font-medium text-sm text-neutral-primary">{item.label}</span>
        </div>
      ))}
    </div>
  );
};
