import React from 'react';
import { cn } from '../../utils/cn';

interface TagProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Tag: React.FC<TagProps> = ({ className, ...props }) => {
  return (
    <div className={cn('p-4 border rounded-xl', className)} {...props}>
      Tag Component
    </div>
  );
};
