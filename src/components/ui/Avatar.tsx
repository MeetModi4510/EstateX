import React from 'react';
import { cn } from '../../utils/cn';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Avatar: React.FC<AvatarProps> = ({ className, ...props }) => {
  return (
    <div className={cn('p-4 border rounded-xl', className)} {...props}>
      Avatar Component
    </div>
  );
};
