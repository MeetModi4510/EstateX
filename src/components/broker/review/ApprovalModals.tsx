import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle: string;
}

export const ApprovalSuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, propertyTitle }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-display font-bold text-neutral-primary mb-2">Property Approved!</h2>
            <p className="text-sm text-neutral-secondary mb-8">
              <span className="font-semibold text-neutral-primary">{propertyTitle}</span> has been successfully approved and published to the platform.
            </p>
            <Button className="w-full h-12 text-base rounded-xl" onClick={onClose}>
              Continue
            </Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReject: (reason: string) => void;
}

export const RejectModal: React.FC<RejectModalProps> = ({ isOpen, onClose, onReject }) => {
  const [reason, setReason] = useState('');

  const handleReject = () => {
    onReject(reason);
    setReason('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reject Property">
      <div className="space-y-6">
        <div className="bg-red-50 p-4 rounded-xl flex items-start gap-3 text-red-800 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <p>You are about to reject this listing. This action cannot be easily undone. The owner will be notified.</p>
        </div>
        
        <div>
          <label className="block text-sm font-bold text-neutral-primary mb-2">Rejection Reason (Required)</label>
          <textarea
            className="w-full bg-neutral-bg border border-neutral-border rounded-xl p-3 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 min-h-[100px]"
            placeholder="Please provide a clear reason for rejecting this property..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <div className="flex gap-3 pt-4 border-t border-neutral-divider">
          <Button variant="outline" className="w-full" onClick={onClose}>Cancel</Button>
          <Button 
            className="w-full bg-red-500 hover:bg-red-600 text-white border-transparent" 
            onClick={handleReject}
            disabled={!reason.trim()}
          >
            <XCircle className="w-4 h-4 mr-2" /> Confirm Rejection
          </Button>
        </div>
      </div>
    </Modal>
  );
};
