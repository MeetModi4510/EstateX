import React from 'react';
import { cn } from '../../utils/cn';

interface CheckboxProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Checkbox: React.FC<CheckboxProps> = ({ className, ...props }) => {
  return (
    <div className={cn('p-4 border rounded-xl', className)} {...props}>
      Checkbox Component
    </div>
  );
};
