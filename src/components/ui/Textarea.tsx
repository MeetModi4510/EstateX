import React from 'react';
import { cn } from '../../utils/cn';

interface TextareaProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Textarea: React.FC<TextareaProps> = ({ className, ...props }) => {
  return (
    <div className={cn('p-4 border rounded-xl', className)} {...props}>
      Textarea Component
    </div>
  );
};
