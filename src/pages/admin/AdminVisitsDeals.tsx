import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchAdminVisits, fetchAdminDeals } from '../../api/client';

export const AdminVisits: React.FC = () => {
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminVisits()
      .then(setVisits)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading visits...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-neutral-primary mb-2">Platform Visits</h1>
        <p className="text-neutral-secondary">View all scheduled and completed property visits.</p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-border overflow-x-auto shadow-sm">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-neutral-bg border-b border-neutral-border text-sm text-neutral-secondary">
            <tr>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Time</th>
              <th className="px-6 py-4 font-medium">Buyer</th>
              <th className="px-6 py-4 font-medium">Property</th>
              <th className="px-6 py-4 font-medium">Broker</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-divider">
            {visits.map(v => (
              <tr key={v._id} className="hover:bg-neutral-bg/50">
                <td className="px-6 py-4 text-sm">{new Date(v.scheduledDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm">{v.scheduledTime}</td>
                <td className="px-6 py-4 font-bold text-neutral-primary">{v.leadId?.buyerName || 'Unknown'}</td>
                <td className="px-6 py-4 text-sm">{v.propertyId?.title || 'Unknown Property'}</td>
                <td className="px-6 py-4 text-sm">{v.brokerId?.name || 'Unassigned'}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded text-xs font-bold bg-neutral-100">{v.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export const AdminDeals: React.FC = () => {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminDeals()
      .then(setDeals)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading deals...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-neutral-primary mb-2">Platform Deals</h1>
        <p className="text-neutral-secondary">Overview of all active and completed property deals.</p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-border overflow-x-auto shadow-sm">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-neutral-bg border-b border-neutral-border text-sm text-neutral-secondary">
            <tr>
              <th className="px-6 py-4 font-medium">Property</th>
              <th className="px-6 py-4 font-medium">Buyer</th>
              <th className="px-6 py-4 font-medium">Broker</th>
              <th className="px-6 py-4 font-medium">Final Price</th>
              <th className="px-6 py-4 font-medium">Commission</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-divider">
            {deals.map(d => (
              <tr key={d._id} className="hover:bg-neutral-bg/50">
                <td className="px-6 py-4 font-bold text-neutral-primary">{d.propertyId?.title || 'Unknown Property'}</td>
                <td className="px-6 py-4 text-sm">{d.leadId?.buyerName || 'Unknown'}</td>
                <td className="px-6 py-4 text-sm">{d.brokerId?.name || 'Unassigned'}</td>
                <td className="px-6 py-4 text-sm">₹{d.finalPrice?.toLocaleString('en-IN') || 'N/A'}</td>
                <td className="px-6 py-4 text-sm font-bold text-green-600">₹{d.commissionAmount?.toLocaleString('en-IN') || 'N/A'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${d.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-neutral-100'}`}>
                    {d.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
