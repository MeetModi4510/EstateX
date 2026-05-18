import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchAdminProperties, updateAdminPropertyStatus } from '../../api/client';
import { Button } from '../../components/ui/Button';

export const AdminApprovals: React.FC = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminProperties()
      .then(data => setProperties(data.filter((p: any) => p.status === 'PENDING_APPROVAL')))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const updated = await updateAdminPropertyStatus(id, status);
      setProperties(properties.filter(p => p._id !== id)); // Remove from pending list
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div>Loading approvals...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-neutral-primary mb-2">Property Approvals</h1>
        <p className="text-neutral-secondary">Admin override for pending properties.</p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-border overflow-x-auto shadow-sm">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-neutral-bg border-b border-neutral-border text-sm text-neutral-secondary">
            <tr>
              <th className="px-6 py-4 font-medium">Property Code</th>
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Owner</th>
              <th className="px-6 py-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-divider">
            {properties.map(p => (
              <tr key={p._id} className="hover:bg-neutral-bg/50">
                <td className="px-6 py-4 font-medium text-neutral-primary">{p.propertyCode}</td>
                <td className="px-6 py-4 font-bold text-neutral-primary">{p.title}</td>
                <td className="px-6 py-4 text-sm">{p.ownerId?.name}</td>
                <td className="px-6 py-4 space-x-2">
                  <Button className="text-xs h-8 px-3 bg-green-600 border-none" onClick={() => handleStatusUpdate(p._id, 'PUBLISHED')}>Approve (Override)</Button>
                  <Button variant="outline" className="text-xs h-8 px-3 border-red-200 text-red-600 hover:bg-red-50" onClick={() => handleStatusUpdate(p._id, 'REJECTED')}>Reject (Override)</Button>
                </td>
              </tr>
            ))}
            {properties.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-4 text-center text-neutral-secondary">No pending properties.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
