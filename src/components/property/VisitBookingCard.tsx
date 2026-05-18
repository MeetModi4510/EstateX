import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Users, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { submitInquiry } from '../../api/client';

export const VisitBookingCard: React.FC<{ propertyId: string, propertyTitle: string }> = ({ propertyId, propertyTitle }) => {
  const [formData, setFormData] = useState({
    buyerName: '', buyerPhone: '', buyerEmail: '',
    date: '', time: '10:00 AM - 11:00 AM', visitors: '1 Person'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!formData.buyerName || !formData.buyerPhone || !formData.date) {
      setError('Please fill in name, phone, and date.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      await submitInquiry({
        propertyId,
        inquiryType: 'VISIT',
        buyerName: formData.buyerName,
        buyerPhone: formData.buyerPhone,
        buyerEmail: formData.buyerEmail,
        budget: 'Not specified',
        preferredContactTime: formData.time,
        message: `Visit requested for ${formData.date} at ${formData.time} for ${formData.visitors}.`
      });
      setIsSuccess(true);
    } catch (err) {
      setError('Failed to book visit');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-neutral-border mt-6 text-center">
        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-neutral-primary mb-2">Visit Request Sent</h3>
        <p className="text-sm text-neutral-secondary">The broker will confirm your visit shortly.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-soft border border-neutral-border mt-6">
      <h3 className="text-lg font-bold text-neutral-primary mb-4">Book Site Visit</h3>
      
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-neutral-secondary mb-1.5 uppercase tracking-wide">Your Name *</label>
          <input type="text" value={formData.buyerName} onChange={e => setFormData({...formData, buyerName: e.target.value})} className="w-full px-4 py-2.5 bg-neutral-bg/50 rounded-xl border border-neutral-border focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none text-sm transition-all" placeholder="Full Name" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-secondary mb-1.5 uppercase tracking-wide">Phone Number *</label>
          <input type="tel" value={formData.buyerPhone} onChange={e => setFormData({...formData, buyerPhone: e.target.value})} className="w-full px-4 py-2.5 bg-neutral-bg/50 rounded-xl border border-neutral-border focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none text-sm transition-all" placeholder="+91 9876543210" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-secondary mb-1.5 uppercase tracking-wide">Email Address</label>
          <input type="email" value={formData.buyerEmail} onChange={e => setFormData({...formData, buyerEmail: e.target.value})} className="w-full px-4 py-2.5 bg-neutral-bg/50 rounded-xl border border-neutral-border focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none text-sm transition-all" placeholder="you@example.com" />
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-border to-transparent my-4"></div>
        <div>
          <label className="block text-xs font-semibold text-neutral-secondary mb-1.5 uppercase tracking-wide">Select Date *</label>
          <div className="relative">
            <CalendarIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-secondary" />
            <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-neutral-bg/50 rounded-xl border border-neutral-border focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none text-sm transition-all" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-secondary mb-1.5 uppercase tracking-wide">Select Time</label>
          <div className="relative">
            <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-secondary" />
            <select value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-neutral-bg/50 rounded-xl border border-neutral-border focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none text-sm transition-all appearance-none cursor-pointer">
              <option>10:00 AM - 11:00 AM</option>
              <option>11:00 AM - 12:00 PM</option>
              <option>02:00 PM - 03:00 PM</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-secondary mb-1.5 uppercase tracking-wide">Visitors</label>
          <div className="relative">
            <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-secondary" />
            <select value={formData.visitors} onChange={e => setFormData({...formData, visitors: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-neutral-bg/50 rounded-xl border border-neutral-border focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none text-sm transition-all appearance-none cursor-pointer">
              <option>1 Person</option>
              <option>2 Persons</option>
              <option>3+ Persons</option>
            </select>
          </div>
        </div>
      </div>
      
      <Button className="w-full shadow-md" onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? 'Requesting...' : 'Request Visit'}
      </Button>
    </div>
  );
};
