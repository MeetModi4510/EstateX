import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface RequestChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reasons: string[], customReason: string) => void;
}

const PREDEFINED_REASONS = [
  'Need Better Images',
  'Missing Documents',
  'Incorrect Location',
  'Price Verification Required',
  'Incomplete Description'
];

export const RequestChangesModal: React.FC<RequestChangesModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [customReason, setCustomReason] = useState('');

  const toggleReason = (reason: string) => {
    setSelectedReasons(prev => 
      prev.includes(reason) ? prev.filter(r => r !== reason) : [...prev, reason]
    );
  };

  const handleSubmit = () => {
    onSubmit(selectedReasons, customReason);
    setSelectedReasons([]);
    setCustomReason('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request Changes">
      <div className="space-y-6">
        <div>
          <p className="text-sm text-neutral-secondary mb-4 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-orange-500 shrink-0" />
            <span>Select the reasons for requesting changes. This will be sent to the owner to rectify.</span>
          </p>
          
          <div className="space-y-2">
            {PREDEFINED_REASONS.map(reason => (
              <label key={reason} className="flex items-center gap-3 p-3 rounded-xl border border-neutral-border cursor-pointer hover:bg-neutral-bg transition-colors">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedReasons.includes(reason) ? 'bg-primary border-primary' : 'border-neutral-secondary'}`}>
                  {selectedReasons.includes(reason) && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </div>
                <span className="text-sm font-medium text-neutral-primary">{reason}</span>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={selectedReasons.includes(reason)} 
                  onChange={() => toggleReason(reason)}
                />
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-neutral-primary mb-2">Custom Reason (Optional)</label>
          <textarea
            className="w-full bg-neutral-bg border border-neutral-border rounded-xl p-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[100px]"
            placeholder="Add any specific details or other reasons..."
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
          />
        </div>

        <div className="flex gap-3 pt-4 border-t border-neutral-divider">
          <Button variant="outline" className="w-full" onClick={onClose}>Cancel</Button>
          <Button 
            className="w-full" 
            onClick={handleSubmit}
            disabled={selectedReasons.length === 0 && !customReason.trim()}
          >
            Send Request
          </Button>
        </div>
      </div>
    </Modal>
  );
};
