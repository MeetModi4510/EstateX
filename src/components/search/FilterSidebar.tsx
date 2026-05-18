import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-neutral-divider py-5">
      <button 
        className="w-full flex justify-between items-center text-left focus:outline-none group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="font-bold text-neutral-primary group-hover:text-primary transition-colors">{title}</h4>
        <ChevronDown className={cn("w-5 h-5 text-neutral-secondary transition-transform duration-300", isOpen && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-4 pb-1">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export interface SidebarFilters {
  minBudget: string;
  maxBudget: string;
  propertyStatus: string[];
  bedrooms: string[];
  bathrooms: string[];
  amenities: string[];
  facing: string[];
  listedBy: string[];
}

interface FilterSidebarProps {
  onFiltersChange?: (filters: SidebarFilters) => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState<SidebarFilters>({
    minBudget: '', maxBudget: '', propertyStatus: [], bedrooms: [], bathrooms: [], amenities: [], facing: [], listedBy: []
  });

  const updateFilters = (newFilters: Partial<SidebarFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    if (onFiltersChange) onFiltersChange(updated);
  };

  const toggleArrayItem = (key: keyof SidebarFilters, value: string) => {
    const arr = filters[key] as string[];
    const newArr = arr.includes(value) ? arr.filter(item => item !== value) : [...arr, value];
    updateFilters({ [key]: newArr });
  };

  const handleReset = () => {
    const reset = { minBudget: '', maxBudget: '', propertyStatus: [], bedrooms: [], bathrooms: [], amenities: [], facing: [], listedBy: [] };
    setFilters(reset);
    if (onFiltersChange) onFiltersChange(reset);
  };
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-neutral-primary">Filters</h3>
        <button className="text-sm font-semibold text-primary hover:underline" onClick={handleReset}>Reset All</button>
      </div>

      <FilterSection title="Budget" defaultOpen>
        <div className="space-y-4">
          <input type="range" className="w-full accent-primary" min="0" max="100" />
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-xs text-neutral-secondary mb-1 block">Min (₹)</label>
              <input type="text" placeholder="0" value={filters.minBudget} onChange={e => updateFilters({ minBudget: e.target.value })} className="w-full px-3 py-2 border border-neutral-border rounded-xl text-sm focus:border-primary outline-none" />
            </div>
            <div className="text-neutral-secondary">-</div>
            <div className="flex-1">
              <label className="text-xs text-neutral-secondary mb-1 block">Max (₹)</label>
              <input type="text" placeholder="Any" value={filters.maxBudget} onChange={e => updateFilters({ maxBudget: e.target.value })} className="w-full px-3 py-2 border border-neutral-border rounded-xl text-sm focus:border-primary outline-none" />
            </div>
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Property Status" defaultOpen>
        <div className="space-y-3">
          {['Ready to Move', 'Under Construction', 'New Launch'].map(status => (
            <label key={status} className="flex items-center gap-3 cursor-pointer group">
              <div className={cn("w-5 h-5 rounded border flex items-center justify-center transition-colors", filters.propertyStatus.includes(status) ? "bg-primary border-primary" : "border-neutral-border group-hover:border-primary")}>
                <div className={cn("w-3 h-3 bg-white rounded-[2px] transition-opacity", filters.propertyStatus.includes(status) ? "opacity-100" : "opacity-0 group-hover:opacity-20 group-hover:bg-primary")}></div>
              </div>
              <input type="checkbox" className="hidden" checked={filters.propertyStatus.includes(status)} onChange={() => toggleArrayItem('propertyStatus', status)} />
              <span className="text-sm text-neutral-primary">{status}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Bedrooms">
        <div className="flex flex-wrap gap-2">
          {['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK'].map(bhk => (
            <button 
              key={bhk} 
              onClick={() => toggleArrayItem('bedrooms', bhk)}
              className={cn("px-4 py-2 border rounded-full text-sm font-medium transition-all", filters.bedrooms.includes(bhk) ? "bg-primary border-primary text-white" : "border-neutral-border text-neutral-secondary hover:border-primary hover:text-primary")}
            >
              {bhk}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Bathrooms">
        <div className="flex flex-wrap gap-2">
          {['1+', '2+', '3+', '4+'].map(bath => (
            <button 
              key={bath} 
              onClick={() => toggleArrayItem('bathrooms', bath)}
              className={cn("px-4 py-2 border rounded-full text-sm font-medium transition-all", filters.bathrooms.includes(bath) ? "bg-primary border-primary text-white" : "border-neutral-border text-neutral-secondary hover:border-primary hover:text-primary")}
            >
              {bath}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Amenities">
        <div className="space-y-3">
          {['Parking', 'Swimming Pool', 'Gym', 'Garden', 'Lift', 'Security'].map(amenity => (
            <label key={amenity} className="flex items-center gap-3 cursor-pointer group">
              <div className={cn("w-5 h-5 rounded border flex items-center justify-center transition-colors", filters.amenities.includes(amenity) ? "bg-primary border-primary" : "border-neutral-border group-hover:border-primary")}>
                {filters.amenities.includes(amenity) && <div className="w-2.5 h-2.5 bg-white rounded-[2px]" />}
              </div>
              <input type="checkbox" className="hidden" checked={filters.amenities.includes(amenity)} onChange={() => toggleArrayItem('amenities', amenity)} />
              <span className="text-sm text-neutral-primary">{amenity}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Facing">
        <div className="grid grid-cols-2 gap-3">
          {['East', 'West', 'North', 'South', 'North-East'].map(face => (
            <label key={face} className="flex items-center gap-3 cursor-pointer group">
              <div className={cn("w-5 h-5 rounded border flex items-center justify-center transition-colors", filters.facing.includes(face) ? "bg-primary border-primary" : "border-neutral-border group-hover:border-primary")}>
                {filters.facing.includes(face) && <div className="w-2.5 h-2.5 bg-white rounded-[2px]" />}
              </div>
              <input type="checkbox" className="hidden" checked={filters.facing.includes(face)} onChange={() => toggleArrayItem('facing', face)} />
              <span className="text-sm text-neutral-primary">{face}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Listed By">
        <div className="space-y-3">
          {['Owner', 'Builder', 'Broker'].map(listed => (
            <label key={listed} className="flex items-center gap-3 cursor-pointer group">
              <div className={cn("w-5 h-5 rounded border flex items-center justify-center transition-colors", filters.listedBy.includes(listed) ? "bg-primary border-primary" : "border-neutral-border group-hover:border-primary")}>
                {filters.listedBy.includes(listed) && <div className="w-2.5 h-2.5 bg-white rounded-[2px]" />}
              </div>
              <input type="checkbox" className="hidden" checked={filters.listedBy.includes(listed)} onChange={() => toggleArrayItem('listedBy', listed)} />
              <span className="text-sm text-neutral-primary">{listed}</span>
            </label>
          ))}
        </div>
      </FilterSection>
      
    </div>
  );
};
