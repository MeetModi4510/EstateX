import React, { useState, useEffect } from 'react';
import { PipelineCard, PipelineLead } from './PipelineCard';
import { fetchBrokerLeads } from '../../../api/client';

const STAGES = [
  { label: 'New Lead', value: 'NEW' },
  { label: 'Contacted', value: 'CONTACTED' },
  { label: 'Interested', value: 'INTERESTED' },
  { label: 'Visit Scheduled', value: 'VISIT_SCHEDULED' },
  { label: 'Negotiation', value: 'NEGOTIATION' },
  { label: 'Token Received', value: 'TOKEN_RECEIVED' },
  { label: 'Deal Completed', value: 'DEAL_COMPLETED' },
  { label: 'Lost', value: 'LOST' }
];

export const LeadPipeline: React.FC = () => {
  const [leads, setLeads] = useState<PipelineLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBrokerLeads()
      .then(setLeads)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const getLeadsByStage = (stageValue: string) => leads.filter(lead => lead.status === stageValue);

  return (
    <div className="flex h-[calc(100vh-200px)] overflow-x-auto overflow-y-hidden custom-scrollbar pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 space-x-4">
      {STAGES.map(stage => {
        const stageLeads = getLeadsByStage(stage.value);
        
        return (
          <div key={stage.value} className="flex-none w-[320px] flex flex-col h-full bg-neutral-bg-secondary rounded-2xl border border-neutral-border p-3">
            <div className="flex justify-between items-center mb-4 px-1">
              <h3 className="font-bold text-neutral-primary uppercase tracking-wider text-xs">{stage.label}</h3>
              <span className="bg-white border border-neutral-border text-neutral-secondary text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                {stageLeads.length}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
              {isLoading ? (
                <div className="h-24 flex items-center justify-center text-sm font-medium text-neutral-secondary">Loading...</div>
              ) : stageLeads.length > 0 ? (
                stageLeads.map(lead => (
                  <PipelineCard key={lead._id} lead={lead} />
                ))
              ) : (
                <div className="h-24 border-2 border-dashed border-neutral-border rounded-xl flex items-center justify-center text-sm font-medium text-neutral-secondary opacity-50">
                  Drop leads here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
