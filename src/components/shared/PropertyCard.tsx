import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, BedDouble, Bath, Square, Heart, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

interface PropertyCardProps {
  id?: string | number;
  _id?: string;
  image?: string;
  coverImage?: string;
  images?: any[];
  price?: string | number;
  expectedPrice?: number;
  title: string;
  location?: string;
  locality?: string;
  city?: string;
  beds?: number;
  baths?: number;
  area?: string;
  builtUpArea?: number;
  verified?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ 
  id, _id, 
  image, coverImage, images,
  price, expectedPrice,
  title, 
  location, locality, city,
  beds, baths, 
  area, builtUpArea,
  verified = true 
}) => {
  const navigate = useNavigate();
  const displayId = id || _id;
  
  // Extract cover image from images array if available
  const firstImageUrl = images && images.length > 0 ? images[0].imageUrl : undefined;
  const displayImage = image || coverImage || firstImageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800';
  
  let displayPrice = price;
  // If price is a number, format it
  if (typeof displayPrice === 'number') {
    displayPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(displayPrice);
  } else if (!displayPrice && expectedPrice) {
    displayPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(expectedPrice);
  } else if (!displayPrice) {
    displayPrice = 'Price on request';
  }

  const displayLocation = location || [locality, city].filter(Boolean).join(', ') || 'Location unavailable';
  const displayArea = area || (builtUpArea ? `${builtUpArea} sqft` : '-');
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-soft border border-neutral-border hover:shadow-xl transition-all duration-300"
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={displayImage} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          {verified && (
            <span className="bg-white/90 backdrop-blur-sm text-feedback-success text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified
            </span>
          )}
        </div>
        <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex-center text-neutral-secondary hover:text-primary hover:bg-white transition-colors shadow-sm">
          <Heart className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-neutral-primary mb-1 line-clamp-1">{title}</h3>
            <p className="text-neutral-secondary flex items-center gap-1 text-sm">
              <MapPin className="w-4 h-4 min-w-4" /> <span className="truncate">{displayLocation}</span>
            </p>
          </div>
          <div className="text-2xl font-bold text-primary whitespace-nowrap ml-2">{displayPrice}</div>
        </div>
        
        <div className="flex items-center justify-between py-4 border-y border-neutral-divider mb-4 text-neutral-secondary text-sm">
          <div className="flex items-center gap-2"><BedDouble className="w-4 h-4" /> {beds || '-'} Beds</div>
          <div className="flex items-center gap-2"><Bath className="w-4 h-4" /> {baths || '-'} Baths</div>
          <div className="flex items-center gap-2"><Square className="w-4 h-4" /> {displayArea}</div>
        </div>
        
        <Button className="w-full" onClick={() => navigate(`/property/${displayId}`)}>View Details</Button>
      </div>
    </motion.div>
  );
};
