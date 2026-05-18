import React from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, Clock, Users, Building2, MoreVertical, Check, Trash2 } from 'lucide-react';
import { markNotificationRead, deleteBrokerNotification } from '../api/client';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    import('../api/client').then(m => m.fetchBrokerNotifications())
      .then(data => {
        const mapped = data.map((n: any) => {
          let icon = Building2;
          let color = 'bg-neutral-100 text-neutral-600';

          if (n.type === 'PROPERTY') { icon = Clock; color = 'bg-orange-100 text-orange-600'; }
          else if (n.type === 'LEAD') { icon = Users; color = 'bg-blue-100 text-blue-600'; }
          else if (n.type === 'VISIT') { icon = CheckCircle; color = 'bg-green-100 text-green-600'; }
          else if (n.type === 'DEAL') { icon = Building2; color = 'bg-purple-100 text-purple-600'; }

          return {
            id: n._id,
            title: n.title,
            message: n.message,
            time: new Date(n.createdAt).toLocaleString(),
            icon,
            color,
            isRead: n.isRead
          };
        });
        setNotifications(mapped);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  const handleMarkRead = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Optimistic update
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    setOpenMenuId(null);
    try {
      await markNotificationRead(id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Optimistic update
    setNotifications(prev => prev.filter(n => n.id !== id));
    setOpenMenuId(null);
    try {
      await deleteBrokerNotification(id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-3xl">
      <div onClick={() => setOpenMenuId(null)}>
        <h1 className="text-3xl font-display font-bold text-neutral-primary mb-2">Notifications</h1>
        <p className="text-neutral-secondary">Stay updated on approvals, leads, and schedule changes.</p>
      </div>

      <div className="space-y-4 pb-20">
        {isLoading ? (
          <div className="text-center py-10 text-neutral-secondary">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-10 text-neutral-secondary bg-white rounded-2xl border border-neutral-border">
            You're all caught up! No notifications right now.
          </div>
        ) : (
          notifications.map(note => {
            const Icon = note.icon;
            return (
              <div 
                key={note.id} 
                className={`relative bg-white p-5 rounded-2xl border ${note.isRead ? 'border-neutral-border opacity-70' : 'border-primary/30 shadow-md'} flex gap-4 items-start hover:border-primary/50 transition-colors cursor-pointer`}
                onClick={() => setOpenMenuId(null)}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${note.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 pr-8">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-bold text-neutral-primary ${note.isRead ? '' : 'text-primary'}`}>{note.title}</h3>
                    <span className="text-xs font-medium text-neutral-secondary ml-4 whitespace-nowrap">{note.time}</span>
                  </div>
                  <p className="text-sm text-neutral-secondary">{note.message}</p>
                </div>
                
                <div className="absolute right-3 top-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === note.id ? null : note.id);
                    }}
                    className="p-1 rounded-full hover:bg-neutral-100 text-neutral-secondary transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  
                  {openMenuId === note.id && (
                    <div className="absolute right-0 top-8 w-40 bg-white rounded-lg shadow-lg border border-neutral-border py-1 z-10">
                      {!note.isRead && (
                        <button 
                          onClick={(e) => handleMarkRead(note.id, e)}
                          className="w-full text-left px-4 py-2 text-sm text-neutral-primary hover:bg-neutral-50 flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" /> Mark as read
                        </button>
                      )}
                      <button 
                        onClick={(e) => handleDelete(note.id, e)}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </motion.div>
  );
};

export default Notifications;
