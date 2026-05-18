import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRightLeft } from 'lucide-react';
import { Button } from '../ui/Button';

interface CompareBarProps {
  selectedIds: (string | number)[];
  onClear: () => void;
}

export const CompareBar: React.FC<CompareBarProps> = ({ selectedIds, onClear }) => {
  return (
    <AnimatePresence>
      {selectedIds.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl bg-neutral-primary text-white rounded-2xl shadow-2xl p-4 border border-neutral-800 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white">
              <span className="font-bold text-lg">{selectedIds.length}</span>
            </div>
            <div>
              <p className="font-semibold text-white">Properties Selected</p>
              <p className="text-xs text-white/60">Select up to 4 to compare</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={onClear} className="text-sm font-medium text-white/60 hover:text-white transition-colors">
              Clear All
            </button>
            <Button size="sm" className="bg-white text-neutral-primary hover:bg-neutral-bg gap-2" disabled={selectedIds.length < 2}>
              <ArrowRightLeft className="w-4 h-4" /> Compare
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
