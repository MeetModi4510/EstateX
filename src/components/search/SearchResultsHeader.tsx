import React from 'react';
import { LayoutGrid, List, Map, ArrowDownUp } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SearchResultsHeaderProps {
  resultCount: number;
  viewMode: 'grid' | 'list' | 'map';
  onViewModeChange: (mode: 'grid' | 'list' | 'map') => void;
}

export const SearchResultsHeader: React.FC<SearchResultsHeaderProps> = ({ 
  resultCount, viewMode, onViewModeChange 
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-primary mb-1">Properties for Sale in Amreli</h2>
        <p className="text-sm text-neutral-secondary">Showing {resultCount} premium properties matching your criteria</p>
      </div>

      <div className="flex items-center gap-4 w-full sm:w-auto">
        {/* Sort */}
        <div className="relative group flex-1 sm:flex-none">
          <select className="w-full sm:w-auto appearance-none bg-white border border-neutral-border rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-neutral-primary hover:border-primary transition-colors outline-none cursor-pointer">
            <option>EstateX Match Score</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest First</option>
            <option>Area: High to Low</option>
          </select>
          <ArrowDownUp className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-secondary pointer-events-none" />
        </div>

        {/* View Toggles */}
        <div className="flex bg-neutral-bg border border-neutral-border rounded-xl p-1 shrink-0">
          <button 
            onClick={() => onViewModeChange('grid')}
            className={cn(
              "p-2 rounded-lg transition-all",
              viewMode === 'grid' ? "bg-white shadow-sm text-primary" : "text-neutral-secondary hover:text-neutral-primary"
            )}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onViewModeChange('list')}
            className={cn(
              "p-2 rounded-lg transition-all",
              viewMode === 'list' ? "bg-white shadow-sm text-primary" : "text-neutral-secondary hover:text-neutral-primary"
            )}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onViewModeChange('map')}
            className={cn(
              "p-2 rounded-lg transition-all",
              viewMode === 'map' ? "bg-white shadow-sm text-primary" : "text-neutral-secondary hover:text-neutral-primary"
            )}
            title="Map View"
          >
            <Map className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
