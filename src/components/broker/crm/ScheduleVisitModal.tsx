import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { CheckCircle2, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScheduleVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  buyerName: string;
  propertyTitle: string;
  leadId: string;
  propertyId: string;
}

export const ScheduleVisitModal: React.FC<ScheduleVisitModalProps> = ({ isOpen, onClose, buyerName, propertyTitle, leadId, propertyId }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ leadId, propertyId, scheduledDate: date, scheduledTime: time })
      });
      if (response.ok) {
        setIsSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setDate('');
    setTime('');
    setNotes('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Schedule Property Visit">
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="bg-neutral-bg-secondary p-4 rounded-xl border border-neutral-divider mb-4">
              <p className="text-sm font-medium text-neutral-primary mb-1">Buyer: {buyerName}</p>
              <p className="text-sm text-neutral-secondary">Property: {propertyTitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-neutral-primary mb-1.5 flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4 text-neutral-secondary" /> Date
                  </label>
                  <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-neutral-bg border border-neutral-border rounded-xl p-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-primary mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-neutral-secondary" /> Time
                  </label>
                  <input required type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full bg-neutral-bg border border-neutral-border rounded-xl p-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-neutral-primary mb-1.5">Add Notes (Optional)</label>
                <textarea 
                  value={notes} onChange={e => setNotes(e.target.value)}
                  className="w-full bg-neutral-bg border border-neutral-border rounded-xl p-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none h-24"
                  placeholder="e.g. Ensure the keys are collected from the owner..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" type="button" className="flex-1" onClick={handleClose}>Cancel</Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>{isLoading ? 'Scheduling...' : 'Confirm Visit'}</Button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-8 text-center space-y-4"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-primary">Visit Scheduled!</h3>
            <p className="text-neutral-secondary">
              The visit has been scheduled. Both the buyer and property owner will be notified via email/SMS.
            </p>
            <Button className="mt-6 w-full" onClick={handleClose}>Done</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
};
