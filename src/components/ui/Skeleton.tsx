import React from 'react';
import { cn } from '../../utils/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div className={cn('p-4 border rounded-xl', className)} {...props}>
      Skeleton Component
    </div>
  );
};
