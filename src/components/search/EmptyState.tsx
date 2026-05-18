import React from 'react';
import { SearchX } from 'lucide-react';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  onClearFilters: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onClearFilters }) => {
  return (
    <div className="w-full py-20 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-neutral-border shadow-sm">
      <div className="w-24 h-24 bg-neutral-bg rounded-full flex items-center justify-center text-neutral-secondary mb-6">
        <SearchX className="w-12 h-12" />
      </div>
      <h3 className="text-2xl font-bold text-neutral-primary mb-2">No matching properties found.</h3>
      <p className="text-neutral-secondary mb-8 max-w-md mx-auto">
        We couldn't find any properties matching your current filters. Try adjusting your search criteria or explore nearby areas.
      </p>
      <div className="flex gap-4">
        <Button onClick={onClearFilters}>Clear Filters</Button>
        <Button variant="outline">Explore Nearby</Button>
      </div>
    </div>
  );
};
