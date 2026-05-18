import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Map as MapIcon, Expand, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface GalleryProps { images: string[]; }

export const PropertyGallery: React.FC<GalleryProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(nextImage, 5000);
    return () => clearInterval(timer);
  }, [nextImage, images.length]);

  const mainImage = images[currentIndex];

  return (
    <div className="space-y-4">
      <div className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-soft group">
        <AnimatePresence mode="wait">
          <motion.img key={mainImage} src={mainImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="w-full h-full object-cover absolute inset-0" />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        
        {images.length > 1 && (
          <>
            <button onClick={prevImage} className="absolute left-6 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-neutral-primary hover:bg-white transition-all shadow-sm opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 z-10">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={nextImage} className="absolute right-6 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-neutral-primary hover:bg-white transition-all shadow-sm opacity-0 group-hover:opacity-100 translate-x-[10px] group-hover:translate-x-0 z-10">
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        <div className="absolute bottom-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0 z-10">
          <Button variant="secondary" className="gap-2 bg-white/90 backdrop-blur-md hover:bg-white text-neutral-primary border-0"><MapIcon className="w-4 h-4"/> 360° Virtual Tour (Soon)</Button>
          <Button variant="secondary" className="gap-2 bg-white/90 backdrop-blur-md hover:bg-white text-neutral-primary border-0"><Camera className="w-4 h-4"/> View All Photos</Button>
          <button className="w-11 h-11 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-neutral-primary hover:bg-white transition-colors shadow-sm"><Expand className="w-5 h-5"/></button>
        </div>
      </div>
      
      <div className="grid grid-cols-6 gap-4">
        {images.slice(0, 6).map((img, idx) => (
          <div key={idx} onClick={() => setCurrentIndex(idx)} className={`cursor-pointer h-24 rounded-xl overflow-hidden border-2 transition-all ${currentIndex === idx ? 'border-primary shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}>
            <img src={img} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};
