import React from 'react';
import { cn } from '../../utils/cn';

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {}

export const EmptyState: React.FC<EmptyStateProps> = ({ className, ...props }) => {
  return (
    <div className={cn('p-4 border rounded-xl', className)} {...props}>
      EmptyState Component
    </div>
  );
};
