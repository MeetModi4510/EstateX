import React from 'react';
import { cn } from '../../utils/cn';

interface ProfileCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ProfileCard: React.FC<ProfileCardProps> = ({ className, ...props }) => {
  return (
    <div className={cn('p-4 border rounded-xl', className)} {...props}>
      ProfileCard Component
    </div>
  );
};
