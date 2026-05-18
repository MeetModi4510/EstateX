import React from 'react';
import { cn } from '../../utils/cn';

interface DrawerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Drawer: React.FC<DrawerProps> = ({ className, ...props }) => {
  return (
    <div className={cn('p-4 border rounded-xl', className)} {...props}>
      Drawer Component
    </div>
  );
};
