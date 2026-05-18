import React from 'react';
import { cn } from '../../utils/cn';

interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Dropdown: React.FC<DropdownProps> = ({ className, ...props }) => {
  return (
    <div className={cn('p-4 border rounded-xl', className)} {...props}>
      Dropdown Component
    </div>
  );
};
