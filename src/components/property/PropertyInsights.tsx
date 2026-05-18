import React from 'react';
import { TrendingUp, ShieldCheck, FileCheck, CheckSquare, Search } from 'lucide-react';

export const PropertyInsights: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Insights */}
      <div className="bg-white rounded-3xl p-8 shadow-soft border border-neutral-border">
        <h3 className="text-xl font-bold text-neutral-primary mb-6">Property Insights</h3>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-neutral-secondary">Neighborhood Score</span>
              <span className="text-primary">8.5 / 10</span>
            </div>
            <div className="w-full bg-neutral-bg-secondary h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[85%] rounded-full"></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-neutral-secondary">Investment Score</span>
              <span className="text-primary">9.2 / 10</span>
            </div>
            <div className="w-full bg-neutral-bg-secondary h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[92%] rounded-full"></div>
            </div>
          </div>
          <div className="pt-4 border-t border-neutral-divider flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-secondary mb-1">Expected APY</p>
              <p className="text-2xl font-bold text-feedback-success flex items-center gap-2"><TrendingUp className="w-5 h-5"/> +12%</p>
            </div>
            <div className="w-24 h-12 bg-neutral-bg-secondary rounded-lg flex items-center justify-center text-xs text-neutral-secondary italic border border-neutral-divider">[Chart Placeholder]</div>
          </div>
        </div>
      </div>

      {/* Safety */}
      <div className="bg-white rounded-3xl p-8 shadow-soft border border-neutral-border">
        <h3 className="text-xl font-bold text-neutral-primary mb-6 flex items-center gap-2"><ShieldCheck className="w-6 h-6 text-feedback-success"/> Safety & Verification</h3>
        <div className="space-y-4">
          {[
            { icon: FileCheck, label: 'Verified Ownership', desc: 'Title deed checked and verified' },
            { icon: CheckSquare, label: 'Document Verified', desc: 'All legal documents are clear' },
            { icon: ShieldCheck, label: 'RERA Verified', desc: 'Registered with regulatory authority' },
            { icon: Search, label: 'Inspection Completed', desc: 'Physical verification done by EstateX' }
          ].map((item, idx) => (
            <div key={idx} className="flex gap-4 p-3 rounded-xl hover:bg-neutral-bg-secondary transition-colors cursor-default">
              <div className="w-10 h-10 rounded-full bg-feedback-success/10 text-feedback-success flex-center shrink-0">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-neutral-primary text-sm">{item.label}</h4>
                <p className="text-xs text-neutral-secondary">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
