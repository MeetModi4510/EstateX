import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchAdminLeads, reassignAdminLead, fetchAdminBrokers } from '../../api/client';
import { Button } from '../../components/ui/Button';

export const AdminLeads: React.FC = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [brokers, setBrokers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reassigning, setReassigning] = useState<string | null>(null);
  const [selectedBroker, setSelectedBroker] = useState('');

  useEffect(() => {
    Promise.all([fetchAdminLeads(), fetchAdminBrokers()])
      .then(([leadsData, brokersData]) => {
        setLeads(leadsData);
        setBrokers(brokersData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleReassign = async (id: string) => {
    if (!selectedBroker) return;
    try {
      const updated = await reassignAdminLead(id, selectedBroker);
      setLeads(leads.map(l => l._id === id ? updated : l));
      setReassigning(null);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div>Loading leads...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-neutral-primary mb-2">Leads Oversight</h1>
        <p className="text-neutral-secondary">Monitor platform leads and reassign if necessary.</p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-border overflow-x-auto shadow-sm">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-neutral-bg border-b border-neutral-border text-sm text-neutral-secondary">
            <tr>
              <th className="px-6 py-4 font-medium">Buyer</th>
              <th className="px-6 py-4 font-medium">Property</th>
              <th className="px-6 py-4 font-medium">Assigned Broker</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-divider">
            {leads.map(l => (
              <tr key={l._id} className="hover:bg-neutral-bg/50">
                <td className="px-6 py-4 font-bold text-neutral-primary">{l.buyerName}</td>
                <td className="px-6 py-4 text-sm">{l.propertyId?.title || 'Unknown Property'}</td>
                <td className="px-6 py-4 text-sm">{l.brokerId?.name || 'Unassigned'}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded text-xs font-bold bg-neutral-100">{l.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  {reassigning === l._id ? (
                    <div className="flex items-center gap-2 justify-end">
                      <select className="text-sm p-1 border rounded" value={selectedBroker} onChange={e => setSelectedBroker(e.target.value)}>
                        <option value="">Select Broker</option>
                        {brokers.map(b => (
                          <option key={b._id} value={b._id}>{b.name}</option>
                        ))}
                      </select>
                      <Button className="text-xs h-8 px-2" onClick={() => handleReassign(l._id)}>Save</Button>
                      <Button variant="outline" className="text-xs h-8 px-2" onClick={() => setReassigning(null)}>Cancel</Button>
                    </div>
                  ) : (
                    <Button variant="outline" className="text-xs h-8 px-3" onClick={() => setReassigning(l._id)}>Reassign</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
