import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-2 mt-12 mb-8">
      <button 
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="w-10 h-10 flex items-center justify-center rounded-xl border border-neutral-border text-neutral-secondary hover:border-primary hover:text-primary disabled:opacity-50 disabled:pointer-events-none transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={cn(
            "w-10 h-10 flex items-center justify-center rounded-xl font-medium transition-colors",
            currentPage === page 
              ? "bg-primary text-white" 
              : "border border-neutral-border text-neutral-primary hover:border-primary hover:text-primary bg-white"
          )}
        >
          {page}
        </button>
      ))}

      <button 
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="w-10 h-10 flex items-center justify-center rounded-xl border border-neutral-border text-neutral-secondary hover:border-primary hover:text-primary disabled:opacity-50 disabled:pointer-events-none transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};
