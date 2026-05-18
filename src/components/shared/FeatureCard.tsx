import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-8 rounded-2xl border border-neutral-border shadow-soft hover:shadow-xl transition-all duration-300 flex flex-col items-start"
    >
      <div className="w-14 h-14 bg-primary/5 rounded-xl flex-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold text-neutral-primary mb-3">{title}</h3>
      <p className="text-neutral-secondary leading-relaxed">{description}</p>
    </motion.div>
  );
};
