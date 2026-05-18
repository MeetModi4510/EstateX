import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { Button } from '../ui/Button';

export const HomeLoanCalculator: React.FC = () => {
  const [amount, setAmount] = useState(15000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  // EMI formula calculation
  const r = rate / (12 * 100);
  const n = tenure * 12;
  const emi = Math.round((amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="bg-white rounded-3xl p-8 shadow-soft border border-neutral-border flex flex-col lg:flex-row gap-12 items-center">
      <div className="flex-1 w-full space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-neutral-secondary font-medium">Loan Amount</span>
            <span className="font-bold text-neutral-primary">{formatCurrency(amount)}</span>
          </div>
          <input type="range" min="1000000" max="50000000" step="500000" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full accent-primary" />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-neutral-secondary font-medium">Interest Rate (p.a.)</span>
            <span className="font-bold text-neutral-primary">{rate}%</span>
          </div>
          <input type="range" min="5" max="15" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-primary" />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-neutral-secondary font-medium">Loan Tenure</span>
            <span className="font-bold text-neutral-primary">{tenure} Years</span>
          </div>
          <input type="range" min="1" max="30" step="1" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="w-full accent-primary" />
        </div>
      </div>
      
      <div className="w-full lg:w-72 bg-primary text-white rounded-2xl p-6 text-center flex flex-col justify-center shadow-lg relative overflow-hidden">
        <div className="absolute -top-10 -right-10 text-white/10"><Calculator className="w-32 h-32" /></div>
        <div className="relative z-10">
          <p className="text-white/80 text-sm mb-2">Your Monthly EMI</p>
          <h3 className="text-4xl font-bold text-secondary mb-6">{formatCurrency(emi)}</h3>
          <Button variant="secondary" className="w-full text-primary hover:bg-white">Apply for Loan</Button>
        </div>
      </div>
    </div>
  );
};
