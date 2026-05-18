import React from 'react';
import { cn } from '../../utils/cn';
import { LucideIcon } from 'lucide-react';

interface TimelineItem {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: LucideIcon;
  type: 'success' | 'info' | 'warning' | 'default';
}

interface TimelineProps {
  items: TimelineItem[];
}

export const Timeline: React.FC<TimelineProps> = ({ items }) => {
  return (
    <div className="space-y-6">
      {items.map((item, idx) => {
        const Icon = item.icon;
        const isLast = idx === items.length - 1;

        const colorClasses = {
          success: "bg-green-100 text-green-600",
          info: "bg-blue-100 text-blue-600",
          warning: "bg-orange-100 text-orange-600",
          default: "bg-neutral-bg text-neutral-secondary",
        }[item.type];

        return (
          <div key={item.id} className="flex gap-4 relative">
            {!isLast && (
              <div className="absolute left-6 top-10 bottom-[-24px] w-px bg-neutral-divider" />
            )}
            
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10", colorClasses)}>
              <Icon className="w-5 h-5" />
            </div>
            
            <div className="pt-2 flex-1 pb-2">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-sm text-neutral-primary">{item.title}</h4>
                <span className="text-xs font-medium text-neutral-secondary">{item.time}</span>
              </div>
              <p className="text-sm text-neutral-secondary">{item.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
