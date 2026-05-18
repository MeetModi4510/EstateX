import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchAdminPropertyOwners, updateAdminOwnerStatus } from '../../api/client';
import { Button } from '../../components/ui/Button';

export const AdminPropertyOwners: React.FC = () => {
  const [owners, setOwners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminPropertyOwners()
      .then(setOwners)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const updated = await updateAdminOwnerStatus(id, status);
      setOwners(owners.map(o => o._id === id ? { ...o, accountStatus: updated.accountStatus } : o));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div>Loading property owners...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-neutral-primary mb-2">Property Owners</h1>
        <p className="text-neutral-secondary">Manage property owners and view their properties.</p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-border overflow-x-auto shadow-sm">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-neutral-bg border-b border-neutral-border text-sm text-neutral-secondary">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Total Props</th>
              <th className="px-6 py-4 font-medium">Published</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-divider">
            {owners.map(o => (
              <tr key={o._id} className="hover:bg-neutral-bg/50">
                <td className="px-6 py-4 font-bold text-neutral-primary">{o.name}</td>
                <td className="px-6 py-4 text-sm">{o.email}</td>
                <td className="px-6 py-4 text-sm">{o.totalProperties}</td>
                <td className="px-6 py-4 text-sm">{o.publishedProperties}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${o.accountStatus === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {o.accountStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {o.accountStatus !== 'ACTIVE' ? (
                    <Button variant="outline" className="text-xs h-8 px-3 border-green-200 text-green-600 hover:bg-green-50" onClick={() => handleStatusUpdate(o._id, 'ACTIVE')}>Activate</Button>
                  ) : (
                    <Button variant="outline" className="text-xs h-8 px-3 border-red-200 text-red-600 hover:bg-red-50" onClick={() => handleStatusUpdate(o._id, 'SUSPENDED')}>Suspend</Button>
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
