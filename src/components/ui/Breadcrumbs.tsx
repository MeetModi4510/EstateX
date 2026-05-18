import React from 'react';
import { cn } from '../../utils/cn';

interface BreadcrumbsProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ className, ...props }) => {
  return (
    <div className={cn('p-4 border rounded-xl', className)} {...props}>
      Breadcrumbs Component
    </div>
  );
};
