import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { Button } from '../components/ui/Button';

const Settings: React.FC = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-display font-bold text-neutral-primary mb-2">Security Settings</h1>
        <p className="text-neutral-secondary">Manage your password and account security.</p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-border shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-neutral-primary">Change Password</h3>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-neutral-primary mb-2">Current Password</label>
            <input type="password" placeholder="Enter current password" className="w-full px-4 py-2.5 rounded-lg border border-neutral-border focus:border-primary outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-neutral-primary mb-2">New Password</label>
            <input type="password" placeholder="Enter new password" className="w-full px-4 py-2.5 rounded-lg border border-neutral-border focus:border-primary outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-neutral-primary mb-2">Confirm New Password</label>
            <input type="password" placeholder="Confirm new password" className="w-full px-4 py-2.5 rounded-lg border border-neutral-border focus:border-primary outline-none" />
          </div>
          
          <div className="pt-4 flex justify-end">
            <Button>Update Password</Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default Settings;
