import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchAdminAnalytics } from '../../api/client';
import { PieChart, BarChart2 } from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminAnalytics()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading Analytics...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-neutral-primary mb-2">Platform Analytics</h1>
        <p className="text-neutral-secondary">Deep dive into platform data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm min-h-[300px]">
          <h3 className="font-bold text-neutral-primary mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-primary" /> Properties by Status
          </h3>
          <ul className="space-y-2">
            {data?.propertyAnalytics?.map((p: any) => (
              <li key={p._id} className="flex justify-between border-b pb-2">
                <span className="text-neutral-secondary font-medium">{p._id}</span>
                <span className="font-bold text-neutral-primary">{p.count}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm min-h-[300px]">
          <h3 className="font-bold text-neutral-primary mb-4 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-primary" /> Deals by Status
          </h3>
          <ul className="space-y-2">
            {data?.dealAnalytics?.map((d: any) => (
              <li key={d._id} className="flex justify-between border-b pb-2">
                <span className="text-neutral-secondary font-medium">{d._id}</span>
                <span className="font-bold text-neutral-primary">{d.count} (₹{d.totalCommission?.toLocaleString('en-IN')})</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};
