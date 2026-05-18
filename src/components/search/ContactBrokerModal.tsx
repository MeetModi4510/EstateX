import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, Building, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { submitInquiry } from '../../api/client';

interface ContactBrokerModalProps {
  isOpen: boolean;
  onClose: () => void;
  broker: {
    name: string;
    phone: string;
    email: string;
    propertyId?: string;
  } | null;
}

export const ContactBrokerModal: React.FC<ContactBrokerModalProps> = ({ isOpen, onClose, broker }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!broker) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await submitInquiry({
        propertyId: broker.propertyId,
        buyerName: formData.name,
        buyerEmail: formData.email,
        buyerPhone: formData.phone,
        message: formData.message,
        inquiryType: 'INFORMATION'
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ name: '', email: '', phone: '', message: '' });
        onClose();
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit inquiry');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-2xl shadow-xl z-50 overflow-hidden"
          >
            <div className="p-6 border-b border-neutral-divider flex justify-between items-center bg-neutral-bg">
              <h2 className="text-xl font-bold font-display text-neutral-primary">Contact Broker</h2>
              <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
                <X className="w-5 h-5 text-neutral-secondary" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl">
                  {broker.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-neutral-primary">{broker.name}</h3>
                  <p className="text-neutral-secondary flex items-center gap-1 text-sm"><Building className="w-4 h-4"/> Certified Broker</p>
                </div>
              </div>

              <div className="space-y-4 bg-neutral-bg p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary shadow-sm shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-secondary font-bold uppercase tracking-wider mb-0.5">Phone Number</p>
                    <a href={`tel:${broker.phone}`} className="font-medium text-neutral-primary hover:text-primary transition-colors">{broker.phone}</a>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary shadow-sm shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-secondary font-bold uppercase tracking-wider mb-0.5">Email Address</p>
                    <a href={`mailto:${broker.email}`} className="font-medium text-neutral-primary hover:text-primary transition-colors">{broker.email}</a>
                  </div>
                </div>
              </div>

              {isSuccess ? (
                <div className="p-4 bg-green-50 text-green-700 rounded-xl flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Inquiry sent successfully!</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    className="w-full px-4 py-2 rounded-lg border border-neutral-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <input
                    type="email"
                    required
                    placeholder="Your Email"
                    className="w-full px-4 py-2 rounded-lg border border-neutral-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Your Phone Number"
                    className="w-full px-4 py-2 rounded-lg border border-neutral-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <textarea
                    placeholder="Message (optional)"
                    className="w-full px-4 py-2 rounded-lg border border-neutral-border focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none h-24"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                  </Button>
                </form>
              )}

              <p className="text-sm text-neutral-secondary text-center">
                For privacy and security, all inquiries must be directed to the assigned broker.
              </p>
            </div>
            
            <div className="p-6 border-t border-neutral-divider bg-neutral-bg flex justify-end">
              <Button variant="outline" onClick={onClose} className="w-full">Close</Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
