import React from 'react';
import { cn } from '../../utils/cn';

interface TopbarProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Topbar: React.FC<TopbarProps> = ({ className, ...props }) => {
  return (
    <div className={cn('p-4 border rounded-xl', className)} {...props}>
      Topbar Component
    </div>
  );
};
