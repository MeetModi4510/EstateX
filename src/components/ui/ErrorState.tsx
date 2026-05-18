import React from 'react';
import { cn } from '../../utils/cn';

interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ErrorState: React.FC<ErrorStateProps> = ({ className, ...props }) => {
  return (
    <div className={cn('p-4 border rounded-xl', className)} {...props}>
      ErrorState Component
    </div>
  );
};
