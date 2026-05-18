import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, BedDouble, Bath, Square, Heart, CheckCircle2, 
  Share2, ChevronLeft, ChevronRight, Car, Phone
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';

export interface EnhancedPropertyCardProps {
  id: string | number;
  images: string[];
  price: string;
  emi?: string;
  title: string;
  location: string;
  beds: number;
  baths: number;
  area: string;
  parking?: number;
  type: string;
  shortDescription?: string;
  listedBy?: string;
  postedDate?: string;
  verified?: boolean;
  matchScore?: number;
  isListMode?: boolean;
  onCompareToggle?: (id: string | number) => void;
  isSelectedForCompare?: boolean;
  onContactClick?: (id: string | number) => void;
}

export const EnhancedPropertyCard: React.FC<EnhancedPropertyCardProps> = ({ 
  id, images, price, emi, title, location, beds, baths, area, parking = 0, 
  type, shortDescription, listedBy, postedDate, verified = true, matchScore,
  isListMode = false, onCompareToggle, isSelectedForCompare = false, onContactClick
}) => {
  const navigate = useNavigate();
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <motion.div 
      whileHover={{ y: -6 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "group bg-white rounded-2xl overflow-hidden shadow-soft border border-neutral-border hover:shadow-xl transition-all duration-300 relative",
        isListMode ? "flex flex-col sm:flex-row h-auto sm:h-64" : "flex flex-col"
      )}
    >
      {/* Optional Checkbox for Compare */}
      {onCompareToggle && (
        <div 
          className="absolute top-4 left-4 z-20"
          onClick={(e) => { e.stopPropagation(); onCompareToggle(id); }}
        >
          <div className={cn(
            "w-6 h-6 rounded-md border-2 flex items-center justify-center cursor-pointer bg-white/80 backdrop-blur-sm transition-colors",
            isSelectedForCompare ? "border-primary bg-primary text-white" : "border-neutral-secondary hover:border-primary"
          )}>
            {isSelectedForCompare && <CheckCircle2 className="w-4 h-4" />}
          </div>
        </div>
      )}

      {/* Image Gallery */}
      <div className={cn(
        "relative overflow-hidden cursor-pointer",
        isListMode ? "w-full sm:w-2/5 h-64 sm:h-full shrink-0" : "w-full h-64"
      )} onClick={() => navigate(`/property/${id}`)}>
        
        <div className="w-full h-full flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentImageIdx * 100}%)` }}>
          {images.map((img, idx) => (
            <img key={idx} src={img} alt={`${title} ${idx}`} className="w-full h-full object-cover shrink-0" />
          ))}
        </div>

        {/* Top Badges */}
        <div className="absolute top-4 left-0 right-4 flex justify-between items-start pointer-events-none">
          <div className="flex flex-col gap-2 pl-12">
            {verified && (
              <span className="bg-white/95 backdrop-blur-sm text-feedback-success text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm w-fit pointer-events-auto">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
              </span>
            )}
            {matchScore && (
              <span className="bg-secondary/95 text-primary text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm w-fit pointer-events-auto">
                {matchScore}% Match
              </span>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button onClick={(e) => { e.stopPropagation(); }} className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center text-neutral-secondary hover:text-red-500 hover:bg-white transition-colors shadow-sm">
            <Heart className="w-5 h-5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); }} className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center text-neutral-secondary hover:text-primary hover:bg-white transition-colors shadow-sm">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Carousel Controls */}
        <AnimatePresence>
          {isHovered && images.length > 1 && (
            <>
              <motion.button 
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-colors backdrop-blur-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              <motion.button 
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-colors backdrop-blur-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </>
          )}
        </AnimatePresence>

        {/* Carousel Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, idx) => (
              <div key={idx} className={cn("h-1.5 rounded-full transition-all duration-300", currentImageIdx === idx ? "w-4 bg-white" : "w-1.5 bg-white/60")} />
            ))}
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="text-2xl font-bold text-primary">{price}</div>
              {emi && <div className="text-xs text-neutral-secondary font-medium">EMI from {emi}</div>}
            </div>
            <div className="text-xs font-semibold px-2 py-1 bg-neutral-bg-secondary rounded-md text-neutral-secondary">
              {type}
            </div>
          </div>
          
          <h3 className="text-lg font-bold text-neutral-primary mb-1 line-clamp-1 cursor-pointer hover:text-primary transition-colors" onClick={() => navigate(`/property/${id}`)}>
            {title}
          </h3>
          <p className="text-neutral-secondary flex items-center gap-1 text-sm mb-4">
            <MapPin className="w-4 h-4" /> {location}
          </p>

          {isListMode && shortDescription && (
            <p className="text-sm text-neutral-secondary mb-4 line-clamp-2">{shortDescription}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 py-4 border-y border-neutral-divider text-neutral-secondary text-sm">
            <div className="flex items-center gap-1.5 font-medium"><BedDouble className="w-4 h-4" /> {beds} Beds</div>
            <div className="flex items-center gap-1.5 font-medium"><Bath className="w-4 h-4" /> {baths} Baths</div>
            <div className="flex items-center gap-1.5 font-medium"><Square className="w-4 h-4" /> {area}</div>
            {parking > 0 && <div className="flex items-center gap-1.5 font-medium"><Car className="w-4 h-4" /> {parking} Park</div>}
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between items-center mb-4 text-xs text-neutral-secondary">
            {listedBy && <span>By <span className="font-semibold text-neutral-primary">{listedBy}</span></span>}
            {postedDate && <span>{postedDate}</span>}
          </div>

          <div className="flex gap-3">
            <Button className="flex-1 text-sm h-10" onClick={() => navigate(`/property/${id}`)}>View Details</Button>
            <Button variant="outline" className="flex-1 text-sm h-10 gap-2" onClick={(e) => {
              e.stopPropagation();
              if (onContactClick) onContactClick(id);
            }}>
              <Phone className="w-4 h-4"/> Contact
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
