import React from 'react';
import { cn } from '../../utils/cn';

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DashboardCard: React.FC<DashboardCardProps> = ({ className, ...props }) => {
  return (
    <div className={cn('p-4 border rounded-xl', className)} {...props}>
      DashboardCard Component
    </div>
  );
};
