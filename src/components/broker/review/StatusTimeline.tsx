import React from 'react';
import { CheckCircle2, Clock, Edit3, XCircle, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export type PropertyStatus = 'Submitted' | 'Under Review' | 'Changes Requested' | 'Approved' | 'Published' | 'Rejected';

interface StatusTimelineProps {
  currentStatus: PropertyStatus;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ currentStatus }) => {
  const steps = [
    { label: 'Submitted', icon: Clock, defaultColor: 'text-blue-500', bgColor: 'bg-blue-100' },
    { label: 'Under Review', icon: Edit3, defaultColor: 'text-primary', bgColor: 'bg-primary/10' },
    { label: 'Changes Requested', icon: Clock, defaultColor: 'text-orange-500', bgColor: 'bg-orange-100' },
    { label: 'Approved', icon: CheckCircle2, defaultColor: 'text-green-500', bgColor: 'bg-green-100' },
    { label: 'Published', icon: Globe, defaultColor: 'text-green-600', bgColor: 'bg-green-100' }
  ];

  // Logic to determine active states
  const statuses: PropertyStatus[] = ['Submitted', 'Under Review', 'Changes Requested', 'Approved', 'Published'];
  let currentIndex = statuses.indexOf(currentStatus);
  if (currentStatus === 'Rejected') currentIndex = 1; // Show rejection after review

  return (
    <div className="bg-white border border-neutral-border rounded-2xl p-5 shadow-sm">
      <h2 className="text-sm font-bold text-neutral-primary mb-6 uppercase tracking-wider">Status Timeline</h2>
      
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-neutral-divider" />
        
        <div className="space-y-6 relative">
          {steps.map((step, index) => {
            const isCompleted = index <= currentIndex && currentStatus !== 'Rejected';
            const isCurrent = index === currentIndex && currentStatus !== 'Rejected';
            const isRejected = currentStatus === 'Rejected' && index === 2; // Override 3rd step for rejected
            
            let label = step.label;
            let Icon = step.icon;
            let color = isCompleted ? step.defaultColor : 'text-neutral-secondary';
            let bg = isCompleted ? step.bgColor : 'bg-neutral-bg';

            if (isRejected) {
              label = 'Rejected';
              Icon = XCircle;
              color = 'text-red-500';
              bg = 'bg-red-100';
            }

            // Hide subsequent steps if rejected
            if (currentStatus === 'Rejected' && index > 2) return null;

            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 border-2 ${isCompleted || isRejected ? 'border-transparent' : 'border-neutral-border'} ${bg}`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div>
                  <h4 className={`text-sm font-semibold ${isCurrent || isRejected ? color : (isCompleted ? 'text-neutral-primary' : 'text-neutral-secondary')}`}>
                    {label}
                  </h4>
                  {isCurrent && <p className="text-xs text-neutral-secondary mt-0.5">Current Phase</p>}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
