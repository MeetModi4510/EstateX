import React from 'react';
import { cn } from '../../utils/cn';

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Accordion: React.FC<AccordionProps> = ({ className, ...props }) => {
  return (
    <div className={cn('p-4 border rounded-xl', className)} {...props}>
      Accordion Component
    </div>
  );
};
