import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  Bell,
  Settings,
  User,
  Plus
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const userStr = localStorage.getItem('user');
  let user: any = null;
  if (userStr) {
    try { user = JSON.parse(userStr); } catch (e) {}
  }
  const name = user?.name || 'Property Owner';
  const firstName = name.split(' ')[0];
  const initials = firstName.charAt(0).toUpperCase() + (name.split(' ')[1]?.[0]?.toUpperCase() || '');

  const navGroups = [
    {
      title: 'Overview',
      items: [
        { name: 'Dashboard', path: '/dashboard/owner', icon: LayoutDashboard, exact: true },
        { name: 'Analytics', path: '/dashboard/owner/analytics', icon: BarChart3 },
      ]
    },
    {
      title: 'My Properties',
      items: [
        { name: 'All Properties', path: '/dashboard/owner/properties', icon: Building2 },
        { name: 'Drafts', path: '/dashboard/owner/drafts', icon: FileText },
        { name: 'Pending Approval', path: '/dashboard/owner/pending', icon: Clock },
        { name: 'Published', path: '/dashboard/owner/published', icon: CheckCircle },
        { name: 'Rejected', path: '/dashboard/owner/rejected', icon: XCircle },
      ]
    },
    {
      title: 'Account',
      items: [
        { name: 'Notifications', path: '/dashboard/owner/notifications', icon: Bell },
        { name: 'Profile', path: '/dashboard/owner/profile', icon: User },
        { name: 'Settings', path: '/dashboard/owner/settings', icon: Settings },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-neutral-border h-full flex flex-col hidden md:flex shrink-0">
      <div className="p-6 border-b border-neutral-divider">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
          <div className="w-8 h-8 rounded-lg bg-primary text-secondary flex items-center justify-center text-xl">E</div>
          EstateX
        </Link>
      </div>

      <div className="p-4">
        <Link to="/add-property" className="block">
          <Button className="w-full justify-center gap-2 shadow-sm">
            <Plus className="w-4 h-4" /> Add Property
          </Button>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
        {navGroups.map((group, idx) => (
          <div key={group.title} className={cn("px-4 mb-6", idx !== 0 && "mt-2")}>
            <h3 className="text-xs font-bold text-neutral-secondary uppercase tracking-wider mb-3 px-2">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact 
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path);

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                      isActive 
                        ? "bg-primary text-white shadow-sm" 
                        : "text-neutral-primary hover:bg-neutral-bg hover:text-primary"
                    )}
                  >
                    <Icon className={cn(
                      "w-4 h-4 transition-colors",
                      isActive ? "text-white" : "text-neutral-secondary group-hover:text-primary"
                    )} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-neutral-divider bg-neutral-bg/30">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-neutral-primary truncate">{name}</p>
            <p className="text-xs text-neutral-secondary truncate">Property Owner</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
