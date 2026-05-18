import React from 'react';
import { Search, MapPin, Mic, SlidersHorizontal } from 'lucide-react';
import { Button } from '../ui/Button';

export interface SearchFilters {
  query: string;
  budget: string;
  propertyType: string;
}

interface SearchHeaderProps {
  onMobileFilterClick?: () => void;
  onSearch?: (filters: SearchFilters) => void;
  initialQuery?: string;
  initialBudget?: string;
  initialPropertyType?: string;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({ onMobileFilterClick, onSearch, initialQuery = '', initialBudget = 'Any Budget', initialPropertyType = 'All Types' }) => {
  const [query, setQuery] = React.useState(initialQuery);
  const [budget, setBudget] = React.useState(initialBudget);
  const [propertyType, setPropertyType] = React.useState(initialPropertyType);

  React.useEffect(() => {
    setQuery(initialQuery);
    setBudget(initialBudget);
    setPropertyType(initialPropertyType);
  }, [initialQuery, initialBudget, initialPropertyType]);

  const handleSearch = () => {
    if (onSearch) onSearch({ query, budget, propertyType });
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white border-b border-neutral-border sticky top-[56px] z-40 lg:z-30 shadow-sm transition-all">
      <div className="container-custom py-4">
        {/* Mobile View */}
        <div className="flex gap-3 lg:hidden">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-secondary w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by location..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-neutral-border focus:border-primary outline-none bg-neutral-bg"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-secondary hover:text-primary transition-colors">
              <Mic className="w-5 h-5" />
            </button>
          </div>
          <Button variant="outline" className="px-3 rounded-2xl h-auto" onClick={onMobileFilterClick}>
            <SlidersHorizontal className="w-5 h-5" />
          </Button>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:flex items-center gap-4 bg-neutral-bg p-2 rounded-full border border-neutral-border">
          <div className="flex-1 flex flex-col justify-center pl-4 pr-4 border-r border-neutral-divider relative">
            <label className="text-[10px] font-bold text-neutral-secondary uppercase tracking-wider block mb-0.5">Location</label>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Where are you looking?" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent outline-none font-medium text-neutral-primary placeholder:text-neutral-secondary/60"
              />
              <button className="text-primary text-xs font-semibold flex items-center gap-1 hover:underline shrink-0 whitespace-nowrap">
                <MapPin className="w-3.5 h-3.5" /> Current Location
              </button>
            </div>
          </div>
          
          <div className="flex-1 relative group px-4 border-r border-neutral-divider">
            <label className="text-[10px] font-bold text-neutral-secondary uppercase tracking-wider block mb-0.5">Budget</label>
            <select 
              className="w-full bg-transparent outline-none font-medium text-neutral-primary appearance-none cursor-pointer"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            >
              <option>Any Budget</option>
              <option>Under ₹50 Lakhs</option>
              <option>₹50L - ₹1Cr</option>
              <option>₹1Cr - ₹2.5Cr</option>
              <option>Above ₹2.5Cr</option>
            </select>
          </div>

          <div className="flex-1 relative group px-4">
            <label className="text-[10px] font-bold text-neutral-secondary uppercase tracking-wider block mb-0.5">Property Type</label>
            <select 
              className="w-full bg-transparent outline-none font-medium text-neutral-primary appearance-none cursor-pointer"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            >
              <option>All Types</option>
              <option>Villa</option>
              <option>Apartment</option>
              <option>Independent House</option>
              <option>Plot</option>
            </select>
          </div>

          <Button size="lg" className="rounded-full h-12 px-8 gap-2 shrink-0 shadow-md" onClick={handleSearch}>
            <Search className="w-4 h-4" /> Search
          </Button>
        </div>
      </div>
    </div>
  );
};
