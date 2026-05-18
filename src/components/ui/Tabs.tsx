import React from 'react';
import { cn } from '../../utils/cn';

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Tabs: React.FC<TabsProps> = ({ className, ...props }) => {
  return (
    <div className={cn('p-4 border rounded-xl', className)} {...props}>
      Tabs Component
    </div>
  );
};
