import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Building2, List, Users, Calendar, 
  BarChart3, Wallet, FileText, Bell, User, Settings, LogOut, CheckCircle, MapPin
} from 'lucide-react';
import { cn } from '../../utils/cn';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [counts, setCounts] = React.useState({ pending: 0, leads: 0, notifications: 0 });

  React.useEffect(() => {
    Promise.all([
      import('../../api/client').then(m => m.fetchBrokerPendingProperties().catch(() => [])),
      import('../../api/client').then(m => m.fetchBrokerLeads().catch(() => [])),
      import('../../api/client').then(m => m.fetchBrokerNotifications().catch(() => []))
    ]).then(([pending, leads, notifications]) => {
      setCounts({
        pending: pending?.length || 0,
        leads: leads?.length || 0,
        notifications: notifications?.filter((n: any) => !n.isRead)?.length || 0
      });
    }).catch(console.error);
  }, []);

  const MAIN_NAV = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Approvals', path: '/dashboard/approvals', icon: CheckCircle, badge: counts.pending > 0 ? counts.pending : undefined },
    { name: 'Active Listings', path: '/dashboard/listings', icon: Building2 },
  ];

  const CRM_NAV = [
    { name: 'Buyer Leads', path: '/dashboard/leads', icon: Users, badge: counts.leads > 0 ? counts.leads : undefined },
    { name: 'Visits & Requests', path: '/dashboard/visits', icon: MapPin },
    { name: 'Contacts', path: '/dashboard/contacts', icon: User },
  ];

  const BUSINESS_NAV = [
    { name: 'Calendar', path: '/dashboard/calendar', icon: Calendar },
    { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Commission', path: '/dashboard/commission', icon: Wallet },
    { name: 'Reports', path: '/dashboard/reports', icon: FileText },
  ];

  const ACCOUNT_NAV = [
    { name: 'Notifications', path: '/dashboard/notifications', icon: Bell, badge: counts.notifications > 0 ? counts.notifications : undefined },
    { name: 'Profile', path: '/dashboard/profile', icon: User },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem('estatex_broker_auth');
    navigate('/login/broker');
  };

  const renderNavSection = (title: string, items: any[]) => (
    <div className="mb-6">
      <h3 className="px-4 text-xs font-bold text-neutral-secondary uppercase tracking-wider mb-2">{title}</h3>
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors font-medium text-sm",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-neutral-primary hover:bg-neutral-bg hover:text-primary"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-neutral-secondary")} />
                {item.name}
              </div>
              {item.badge && (
                <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className="w-64 bg-white border-r border-neutral-divider flex flex-col h-screen sticky top-0 hidden lg:flex">
      {/* Brand */}
      <div className="h-[72px] flex items-center px-6 border-b border-neutral-divider">
        <NavLink to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-all shadow-sm">
            <span className="font-bold font-display text-sm">E</span>
          </div>
          <span className="text-lg font-display font-bold text-neutral-primary tracking-tight">Estate<span className="text-primary">X</span></span>
        </NavLink>
      </div>

      {/* Nav Content */}
      <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
        {renderNavSection('Workspace', MAIN_NAV)}
        {renderNavSection('CRM', CRM_NAV)}
        {renderNavSection('Business', BUSINESS_NAV)}
        {renderNavSection('Account', ACCOUNT_NAV)}
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-neutral-divider">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 w-full text-left rounded-lg text-neutral-primary hover:bg-red-50 hover:text-red-600 transition-colors font-medium text-sm"
        >
          <LogOut className="w-5 h-5 text-neutral-secondary" />
          Log out
        </button>
      </div>
    </aside>
  );
};
