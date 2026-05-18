import React from 'react';
import { cn } from '../../utils/cn';

interface SearchBarProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SearchBar: React.FC<SearchBarProps> = ({ className, ...props }) => {
  return (
    <div className={cn('p-4 border rounded-xl', className)} {...props}>
      SearchBar Component
    </div>
  );
};
