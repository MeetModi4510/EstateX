import React from 'react';
import { Phone, Mail, MapPin, Building2, Flame, User } from 'lucide-react';
import { Button } from '../ui/Button';

export interface BuyerLead {
  id: string;
  name: string;
  budget: string;
  preferredArea: string;
  interestedProperty: string;
  status: 'New' | 'Contacted' | 'Visiting' | 'Negotiating';
  leadScore: number; // out of 100
}

interface LeadCardProps {
  lead: BuyerLead;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead }) => {
  return (
    <div className="bg-white border border-neutral-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-lg">
            {lead.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-neutral-primary">{lead.name}</h3>
            <div className="text-xs text-neutral-secondary flex items-center gap-1 font-medium mt-0.5">
              <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold ${
                lead.status === 'New' ? 'bg-blue-100 text-blue-700' :
                lead.status === 'Contacted' ? 'bg-orange-100 text-orange-700' :
                'bg-green-100 text-green-700'
              }`}>
                {lead.status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-orange-500 font-bold text-sm bg-orange-50 px-2 py-1 rounded-md">
            <Flame className="w-3.5 h-3.5" /> Score: {lead.leadScore}
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2 text-sm text-neutral-primary font-medium">
          <Building2 className="w-4 h-4 text-neutral-secondary" /> {lead.interestedProperty}
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="flex items-center gap-2 text-neutral-secondary"><MapPin className="w-4 h-4" /> {lead.preferredArea}</span>
          <span className="font-bold text-primary">{lead.budget}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button className="flex-1 gap-2 h-9 text-xs justify-center"><Phone className="w-3.5 h-3.5" /> Call</Button>
        <Button variant="outline" className="flex-1 gap-2 h-9 text-xs justify-center"><Mail className="w-3.5 h-3.5" /> Email</Button>
      </div>
    </div>
  );
};
