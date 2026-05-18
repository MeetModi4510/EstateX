import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchAdminBrokers, updateAdminBrokerStatus, createAdminBroker } from '../../api/client';
import { Button } from '../../components/ui/Button';

export const AdminBrokers: React.FC = () => {
  const [brokers, setBrokers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBrokerId, setEditingBrokerId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [experienceYears, setExperienceYears] = useState(0);
  const [brokerIdField, setBrokerIdField] = useState(''); // Custom broker ID

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    import('../../api/client').then(m => m.fetchAdminBrokers())
      .then(setBrokers)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const { updateAdminBrokerStatus } = await import('../../api/client');
      const updated = await updateAdminBrokerStatus(id, status);
      setBrokers(brokers.map(b => b._id === id ? { ...b, accountStatus: updated.accountStatus } : b));
    } catch (e) {
      console.error(e);
    }
  };

  const openCreateForm = () => {
    setEditingBrokerId(null);
    setName('');
    setEmail('');
    setPhone('');
    setBusinessName('');
    setExperienceYears(0);
    setBrokerIdField('');
    setIsFormOpen(true);
  };

  const openEditForm = (broker: any) => {
    setEditingBrokerId(broker._id);
    setName(broker.name);
    setEmail(broker.email);
    setPhone(broker.phone || '');
    setBusinessName(broker.profile?.businessName || '');
    setExperienceYears(broker.profile?.experienceYears || 0);
    setBrokerIdField(broker.profile?.brokerId || '');
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { createAdminBroker, updateAdminBroker } = await import('../../api/client');
      
      const payload: any = { name, email, phone, businessName, experienceYears };
      if (brokerIdField) payload.brokerId = brokerIdField;

      if (editingBrokerId) {
        await updateAdminBroker(editingBrokerId, payload);
      } else {
        await createAdminBroker(payload);
      }
      
      setIsFormOpen(false);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div>Loading brokers...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-primary mb-2">Broker Management</h1>
          <p className="text-neutral-secondary">Manage brokers and their access.</p>
        </div>
        <Button onClick={isFormOpen ? () => setIsFormOpen(false) : openCreateForm}>
          {isFormOpen ? 'Cancel' : 'Add New Broker'}
        </Button>
      </div>

      {isFormOpen && (
        <div className="bg-white p-6 rounded-xl border border-neutral-border shadow-sm mb-6">
          <h3 className="font-bold text-lg mb-4">{editingBrokerId ? 'Edit Broker' : 'Create New Broker'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-neutral-secondary mb-1 block">Name</label>
              <input required type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 border rounded-xl bg-neutral-bg focus:border-primary outline-none" />
            </div>
            <div>
              <label className="text-sm font-bold text-neutral-secondary mb-1 block">Email</label>
              <input required type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} readOnly={!!editingBrokerId} className={`w-full p-3 border rounded-xl focus:border-primary outline-none ${editingBrokerId ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed' : 'bg-neutral-bg'}`} />
            </div>
            <div>
              <label className="text-sm font-bold text-neutral-secondary mb-1 block">Phone</label>
              <input required type="text" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-3 border rounded-xl bg-neutral-bg focus:border-primary outline-none" />
            </div>
            <div>
              <label className="text-sm font-bold text-neutral-secondary mb-1 block">Business Name</label>
              <input required type="text" placeholder="Business Name" value={businessName} onChange={e => setBusinessName(e.target.value)} className="w-full p-3 border rounded-xl bg-neutral-bg focus:border-primary outline-none" />
            </div>
            <div>
              <label className="text-sm font-bold text-neutral-secondary mb-1 block">Experience (Years)</label>
              <input required type="number" placeholder="Experience (Years)" value={experienceYears} onChange={e => setExperienceYears(parseInt(e.target.value))} className="w-full p-3 border rounded-xl bg-neutral-bg focus:border-primary outline-none" />
            </div>
            {editingBrokerId && (
              <div>
                <label className="text-sm font-bold text-neutral-secondary mb-1 block">Broker ID (Optional)</label>
                <input type="text" placeholder="Custom Broker ID" value={brokerIdField} onChange={e => setBrokerIdField(e.target.value)} className="w-full p-3 border rounded-xl bg-neutral-bg focus:border-primary outline-none" />
              </div>
            )}
            <div className="col-span-2 pt-2">
              <Button type="submit">{editingBrokerId ? 'Update Broker' : 'Create Broker'}</Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-neutral-border overflow-x-auto shadow-sm">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-neutral-bg border-b border-neutral-border text-sm text-neutral-secondary">
            <tr>
              <th className="px-6 py-4 font-medium">Broker ID</th>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Business</th>
              <th className="px-6 py-4 font-medium">Managed Props</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-divider">
            {brokers.map(b => (
              <tr key={b._id} className="hover:bg-neutral-bg/50">
                <td className="px-6 py-4 font-medium text-neutral-primary">{b.profile?.brokerId}</td>
                <td className="px-6 py-4 font-bold text-neutral-primary">{b.name}</td>
                <td className="px-6 py-4 text-sm">{b.profile?.businessName}</td>
                <td className="px-6 py-4 text-sm">{b.managedPropertiesCount || 0}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${b.accountStatus === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {b.accountStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Button variant="outline" className="text-xs h-8 px-3 text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => openEditForm(b)}>Edit</Button>
                  {b.accountStatus !== 'ACTIVE' ? (
                    <Button variant="outline" className="text-xs h-8 px-3 border-green-200 text-green-600 hover:bg-green-50" onClick={() => handleStatusUpdate(b._id, 'ACTIVE')}>Activate</Button>
                  ) : (
                    <Button variant="outline" className="text-xs h-8 px-3 border-red-200 text-red-600 hover:bg-red-50" onClick={() => handleStatusUpdate(b._id, 'SUSPENDED')}>Suspend</Button>
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
