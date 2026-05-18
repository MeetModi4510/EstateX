import React from 'react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: {
    value: number;
    label: string;
  };
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm flex flex-col hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={cn(
            "text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1",
            trend.value > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          )}>
            {trend.value > 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <div>
        <h3 className="text-3xl font-display font-bold text-neutral-primary mb-1">{value}</h3>
        <p className="text-sm font-medium text-neutral-secondary">{title}</p>
      </div>
    </motion.div>
  );
};
