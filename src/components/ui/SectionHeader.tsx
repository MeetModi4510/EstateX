import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, subtitle, align = 'center', className 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className={cn(
        "mb-12",
        align === 'center' ? "text-center mx-auto" : "text-left",
        className
      )}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-neutral-primary mb-4">{title}</h2>
      {subtitle && (
        <p className="text-lg text-neutral-secondary max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};
