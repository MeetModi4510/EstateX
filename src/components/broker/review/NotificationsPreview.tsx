import React from 'react';
import { Bell, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export const NotificationsPreview: React.FC = () => {
  const notifications = [
    {
      id: '1',
      title: 'Action Required: Update Listing',
      message: 'Broker has requested changes: "Need Better Images, Price Verification Required".',
      time: 'Just now',
      type: 'warning'
    },
    {
      id: '2',
      title: 'Property Approved',
      message: 'Congratulations! Your property "Luxury Sea View Penthouse" is now live.',
      time: 'Placeholder',
      type: 'success'
    }
  ];

  return (
    <div className="bg-white border border-neutral-border rounded-2xl p-5 shadow-sm mt-6">
      <div className="flex items-center gap-2 mb-4 border-b border-neutral-divider pb-3">
        <Bell className="w-5 h-5 text-neutral-secondary" />
        <h2 className="text-sm font-bold text-neutral-primary uppercase tracking-wider">Owner Notifications Preview</h2>
      </div>
      
      <p className="text-xs text-neutral-secondary mb-4 flex items-center gap-1.5">
        <Mail className="w-3.5 h-3.5" /> What the owner will see based on your actions.
      </p>

      <div className="space-y-3">
        {notifications.map((notif, index) => (
          <motion.div 
            key={notif.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-3 rounded-xl border ${notif.type === 'warning' ? 'bg-orange-50 border-orange-100' : 'bg-green-50 border-green-100'}`}
          >
            <h4 className={`text-xs font-bold mb-1 ${notif.type === 'warning' ? 'text-orange-800' : 'text-green-800'}`}>
              {notif.title}
            </h4>
            <p className={`text-xs ${notif.type === 'warning' ? 'text-orange-700' : 'text-green-700'} mb-2`}>
              {notif.message}
            </p>
            <div className={`text-[10px] font-medium ${notif.type === 'warning' ? 'text-orange-500' : 'text-green-500'}`}>
              {notif.time}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
