import React from 'react';
import { cn } from '../../utils/cn';

interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Toast: React.FC<ToastProps> = ({ className, ...props }) => {
  return (
    <div className={cn('p-4 border rounded-xl', className)} {...props}>
      Toast Component
    </div>
  );
};
