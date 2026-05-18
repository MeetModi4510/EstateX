import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { CheckCircle2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { submitInquiry } from '../../api/client';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle: string;
  propertyId: string;
  inquiryType?: 'INFORMATION' | 'CALLBACK' | 'VISIT';
}

export const InquiryModal: React.FC<InquiryModalProps> = ({ isOpen, onClose, propertyTitle, propertyId, inquiryType = 'INFORMATION' }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    buyerName: '',
    buyerPhone: '',
    buyerEmail: '',
    budget: 'Under ₹1 Cr',
    preferredContactTime: 'Anytime',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await submitInquiry({
        propertyId,
        inquiryType,
        ...formData
      });
      setIsSubmitted(true);
    } catch (err) {
      setError('Failed to submit request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setError('');
    setFormData({
      buyerName: '', buyerPhone: '', buyerEmail: '', budget: 'Under ₹1 Cr', preferredContactTime: 'Anytime', message: ''
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Request Information">
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="bg-orange-50 p-3 rounded-xl flex items-start gap-3 border border-orange-100">
              <ShieldAlert className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <p className="text-sm text-orange-800">
                Buyer and Property Owner information is strictly protected by EstateX. All communication is securely managed by our professional brokers.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <div>
                <label className="block text-sm font-bold text-neutral-primary mb-1.5">Full Name</label>
                <input required type="text" value={formData.buyerName} onChange={e => setFormData({...formData, buyerName: e.target.value})} className="w-full bg-neutral-bg border border-neutral-border rounded-xl p-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="Enter your name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-neutral-primary mb-1.5">Phone Number</label>
                  <input required type="tel" value={formData.buyerPhone} onChange={e => setFormData({...formData, buyerPhone: e.target.value})} className="w-full bg-neutral-bg border border-neutral-border rounded-xl p-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="+91 9876543210" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-primary mb-1.5">Email Address</label>
                  <input required type="email" value={formData.buyerEmail} onChange={e => setFormData({...formData, buyerEmail: e.target.value})} className="w-full bg-neutral-bg border border-neutral-border rounded-xl p-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="you@example.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-neutral-primary mb-1.5">Budget (Approx)</label>
                  <select value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} className="w-full bg-neutral-bg border border-neutral-border rounded-xl p-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                    <option>Under ₹1 Cr</option>
                    <option>₹1 Cr - ₹3 Cr</option>
                    <option>₹3 Cr - ₹5 Cr</option>
                    <option>Above ₹5 Cr</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-primary mb-1.5">Preferred Contact Time</label>
                  <select value={formData.preferredContactTime} onChange={e => setFormData({...formData, preferredContactTime: e.target.value})} className="w-full bg-neutral-bg border border-neutral-border rounded-xl p-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                    <option>Morning (9AM - 12PM)</option>
                    <option>Afternoon (12PM - 4PM)</option>
                    <option>Evening (4PM - 7PM)</option>
                    <option>Anytime</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-primary mb-1.5">Message / Requirements</label>
                <textarea 
                  value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-neutral-bg border border-neutral-border rounded-xl p-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none h-24"
                  placeholder={`I am interested in ${propertyTitle}...`}
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full h-12 text-base">
                {isLoading ? 'Submitting...' : 'Submit Request'}
              </Button>
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
            <h3 className="text-2xl font-bold text-neutral-primary">Request Sent Successfully!</h3>
            <p className="text-neutral-secondary">
              An EstateX broker will contact you shortly to provide more information and assist with your inquiry.
            </p>
            <Button className="mt-6 w-full" onClick={handleClose}>Done</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
};
