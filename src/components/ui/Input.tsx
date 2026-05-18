import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <div className={cn('p-4 border rounded-xl', className)} {...props}>
      Input Component
    </div>
  );
};
