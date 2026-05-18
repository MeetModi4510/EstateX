import React from 'react';
import { cn } from '../../utils/cn';

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

export const RadioGroup: React.FC<RadioGroupProps> = ({ className, ...props }) => {
  return (
    <div className={cn('p-4 border rounded-xl', className)} {...props}>
      RadioGroup Component
    </div>
  );
};
