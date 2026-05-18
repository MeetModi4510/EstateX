import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchAdminProperties, updateAdminPropertyStatus, archiveAdminProperty } from '../../api/client';
import { Button } from '../../components/ui/Button';

export const AdminProperties: React.FC = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminProperties()
      .then(setProperties)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleArchive = async (id: string) => {
    if (!window.confirm('Are you sure you want to archive this property?')) return;
    try {
      const updated = await archiveAdminProperty(id);
      setProperties(properties.map(p => p._id === id ? updated : p));
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const updated = await updateAdminPropertyStatus(id, status);
      setProperties(properties.map(p => p._id === id ? updated : p));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div>Loading properties...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-neutral-primary mb-2">Properties Management</h1>
        <p className="text-neutral-secondary">View and manage all properties on the platform.</p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-border overflow-x-auto shadow-sm">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-neutral-bg border-b border-neutral-border text-sm text-neutral-secondary">
            <tr>
              <th className="px-6 py-4 font-medium">Property Code</th>
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Owner</th>
              <th className="px-6 py-4 font-medium">Broker</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-divider">
            {properties.map(p => (
              <tr key={p._id} className="hover:bg-neutral-bg/50">
                <td className="px-6 py-4 font-medium text-neutral-primary">{p.propertyCode}</td>
                <td className="px-6 py-4 font-bold text-neutral-primary">{p.title}</td>
                <td className="px-6 py-4 text-sm">{p.ownerId?.name}</td>
                <td className="px-6 py-4 text-sm">{p.brokerId?.name || 'Unassigned'}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded text-xs font-bold bg-neutral-100">{p.status}</span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Button variant="outline" className="text-xs h-8 px-3" onClick={() => handleStatusUpdate(p._id, 'PUBLISHED')}>Publish</Button>
                  <Button variant="outline" className="text-xs h-8 px-3 border-red-200 text-red-600 hover:bg-red-50" onClick={() => handleArchive(p._id)}>Archive</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
