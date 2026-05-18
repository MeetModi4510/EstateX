import React from 'react';
import { cn } from '../../utils/cn';

interface FilterSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ className, ...props }) => {
  return (
    <div className={cn('p-4 border rounded-xl', className)} {...props}>
      FilterSidebar Component
    </div>
  );
};
