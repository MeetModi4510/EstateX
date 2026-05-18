import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className={cn("bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]", className)}
          >
            {title && (
              <div className="flex items-center justify-between p-5 border-b border-neutral-divider">
                <h2 className="text-lg font-bold text-neutral-primary">{title}</h2>
                <button 
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-bg transition-colors text-neutral-secondary hover:text-neutral-primary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="p-5 overflow-y-auto custom-scrollbar">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
