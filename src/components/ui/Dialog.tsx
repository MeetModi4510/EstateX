import React from 'react';
import { cn } from '../../utils/cn';

interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Dialog: React.FC<DialogProps> = ({ className, ...props }) => {
  return (
    <div className={cn('p-4 border rounded-xl', className)} {...props}>
      Dialog Component
    </div>
  );
};
