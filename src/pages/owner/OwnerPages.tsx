import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Eye, CheckCircle, Clock, XCircle, BarChart3, TrendingUp, Bell, Calendar, User, Camera, Lock, MoreVertical, Check, Trash2 } from 'lucide-react';
import { StatCard } from '../../components/broker/StatCard';
import { PropertyTable, OwnerProperty, PropertyStatus } from '../../components/owner/PropertyTable';
import { StatusTimeline } from '../../components/owner/StatusTimeline';
import { Button } from '../../components/ui/Button';
import { fetchOwnerProperties, fetchOwnerAnalytics } from '../../api/client';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const getLoggedInUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  return null;
};

// Map backend property to OwnerProperty interface
const mapPropertyData = (p: any): OwnerProperty => ({
  id: p._id,
  title: p.title || 'Untitled Property',
  location: `${p.locality || ''}, ${p.city || ''}`.replace(/^, /, ''),
  price: p.price ? `₹${(p.price / 100000).toFixed(2)} L` : 'N/A',
  status: p.status === 'PUBLISHED' ? 'Published' : p.status === 'PENDING_APPROVAL' ? 'Pending Review' : p.status === 'REJECTED' ? 'Rejected' : p.status === 'APPROVED' ? 'Approved' : 'Draft',
  views: 0,
  submittedDate: new Date(p.createdAt).toLocaleDateString(),
  imageUrl: p.images && p.images.length > 0 ? p.images[0].imageUrl : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800'
});

export const Overview: React.FC = () => {
  const user = getLoggedInUser();
  const [properties, setProperties] = useState<OwnerProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOwnerProperties()
      .then(data => {
        setProperties(data.map(mapPropertyData));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalProperties = properties.length;
  const pendingCount = properties.filter(p => p.status === 'Pending Review').length;
  const approvedCount = properties.filter(p => p.status === 'Published' || p.status === 'Approved').length;

  const stats = [
    { title: 'Total Properties', value: totalProperties.toString(), icon: Building2, delay: 0 },
    { title: 'Pending Approval', value: pendingCount.toString(), icon: Clock, delay: 0.1 },
    { title: 'Approved/Live', value: approvedCount.toString(), icon: CheckCircle, delay: 0.2 },
    { title: 'Total Views', value: '0', icon: Eye, trend: { value: 0, label: 'vs last month' }, delay: 0.3 },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-neutral-primary mb-2">Welcome back, {user?.name?.split(' ')[0] || 'User'}!</h1>
        <p className="text-neutral-secondary">Here's an overview of your property portfolio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-neutral-primary">Recent Property Status</h2>
        
        {loading ? (
           <p className="text-neutral-secondary">Loading your properties...</p>
        ) : properties.length > 0 ? (
          <div className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-neutral-divider">
               <img src={properties[0].imageUrl} alt="" className="w-16 h-16 rounded-xl object-cover" />
               <div>
                 <h3 className="font-bold text-neutral-primary">{properties[0].title}</h3>
                 <p className="text-sm text-neutral-secondary">Submitted on {properties[0].submittedDate}</p>
               </div>
            </div>
            <StatusTimeline currentStatus={properties[0].status as any} />
          </div>
        ) : (
          <div className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm text-center">
             <p className="text-neutral-secondary mb-4">You haven't listed any properties yet.</p>
             <Link to="/add-property"><Button>Add New Property</Button></Link>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const MyProperties: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<OwnerProperty[]>([]);
  const [loading, setLoading] = useState(true);
  
  const pathParts = location.pathname.split('/');
  const lastPart = pathParts[pathParts.length - 1];
  
  let currentTab: 'All' | PropertyStatus = 'All';
  if (lastPart === 'drafts') currentTab = 'Draft';
  else if (lastPart === 'pending') currentTab = 'Pending Review';
  else if (lastPart === 'approved') currentTab = 'Approved';
  else if (lastPart === 'rejected') currentTab = 'Rejected';
  else if (lastPart === 'published') currentTab = 'Published';

  const [activeTab, setActiveTab] = useState<'All' | PropertyStatus>(currentTab);

  useEffect(() => {
    setActiveTab(currentTab);
  }, [currentTab]);

  useEffect(() => {
    fetchOwnerProperties()
      .then(data => {
        setProperties(data.map(mapPropertyData));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const tabs = ['All', 'Draft', 'Pending Review', 'Approved', 'Published', 'Rejected'];
  
  const handleTabClick = (tab: string) => {
    setActiveTab(tab as any);
    if (tab === 'All') navigate('/dashboard/owner/properties');
    else if (tab === 'Draft') navigate('/dashboard/owner/drafts');
    else if (tab === 'Pending Review') navigate('/dashboard/owner/pending');
    else if (tab === 'Approved') navigate('/dashboard/owner/approved');
    else if (tab === 'Published') navigate('/dashboard/owner/published');
    else if (tab === 'Rejected') navigate('/dashboard/owner/rejected');
  };

  const filteredProperties = activeTab === 'All' 
    ? properties 
    : properties.filter(p => p.status === activeTab);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      // In a real app, you would call a DELETE API here.
      // For now, we will just optimistically remove it from state.
      setProperties(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-primary mb-2">My Properties</h1>
          <p className="text-neutral-secondary">Manage and track all your listings in one place.</p>
        </div>
        <Link to="/add-property">
          <Button className="gap-2">
            <Building2 className="w-4 h-4" /> Add New Property
          </Button>
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
              activeTab === tab 
                ? 'bg-primary text-white' 
                : 'bg-white text-neutral-secondary hover:bg-neutral-bg border border-neutral-border'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-neutral-secondary py-8 text-center">Loading properties...</p>
      ) : (
        <PropertyTable properties={filteredProperties} onDelete={handleDelete} />
      )}
    </motion.div>
  );
};

export const Analytics: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOwnerAnalytics()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-neutral-primary mb-2">Property Analytics</h1>
        <p className="text-neutral-secondary">Track the performance of your live listings.</p>
      </div>

      {loading ? (
        <p className="text-neutral-secondary py-8">Loading analytics...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-neutral-border shadow-sm flex flex-col min-h-[400px]">
              <h3 className="font-bold text-neutral-primary mb-6">Monthly Views Overview ({data?.totalViews || 0} Total)</h3>
              {data?.chartData && data.chartData.length > 0 ? (
                <div className="flex-1 w-full min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                      <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} 
                        tickFormatter={(val) => {
                          const d = new Date(val);
                          return `${d.getDate()}/${d.getMonth()+1}`;
                        }}
                      />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                        labelFormatter={(val) => new Date(val).toLocaleDateString()}
                      />
                      <Line type="monotone" dataKey="views" stroke="#5C4B41" strokeWidth={3} dot={{ r: 4, fill: '#5C4B41' }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <BarChart3 className="w-16 h-16 text-neutral-divider mb-4" />
                  <p className="text-sm text-neutral-secondary text-center">No view data available yet.</p>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm flex flex-col min-h-[400px]">
              <h3 className="font-bold text-neutral-primary mb-6">Top Performing Listing</h3>
              {data?.topProperty ? (
                <div className="flex-1 flex flex-col">
                  <div className="relative w-full h-40 rounded-xl overflow-hidden mb-4">
                    <img 
                      src={data.topProperty.property.images && data.topProperty.property.images.length > 0 
                        ? data.topProperty.property.images[0].imageUrl 
                        : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80'} 
                      alt="Top Property" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary flex items-center gap-1 shadow-sm">
                      <Eye className="w-3.5 h-3.5" /> {data.topProperty.views} Views
                    </div>
                  </div>
                  <h4 className="font-bold text-neutral-primary text-lg mb-1">{data.topProperty.property.title}</h4>
                  <p className="text-sm text-neutral-secondary mb-4">{data.topProperty.property.city}</p>
                  
                  <div className="mt-auto space-y-3 pt-4 border-t border-neutral-divider">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-neutral-secondary">Status</span>
                      <span className="font-semibold text-feedback-success">{data.topProperty.property.status}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-neutral-secondary">Listed Price</span>
                      <span className="font-semibold text-neutral-primary">₹{(data.topProperty.property.price / 100000).toFixed(2)} L</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <TrendingUp className="w-16 h-16 text-neutral-divider mb-4" />
                  <p className="text-sm text-neutral-secondary text-center">Your top property will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    import('../../api/client').then(m => m.fetchOwnerNotifications())
      .then(data => {
        const mapped = data.map((n: any) => {
          let icon = Bell;
          let color = 'bg-neutral-100 text-neutral-600';
          let type = 'info';

          if (n.type === 'PROPERTY') { 
            icon = Building2; 
            if (n.title.toLowerCase().includes('approved')) {
              color = 'bg-green-100 text-green-600';
              type = 'success';
            } else if (n.title.toLowerCase().includes('rejected')) {
              color = 'bg-red-100 text-red-600';
              type = 'error';
            } else {
              color = 'bg-blue-100 text-blue-600';
            }
          }

          return {
            id: n._id,
            title: n.title,
            message: n.message,
            time: new Date(n.createdAt).toLocaleString(),
            icon,
            color,
            isRead: n.isRead,
            type
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
      const { markOwnerNotificationRead } = await import('../../api/client');
      await markOwnerNotificationRead(id);
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
      const { deleteOwnerNotification } = await import('../../api/client');
      await deleteOwnerNotification(id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-3xl">
      <div onClick={() => setOpenMenuId(null)}>
        <h1 className="text-3xl font-display font-bold text-neutral-primary mb-2">Notifications</h1>
        <p className="text-neutral-secondary">Stay updated on your property status and broker actions.</p>
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

export const Profile: React.FC = () => {
  const user = getLoggedInUser();
  const [profile, setProfile] = React.useState({
    firstName: user?.name ? user.name.split(' ')[0] : 'User',
    lastName: user?.name ? user.name.split(' ').slice(1).join(' ') : '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [isSaving, setIsSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const name = `${profile.firstName} ${profile.lastName}`.trim();
      const { updateProfile } = await import('../../api/client');
      const updatedData = await updateProfile({
        name,
        email: profile.email,
        phone: profile.phone
      });

      const userStr = localStorage.getItem('user');
      let currentUser = {};
      if (userStr) {
        try { currentUser = JSON.parse(userStr); } catch (e) {}
      }
      
      const mergedUser = { ...currentUser, ...updatedData.user };
      localStorage.setItem('user', JSON.stringify(mergedUser));
      
      setSaved(true);
      window.dispatchEvent(new Event('storage'));
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const initials = profile.firstName.charAt(0).toUpperCase() + (profile.lastName ? profile.lastName.charAt(0).toUpperCase() : '');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-display font-bold text-neutral-primary mb-2">Account Profile</h1>
        <p className="text-neutral-secondary">Manage your personal information.</p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-neutral-divider flex items-center gap-6">
          <div className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-3xl overflow-hidden">
              {initials}
            </div>
            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-xl text-neutral-primary">{profile.firstName} {profile.lastName}</h3>
            <p className="text-neutral-secondary mb-3">Property Owner</p>
            <Button size="sm" variant="outline">Change Photo</Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-neutral-primary mb-2">First Name</label>
              <input type="text" name="firstName" value={profile.firstName} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-neutral-border focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-neutral-primary mb-2">Last Name</label>
              <input type="text" name="lastName" value={profile.lastName} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-neutral-border focus:border-primary outline-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-neutral-primary mb-2">Email Address</label>
              <input type="email" value={profile.email} readOnly className="w-full px-4 py-2.5 rounded-lg border border-neutral-border bg-neutral-bg text-neutral-secondary outline-none cursor-not-allowed" />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <Button onClick={handleSave} disabled={isSaving || saved}>
              {saved ? 'Saved' : isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const Settings: React.FC = () => {
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
