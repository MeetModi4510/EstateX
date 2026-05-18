import React from 'react';
import { cn } from '../../utils/cn';

interface StatisticCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const StatisticCard: React.FC<StatisticCardProps> = ({ className, ...props }) => {
  return (
    <div className={cn('p-4 border rounded-xl', className)} {...props}>
      StatisticCard Component
    </div>
  );
};
