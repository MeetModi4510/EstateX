import React from 'react';
import { Phone, Mail, MapPin, Building2, Flame, User, Calendar } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useNavigate } from 'react-router-dom';

export interface PipelineLead {
  _id: string;
  buyerName: string;
  budget: string;
  propertyId: {
    title: string;
    locality: string;
  };
  status: string;
  leadScore: number;
  createdAt: string;
  lastContactedAt?: string;
  buyerPhone: string;
}

interface PipelineCardProps {
  lead: PipelineLead;
}

export const PipelineCard: React.FC<PipelineCardProps> = ({ lead }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="bg-white border border-neutral-border rounded-xl p-4 shadow-sm hover:border-primary/30 transition-colors cursor-pointer group flex flex-col mb-3"
      onClick={() => navigate(`/dashboard/lead/${lead._id}`)}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-neutral-primary group-hover:text-primary transition-colors text-sm">{lead.buyerName}</h3>
        <div className="flex items-center gap-1 text-orange-500 font-bold text-xs bg-orange-50 px-1.5 py-0.5 rounded">
          <Flame className="w-3 h-3" /> {lead.leadScore || 50}
        </div>
      </div>

      <div className="space-y-1.5 mb-3 text-xs text-neutral-secondary">
        <div className="flex items-start gap-2">
          <Building2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span className="line-clamp-1" title={lead.propertyId?.title}>{lead.propertyId?.title || 'Unknown Property'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {lead.propertyId?.locality || 'Unknown Area'}</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-3">
        <span className="font-bold text-primary text-sm">{lead.budget}</span>
        <span className="text-xs text-neutral-secondary flex items-center gap-1">
          <Calendar className="w-3 h-3" /> {new Date(lead.createdAt).toLocaleDateString()}
        </span>
      </div>

      <div className="flex gap-2 pt-3 border-t border-neutral-divider mt-auto">
        <Button 
          className="flex-1 h-8 text-[10px] gap-1.5 justify-center" 
          onClick={(e) => { e.stopPropagation(); window.location.href = `tel:${lead.buyerPhone}`; }}
        >
          <Phone className="w-3 h-3" /> Call
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 h-8 text-[10px] gap-1.5 justify-center"
          onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/lead/${lead._id}`); }}
        >
          <Mail className="w-3 h-3" /> Email
        </Button>
      </div>
    </div>
  );
};
