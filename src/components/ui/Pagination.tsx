import React from 'react';
import { cn } from '../../utils/cn';

interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Pagination: React.FC<PaginationProps> = ({ className, ...props }) => {
  return (
    <div className={cn('p-4 border rounded-xl', className)} {...props}>
      Pagination Component
    </div>
  );
};
