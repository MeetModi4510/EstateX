import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchAdminActivityLogs } from '../../api/client';
import { FileText } from 'lucide-react';

export const AdminActivityLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminActivityLogs()
      .then(setLogs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading activity logs...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-neutral-primary mb-2">System Activity Logs</h1>
        <p className="text-neutral-secondary">Immutable record of administrative actions.</p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-border overflow-x-auto shadow-sm">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-neutral-bg border-b border-neutral-border text-sm text-neutral-secondary">
            <tr>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Admin</th>
              <th className="px-6 py-4 font-medium">Action</th>
              <th className="px-6 py-4 font-medium">Target Type</th>
              <th className="px-6 py-4 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-divider">
            {logs.map(log => (
              <tr key={log._id} className="hover:bg-neutral-bg/50">
                <td className="px-6 py-4 text-sm whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                <td className="px-6 py-4 font-bold text-neutral-primary">{log.adminId?.name || 'System'}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded text-xs font-bold bg-neutral-100">{log.action}</span>
                </td>
                <td className="px-6 py-4 text-sm">{log.targetType}</td>
                <td className="px-6 py-4 text-sm">{log.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
