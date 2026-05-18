import React from 'react';
import { StatCard } from '../../components/broker/StatCard';
import { Timeline } from '../../components/broker/Timeline';
import { ApprovalCard, ApprovalRequest } from '../../components/broker/ApprovalCard';
import { ListingTable, Listing } from '../../components/broker/ListingTable';
import { LeadCard, BuyerLead } from '../../components/broker/LeadCard';
import { VisitCard, VisitRequest } from '../../components/broker/VisitCard';
import { EmptyState } from '../../components/broker/EmptyState';
import { 
  Building2, Users, MapPin, Wallet, CheckCircle, Clock, Search, FolderOpen,
  Mail, Phone, MoreVertical, Calendar as CalendarIcon, TrendingUp, BarChart, Download, FileText, PieChart, User
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { LeadPipeline } from '../../components/broker/crm/LeadPipeline';

export const Overview: React.FC = () => {
  const [counts, setCounts] = React.useState({ listed: 0, pending: 0, leads: 0, visits: 0 });
  const [isLoading, setIsLoading] = React.useState(true);

  const [firstName, setFirstName] = React.useState('Broker');

  React.useEffect(() => {
    const loadUser = () => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setFirstName(user?.name ? user.name.split(' ')[0] : 'Broker');
        } catch (e) {}
      }
    };
    
    loadUser();
    window.addEventListener('storage', loadUser);
    return () => window.removeEventListener('storage', loadUser);
  }, []);

  const [recentActivity, setRecentActivity] = React.useState<any[]>([]);

  React.useEffect(() => {
    Promise.all([
      import('../../api/client').then(m => m.fetchPublicProperties()),
      import('../../api/client').then(m => m.fetchBrokerPendingProperties()),
      import('../../api/client').then(m => m.fetchBrokerLeads()),
      import('../../api/client').then(m => m.fetchBrokerVisits()),
      import('../../api/client').then(m => m.fetchBrokerNotifications().catch(() => []))
    ]).then(([publicData, pendingProps, leads, visits, notifications]) => {
      const listedPropsCount = publicData.total || 0;
      const pendingPropsCount = pendingProps?.length || 0;
      
      setCounts({
        listed: listedPropsCount,
        pending: pendingPropsCount,
        leads: leads?.length || 0,
        visits: visits?.length || 0
      });

      const timelineData = (notifications || [])
        .slice(0, 5)
        .map((n: any) => {
          let icon = Building2;
          let type: 'info' | 'success' | 'warning' | 'default' = 'default';

          if (n.type === 'PROPERTY') { icon = Building2; type = 'info'; }
          else if (n.type === 'LEAD') { icon = Users; type = 'warning'; }
          else if (n.type === 'VISIT') { icon = MapPin; type = 'success'; }
          else if (n.type === 'DEAL') { icon = Wallet; type = 'default'; }
          
          return {
            id: n._id,
            title: n.title,
            description: n.message,
            time: new Date(n.createdAt).toLocaleDateString(),
            icon,
            type
          };
        });
      setRecentActivity(timelineData);
    }).catch(console.error).finally(() => setIsLoading(false));
  }, []);

  const stats = [
    { title: 'Properties Listed', value: isLoading ? '...' : counts.listed.toString(), icon: Building2, trend: { value: 12, label: 'vs last month' }, delay: 0 },
    { title: 'Pending Approval', value: isLoading ? '...' : counts.pending.toString(), icon: CheckCircle, delay: 0.1 },
    { title: 'Buyer Leads', value: isLoading ? '...' : counts.leads.toString(), icon: Users, trend: { value: 24, label: 'vs last month' }, delay: 0.2 },
    { title: 'Scheduled Visits', value: isLoading ? '...' : counts.visits.toString(), icon: MapPin, delay: 0.3 },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-neutral-primary mb-2">Welcome back, {firstName}!</h1>
        <p className="text-neutral-secondary">Here's what's happening with your properties today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-neutral-primary">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {['Approve Properties', 'Add Property', 'Schedule Visit', 'View Reports'].map(action => (
                <button key={action} className="p-4 border border-neutral-divider rounded-xl hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center text-center gap-2 group">
                  <div className="w-10 h-10 bg-neutral-bg group-hover:bg-white rounded-full flex items-center justify-center transition-colors">
                    <CheckCircle className="w-5 h-5 text-neutral-secondary group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-xs font-bold text-neutral-primary">{action}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm">
          <h2 className="text-xl font-bold text-neutral-primary mb-6">Recent Activity</h2>
          {isLoading ? (
            <div className="text-sm text-neutral-secondary">Loading activity...</div>
          ) : recentActivity.length > 0 ? (
            <Timeline items={recentActivity} />
          ) : (
            <div className="text-sm text-neutral-secondary text-center py-4 bg-neutral-bg/50 rounded-xl border border-neutral-divider">No recent activity.</div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const Approvals: React.FC = () => {
  const [pendingRequests, setPendingRequests] = React.useState<ApprovalRequest[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchRequests = () => {
    setIsLoading(true);
    import('../../api/client').then(m => m.fetchBrokerPendingProperties())
      .then(properties => {
        const mapped = properties.map((p: any) => ({
          id: p._id,
          propertyTitle: p.title || 'Untitled Property',
          location: `${p.locality || ''}, ${p.city || ''}`.replace(/^, |, $/g, '') || 'Location Unknown',
          submittedBy: p.ownerId?.name ? `${p.ownerId.name} (Owner)` : 'Unknown Owner',
          submittedDate: new Date(p.createdAt).toLocaleDateString(),
          qualityScore: Math.floor(Math.random() * (98 - 75 + 1) + 75), // Random score for UI realism until added to backend
          imageUrl: p.images?.find((img: any) => img.isCover)?.imageUrl || p.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800'
        }));
        setPendingRequests(mapped);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  React.useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-primary mb-2">Property Approvals</h1>
          <p className="text-neutral-secondary">Review and approve properties submitted by owners.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20 text-neutral-secondary">
          Loading pending approvals...
        </div>
      ) : pendingRequests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingRequests.map(req => (
            <ApprovalCard key={req.id} request={req} onActionComplete={fetchRequests} />
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={CheckCircle}
          title="All caught up!"
          description="There are no properties pending approval at the moment."
        />
      )}
    </motion.div>
  );
};

export const Listings: React.FC = () => {
  const [listings, setListings] = React.useState<Listing[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    import('../../api/client').then(m => m.fetchPublicProperties())
      .then(res => {
        const mapped: Listing[] = (res.properties || []).map((p: any) => ({
          id: p.propertyCode || p._id.substring(0, 8),
          title: p.title || 'Untitled Property',
          price: `₹${(p.price || 0).toLocaleString('en-IN')}`,
          area: p.builtUpArea ? `${p.builtUpArea} sq.ft` : 'N/A',
          views: Math.floor(Math.random() * 2000), // Random metric for UI until supported
          interested: Math.floor(Math.random() * 50),
          status: p.status === 'PUBLISHED' ? 'Active' : 'Paused',
          imageUrl: p.images?.find((img: any) => img.isCover)?.imageUrl || p.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800'
        }));
        setListings(mapped);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-primary mb-2">Active Listings</h1>
          <p className="text-neutral-secondary">Manage all published properties across the platform.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-secondary" />
            <input type="text" placeholder="Search properties..." className="pl-9 pr-4 py-2 border border-neutral-border rounded-lg outline-none focus:border-primary text-sm" />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-neutral-secondary">Loading properties...</div>
      ) : listings.length > 0 ? (
        <ListingTable listings={listings} />
      ) : (
        <div className="py-20 text-center text-neutral-secondary bg-white rounded-2xl border border-neutral-border">No active listings found.</div>
      )}
    </motion.div>
  );
};

export const Leads: React.FC = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 flex flex-col h-[calc(100vh-100px)]">
      <div className="flex justify-between items-center flex-wrap gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-primary mb-2">Buyer Leads & Pipeline</h1>
          <p className="text-neutral-secondary">Manage interested buyers and track deal progress.</p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden min-h-0">
        <LeadPipeline />
      </div>
    </motion.div>
  );
};

export const Visits: React.FC = () => {
  const [visits, setVisits] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    import('../../api/client').then(({ fetchBrokerVisits }) => {
      fetchBrokerVisits()
        .then(setVisits)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    });
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const { updateVisitStatus } = await import('../../api/client');
      const updated = await updateVisitStatus(id, status);
      setVisits(visits.map(v => v._id === id ? updated : v));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-primary mb-2">Visit Requests</h1>
          <p className="text-neutral-secondary">Schedule and manage property viewings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <div>Loading visits...</div>
        ) : visits.length > 0 ? (
          visits.map(visit => (
            <div key={visit._id} className="bg-white border border-neutral-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-neutral-primary line-clamp-1">{visit.propertyId?.title || 'Unknown Property'}</h3>
                  <p className="text-xs text-neutral-secondary flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5" /> {visit.propertyId?.locality || 'Unknown Area'}
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-bold shrink-0 ${
                  visit.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                  visit.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                  visit.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {visit.status}
                </span>
              </div>

              <div className="bg-neutral-bg/50 rounded-xl p-3 mb-5 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <CalendarIcon className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-neutral-primary">{new Date(visit.scheduledDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-neutral-primary">{visit.scheduledTime || 'N/A'}</span>
                </div>
                <div className="col-span-2 flex items-center gap-2 text-sm border-t border-neutral-divider pt-3 mt-1">
                  <User className="w-4 h-4 text-neutral-secondary" />
                  <span className="text-neutral-secondary">Buyer:</span>
                  <span className="font-semibold text-neutral-primary">{visit.leadId?.buyerName || 'Unknown Buyer'}</span>
                </div>
              </div>

              <div className="flex gap-2">
                {visit.status === 'PENDING' && (
                  <>
                    <Button className="flex-1 h-9 text-xs justify-center" onClick={() => handleStatusChange(visit._id, 'CONFIRMED')}>Confirm</Button>
                    <Button variant="outline" className="flex-1 h-9 text-xs justify-center border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300" onClick={() => handleStatusChange(visit._id, 'CANCELLED')}>Cancel</Button>
                  </>
                )}
                {visit.status === 'CONFIRMED' && (
                  <>
                    <Button className="flex-1 h-9 text-xs justify-center bg-green-600 hover:bg-green-700 border-none" onClick={() => handleStatusChange(visit._id, 'COMPLETED')}>Mark Completed</Button>
                    <Button variant="outline" className="flex-1 h-9 text-xs justify-center">Reschedule</Button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div>No visit requests found.</div>
        )}
      </div>
    </motion.div>
  );
};

export const Contacts: React.FC = () => {
  const [contacts, setContacts] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    Promise.all([
      import('../../api/client').then(m => m.fetchBrokerLeads()),
      import('../../api/client').then(m => m.fetchPublicProperties())
    ]).then(([leads, propertiesRes]) => {
      const contactMap = new Map();

      // Process leads (Buyers)
      if (Array.isArray(leads)) {
        leads.forEach((lead: any) => {
          if (lead.buyerName && lead.buyerEmail) {
            contactMap.set(lead.buyerEmail, {
              id: lead._id,
              name: lead.buyerName,
              type: 'Buyer',
              email: lead.buyerEmail,
              phone: lead.buyerPhone || 'N/A',
              status: lead.status === 'NEW' || lead.status === 'CONTACTED' ? 'Active' : 'Inactive'
            });
          }
        });
      }

      // Process properties (Owners)
      const properties = propertiesRes.properties || [];
      properties.forEach((prop: any) => {
        if (prop.ownerId && prop.ownerId.email) {
          contactMap.set(prop.ownerId.email, {
            id: prop.ownerId._id,
            name: prop.ownerId.name || 'Unknown Owner',
            type: 'Owner',
            email: prop.ownerId.email,
            phone: prop.ownerId.phone || 'N/A',
            status: 'Active'
          });
        }
      });

      setContacts(Array.from(contactMap.values()));
    }).catch(console.error).finally(() => setIsLoading(false));
  }, []);

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-primary mb-2">Contacts</h1>
          <p className="text-neutral-secondary">Manage your network of buyers and owners.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-secondary" />
            <input 
              type="text" 
              placeholder="Search contacts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-neutral-border rounded-lg outline-none focus:border-primary text-sm" 
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-neutral-border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-neutral-bg border-b border-neutral-border text-sm text-neutral-secondary">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Contact Info</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-divider">
            {isLoading ? (
              <tr><td colSpan={5} className="py-20 text-center text-neutral-secondary">Loading contacts...</td></tr>
            ) : filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-neutral-bg/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-neutral-primary">{contact.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${contact.type === 'Owner' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                      {contact.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-y-1">
                    <div className="flex items-center gap-2 text-sm text-neutral-secondary">
                      <Mail className="w-3.5 h-3.5" /> {contact.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-secondary">
                      <Phone className="w-3.5 h-3.5" /> {contact.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${contact.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-neutral-bg text-neutral-secondary'}`}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-neutral-divider rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-neutral-secondary" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} className="py-20 text-center text-neutral-secondary">No contacts found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export const Calendar: React.FC = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-neutral-primary mb-2">Calendar</h1>
        <p className="text-neutral-secondary">Track your upcoming visits and important deadlines.</p>
      </div>
      
      <div className="bg-white p-8 rounded-2xl border border-neutral-border shadow-sm flex flex-col items-center justify-center min-h-[400px]">
        <CalendarIcon className="w-16 h-16 text-neutral-divider mb-4" />
        <h3 className="text-xl font-bold text-neutral-primary mb-2">Calendar View Coming Soon</h3>
        <p className="text-neutral-secondary text-center max-w-md">Integrate with Google Calendar or use our native scheduling system to manage all your property visits and client meetings efficiently.</p>
      </div>
    </motion.div>
  );
};

export const Analytics: React.FC = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-neutral-primary mb-2">Analytics Dashboard</h1>
        <p className="text-neutral-secondary">Track the performance of your brokerage operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm flex flex-col items-center justify-center min-h-[160px] text-center">
          <Users className="w-8 h-8 text-primary mb-2" />
          <h3 className="font-bold text-neutral-primary text-2xl">248</h3>
          <p className="text-sm text-neutral-secondary">Total Leads</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm flex flex-col items-center justify-center min-h-[160px] text-center">
          <Phone className="w-8 h-8 text-blue-500 mb-2" />
          <h3 className="font-bold text-neutral-primary text-2xl">185</h3>
          <p className="text-sm text-neutral-secondary">Contacted Leads</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm flex flex-col items-center justify-center min-h-[160px] text-center">
          <MapPin className="w-8 h-8 text-orange-500 mb-2" />
          <h3 className="font-bold text-neutral-primary text-2xl">42</h3>
          <p className="text-sm text-neutral-secondary">Visits Conducted</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm flex flex-col items-center justify-center min-h-[160px] text-center">
          <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
          <h3 className="font-bold text-neutral-primary text-2xl">14</h3>
          <p className="text-sm text-neutral-secondary">Deals Closed</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm flex flex-col items-center justify-center min-h-[300px]">
          <PieChart className="w-16 h-16 text-neutral-divider mb-4" />
          <h3 className="font-bold text-neutral-primary mb-1">Lead Conversion Funnel</h3>
          <p className="text-sm text-neutral-secondary text-center">Conversion rate currently at 5.6%</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm flex flex-col items-center justify-center min-h-[300px]">
          <TrendingUp className="w-16 h-16 text-neutral-divider mb-4" />
          <h3 className="font-bold text-neutral-primary mb-1">Commission Trends</h3>
          <p className="text-sm text-neutral-secondary text-center">Track your revenue growth over the past 12 months.</p>
        </div>
      </div>
    </motion.div>
  );
};

export const Commission: React.FC = () => {
  const [deals, setDeals] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    import('../../api/client').then(({ fetchBrokerDeals }) => {
      fetchBrokerDeals()
        .then(setDeals)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    });
  }, []);

  const totalEarned = deals.filter(d => d.status === 'COMPLETED').reduce((acc, d) => acc + (d.commissionAmount || 0), 0);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const { updateDealStatus } = await import('../../api/client');
      const updated = await updateDealStatus(id, status);
      setDeals(deals.map(d => d._id === id ? updated : d));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-primary mb-2">Deals & Commission Ledger</h1>
          <p className="text-neutral-secondary">Track your earnings and pending payouts.</p>
        </div>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-bold text-sm">
          Total Earned: ₹{totalEarned.toLocaleString('en-IN')}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-border overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-neutral-bg border-b border-neutral-border text-sm text-neutral-secondary">
            <tr>
              <th className="px-6 py-4 font-medium">Deal ID</th>
              <th className="px-6 py-4 font-medium">Property</th>
              <th className="px-6 py-4 font-medium">Final Price</th>
              <th className="px-6 py-4 font-medium">Commission Amount</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-divider">
            {isLoading ? (
              <tr><td colSpan={6} className="text-center py-4">Loading Deals...</td></tr>
            ) : deals.length > 0 ? (
              deals.map(deal => (
                <tr key={deal._id} className="hover:bg-neutral-bg/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-primary">{deal._id.substring(0, 8)}</td>
                  <td className="px-6 py-4 font-bold text-neutral-primary">{deal.propertyId?.title || 'Unknown Property'}</td>
                  <td className="px-6 py-4 text-neutral-secondary text-sm">₹{deal.finalPrice?.toLocaleString('en-IN') || 'N/A'}</td>
                  <td className="px-6 py-4 font-bold text-green-600">₹{deal.commissionAmount?.toLocaleString('en-IN') || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${deal.status === 'COMPLETED' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                      {deal.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {deal.status !== 'COMPLETED' && (
                      <button className="text-primary text-sm underline font-bold" onClick={() => handleStatusChange(deal._id, 'COMPLETED')}>
                        Mark Completed
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} className="text-center py-4">No deals found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export const Reports: React.FC = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-primary mb-2">Reports Center</h1>
          <p className="text-neutral-secondary">Generate and download performance reports.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Monthly Performance', 'Active Listings Summary', 'Lead Engagement'].map((report) => (
          <div key={report} className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm flex flex-col items-center text-center gap-4 group hover:border-primary transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-neutral-bg group-hover:bg-primary/10 rounded-full flex items-center justify-center transition-colors">
              <FileText className="w-6 h-6 text-neutral-secondary group-hover:text-primary transition-colors" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-primary">{report}</h3>
              <p className="text-xs text-neutral-secondary mt-1">PDF & CSV available</p>
            </div>
            <button className="flex items-center gap-2 text-sm font-bold text-primary mt-2">
              <Download className="w-4 h-4" /> Download
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
