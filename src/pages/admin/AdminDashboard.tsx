import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchAdminDashboard } from '../../api/client';
import { Building2, Users, Briefcase, FileText, IndianRupee, Activity, Target } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminDashboard()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Loading dashboard metrics...</div>;
  if (!stats) return <div className="p-8 text-red-500">Failed to load metrics.</div>;

  const cards = [
    { label: 'Total Properties', value: stats.totalProperties, icon: Building2, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Published Properties', value: stats.publishedProperties, icon: Building2, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Pending Approvals', value: stats.pendingProperties, icon: Activity, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Total Brokers', value: stats.totalBrokers, icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Total Owners', value: stats.totalOwners, icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Total Leads', value: stats.totalLeads, icon: Target, color: 'text-pink-500', bg: 'bg-pink-50' },
    { label: 'Completed Deals', value: stats.completedDeals, icon: FileText, color: 'text-teal-500', bg: 'bg-teal-50' },
    { label: 'Total Commission', value: `₹${(stats.totalEstimatedCommission || 0).toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-neutral-primary mb-2">Platform Overview</h1>
        <p className="text-neutral-secondary">High-level metrics across the EstateX platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm flex items-start justify-between group hover:border-primary transition-colors">
            <div>
              <p className="text-sm text-neutral-secondary mb-1 font-medium">{card.label}</p>
              <h3 className="text-3xl font-bold text-neutral-primary">{card.value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bg}`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
