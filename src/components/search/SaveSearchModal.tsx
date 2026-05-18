import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell } from 'lucide-react';
import { Button } from '../ui/Button';

interface SaveSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SaveSearchModal: React.FC<SaveSearchModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex justify-between items-center p-6 border-b border-neutral-divider">
              <h3 className="text-xl font-bold text-neutral-primary">Save Search</h3>
              <button onClick={onClose} className="text-neutral-secondary hover:text-neutral-primary transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-neutral-secondary mb-6">Save your current search filters to get notified when new matching properties are listed.</p>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-secondary mb-2">Search Name</label>
                <input type="text" defaultValue="Villas in Amreli under ₹2.5Cr" className="w-full px-4 py-3 rounded-xl border border-neutral-border focus:border-primary outline-none text-neutral-primary font-medium" />
              </div>

              <div className="flex items-center gap-3 p-4 bg-neutral-bg rounded-xl mb-6">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-neutral-primary text-sm">Email Alerts</p>
                  <p className="text-xs text-neutral-secondary">Get instant notifications for new matches</p>
                </div>
                <div className="ml-auto">
                  <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                  </div>
                </div>
              </div>

              <Button className="w-full h-12 text-lg">Save Search</Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
