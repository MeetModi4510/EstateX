import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, X } from 'lucide-react';
import { Button } from '../ui/Button';

interface WizardHeaderProps {
  onSaveAndExit: () => void;
}

export const WizardHeader: React.FC<WizardHeaderProps> = ({ onSaveAndExit }) => {
  return (
    <header className="bg-white border-b border-neutral-divider sticky top-0 z-50 h-[72px] flex items-center">
      <div className="container-custom w-full flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-all shadow-sm">
            <Building2 className="w-5 h-5" />
          </div>
          <span className="text-xl font-display font-bold text-neutral-primary tracking-tight">Estate<span className="text-primary">X</span></span>
        </Link>
        
        <Button variant="outline" className="rounded-full gap-2 font-semibold" onClick={onSaveAndExit}>
          Save & Exit <X className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
};
