import React from 'react';
import { BedDouble, Bath, Square, Building, Compass, Calendar, Warehouse, ArrowUpRight } from 'lucide-react';

export const QuickInfoGrid: React.FC = () => {
  const items = [
    { icon: BedDouble, label: 'Bedrooms', value: '4 Beds' },
    { icon: Bath, label: 'Bathrooms', value: '5 Baths' },
    { icon: Square, label: 'Balcony', value: '2 Balconies' },
    { icon: Warehouse, label: 'Parking', value: '3 Cars' },
    { icon: Square, label: 'Area', value: '4,500 sqft' },
    { icon: ArrowUpRight, label: 'Floor', value: '8th Floor' },
    { icon: Building, label: 'Total Floors', value: '24 Floors' },
    { icon: Compass, label: 'Facing', value: 'North-East' },
    { icon: Calendar, label: 'Property Age', value: '1-5 Years' },
    { icon: BedDouble, label: 'Furnishing', value: 'Semi-Furnished' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {items.map((item, idx) => (
        <div key={idx} className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm border border-neutral-border hover:shadow-md hover:border-primary/30 transition-all cursor-default group">
          <div className="w-10 h-10 rounded-full bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center mb-3 transition-colors">
            <item.icon className="w-5 h-5 text-primary opacity-90" />
          </div>
          <span className="text-xs text-neutral-secondary mb-1 font-medium">{item.label}</span>
          <span className="text-sm font-bold text-neutral-primary">{item.value}</span>
        </div>
      ))}
    </div>
  );
};
