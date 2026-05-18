import React from 'react';
import { cn } from '../../utils/cn';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Sidebar: React.FC<SidebarProps> = ({ className, ...props }) => {
  return (
    <div className={cn('p-4 border rounded-xl', className)} {...props}>
      Sidebar Component
    </div>
  );
};
