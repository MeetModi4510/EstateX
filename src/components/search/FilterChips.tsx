import React from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

interface FilterChipsProps {
  selectedChips: string[];
  onToggle: (chip: string) => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({ selectedChips, onToggle }) => {
  const allChips = [
    'Verified', 'Villa', 'Luxury', 'Budget Friendly', 'Ready to Move', 
    'New', 'Sea View', 'Garden View', 'Family', 'Investment'
  ];

  const unselectedChips = allChips.filter(c => !selectedChips.includes(c));

  return (
    <div className="w-full py-4 border-b border-neutral-divider bg-white">
      <div className="container-custom flex items-center gap-3 overflow-x-auto scrollbar-hide snap-x">
        <div className="text-sm font-semibold text-neutral-secondary whitespace-nowrap mr-2">Quick Filters:</div>
        
        <motion.div className="flex gap-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          {selectedChips.map(chip => (
            <button 
              key={`selected-${chip}`}
              onClick={() => onToggle(chip)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium whitespace-nowrap hover:bg-primary/20 transition-colors"
            >
              {chip} <X className="w-3.5 h-3.5" />
            </button>
          ))}
          
          {selectedChips.length > 0 && <div className="w-px h-6 bg-neutral-divider mx-1 self-center"></div>}

          {unselectedChips.slice(0, 8).map((chip) => (
            <button 
              key={`unselected-${chip}`} 
              onClick={() => onToggle(chip)}
              className="px-4 py-1.5 rounded-full border border-neutral-border text-neutral-secondary text-sm font-medium whitespace-nowrap hover:border-primary hover:text-primary transition-colors snap-start"
            >
              {chip}
            </button>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
