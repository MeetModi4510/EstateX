import React from 'react';
import { Phone, Mail, Calendar, CheckCircle2, Star } from 'lucide-react';
import { Button } from '../ui/Button';

interface BrokerCardProps {
  brokerName?: string;
}

export const BrokerCard: React.FC<BrokerCardProps> = ({ brokerName }) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-soft border border-neutral-border sticky top-24">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full p-0.5 border-2 border-primary/20 shrink-0">
          <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150" className="w-full h-full rounded-full object-cover" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-neutral-primary flex items-center gap-1.5 leading-tight">
            {brokerName || 'EstateX Broker'} <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
          </h3>
          <p className="text-sm text-neutral-secondary font-medium mt-0.5">Verified Premium Broker</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center p-2.5 bg-white border border-neutral-border rounded-2xl shadow-sm">
          <div className="font-bold text-neutral-primary text-sm">8 Yrs</div>
          <div className="text-xs text-neutral-secondary font-medium mt-0.5">Exp.</div>
        </div>
        <div className="text-center p-2.5 bg-white border border-neutral-border rounded-2xl shadow-sm">
          <div className="font-bold text-neutral-primary text-sm">120+</div>
          <div className="text-xs text-neutral-secondary font-medium mt-0.5">Props</div>
        </div>
        <div className="text-center p-2.5 bg-white border border-neutral-border rounded-2xl shadow-sm">
          <div className="font-bold text-neutral-primary text-sm flex items-center justify-center gap-1"><Star className="w-3.5 h-3.5 fill-primary text-primary"/> 4.9</div>
          <div className="text-xs text-neutral-secondary font-medium mt-0.5">Rating</div>
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <Button className="w-full gap-2 shadow-md"><Phone className="w-4 h-4"/> Call Now</Button>
        <Button variant="outline" className="w-full gap-2 hover:bg-neutral-bg"><Mail className="w-4 h-4"/> Send Message</Button>
      </div>
    </div>
  );
};
