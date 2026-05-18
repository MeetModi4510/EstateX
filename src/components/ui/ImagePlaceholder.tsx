import React from 'react';
import { cn } from '../../utils/cn';

interface ImagePlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({ className, ...props }) => {
  return (
    <div className={cn('p-4 border rounded-xl', className)} {...props}>
      ImagePlaceholder Component
    </div>
  );
};
