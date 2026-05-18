import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, actionLabel, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-neutral-border rounded-2xl border-dashed">
      <div className="w-20 h-20 bg-neutral-bg text-neutral-secondary rounded-full flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 opacity-50" />
      </div>
      <h3 className="text-xl font-bold text-neutral-primary mb-2">{title}</h3>
      <p className="text-sm text-neutral-secondary max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
};
