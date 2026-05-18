import React from 'react';
import { cn } from '../../utils/cn';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Alert: React.FC<AlertProps> = ({ className, ...props }) => {
  return (
    <div className={cn('p-4 border rounded-xl', className)} {...props}>
      Alert Component
    </div>
  );
};
