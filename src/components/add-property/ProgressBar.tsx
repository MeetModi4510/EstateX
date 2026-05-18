import React from 'react';
import { motion } from 'framer-motion';

export const WIZARD_STEPS = [
  'Property Type',
  'Basic Details',
  'Location',
  'Amenities',
  'Media',
  'Pricing',
  'Review & Publish'
];

interface ProgressBarProps {
  currentStep: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  const progressPercentage = ((currentStep) / WIZARD_STEPS.length) * 100;

  return (
    <div className="bg-white sticky top-[72px] z-40 border-b border-neutral-divider">
      <div className="container-custom py-4 flex items-center justify-between">
        <div className="flex gap-2 text-sm font-semibold text-neutral-secondary">
          <span className="text-neutral-primary">Step {currentStep}</span>
          <span>of {WIZARD_STEPS.length}:</span>
          <span className="text-primary">{WIZARD_STEPS[currentStep - 1]}</span>
        </div>
        
        <div className="hidden md:flex gap-6 text-xs font-medium text-neutral-secondary/60">
          {WIZARD_STEPS.map((step, idx) => (
            <span key={step} className={idx + 1 === currentStep ? 'text-primary font-bold' : idx + 1 < currentStep ? 'text-neutral-primary' : ''}>
              {step}
            </span>
          ))}
        </div>
      </div>
      <div className="w-full h-1 bg-neutral-bg">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
};
