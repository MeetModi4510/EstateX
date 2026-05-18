import React from 'react';
import { Check, Clock, FileText, UploadCloud, Users, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '../../utils/cn';
import { PropertyStatus } from './PropertyTable';

interface StatusTimelineProps {
  currentStatus: PropertyStatus;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ currentStatus }) => {
  const steps = [
    { title: 'Draft', icon: FileText, status: 'Draft' },
    { title: 'Submitted', icon: UploadCloud, status: 'Pending Review' },
    { title: 'Broker Review', icon: Clock, status: 'Pending Review' }, // Maps to Pending Review conceptually in this UI
    { title: 'Approved', icon: Check, status: 'Approved' },
    { title: 'Published', icon: CheckCircle2, status: 'Published' },
    { title: 'Interested Buyers', icon: Users, status: 'Published' },
    { title: 'Sold', icon: CheckCircle2, status: 'Sold' },
  ];

  const getStepIndex = (status: PropertyStatus) => {
    switch (status) {
      case 'Draft': return 0;
      case 'Pending Review': return 2;
      case 'Approved': return 3;
      case 'Published': return 5;
      case 'Sold': return 6;
      case 'Rejected': return -1;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(currentStatus);

  if (currentStatus === 'Rejected') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
        <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-red-900 mb-1">Property Rejected</h4>
          <p className="text-sm text-red-700">Your property listing was rejected by the broker. Please review your notifications for required changes and re-submit.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="flex justify-between relative">
        {/* Progress Bar Background */}
        <div className="absolute top-5 left-6 right-6 h-[2px] bg-neutral-divider z-0"></div>
        {/* Active Progress Bar */}
        <div 
          className="absolute top-5 left-6 h-[2px] bg-primary z-0 transition-all duration-500"
          style={{ width: `calc(${(currentIndex / (steps.length - 1)) * 100}% - 3rem)` }}
        ></div>

        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.title} className="relative z-10 flex flex-col items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 bg-white",
                isCompleted ? "border-primary text-primary" : "border-neutral-divider text-neutral-secondary",
                isCurrent && "ring-4 ring-primary/20"
              )}>
                <Icon className="w-4 h-4" />
              </div>
              <span className={cn(
                "text-xs font-bold text-center max-w-[80px]",
                isCompleted ? "text-primary" : "text-neutral-secondary"
              )}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
