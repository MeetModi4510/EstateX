import React from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Home, Users, UserCog, Inbox, Calendar, FileText, PieChart, Bell, Settings, LogOut, ShieldCheck, User } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Home, label: 'Properties', path: '/admin/properties' },
    { icon: ShieldCheck, label: 'Approvals', path: '/admin/approvals' },
    { icon: UserCog, label: 'Brokers', path: '/admin/brokers' },
    { icon: Users, label: 'Property Owners', path: '/admin/property-owners' },
    { icon: Inbox, label: 'Leads', path: '/admin/leads' },
    { icon: Calendar, label: 'Visits', path: '/admin/visits' },
    { icon: FileText, label: 'Deals', path: '/admin/deals' },
    { icon: PieChart, label: 'Analytics', path: '/admin/analytics' },
    { icon: Bell, label: 'Notifications', path: '/admin/notifications' },
    { icon: FileText, label: 'Activity Logs', path: '/admin/activity-logs' },
  ];

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="min-h-screen bg-neutral-bg flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-border flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-neutral-border flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold font-display text-lg">E</span>
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-neutral-primary">EstateX</h1>
            <p className="text-[10px] uppercase tracking-widest text-primary font-bold">Super Admin</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive || (location.pathname === '/admin' && item.path === '/admin/dashboard')
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-neutral-secondary hover:bg-neutral-bg hover:text-neutral-primary'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-neutral-border space-y-1">
          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                isActive
                  ? 'bg-neutral-bg text-primary'
                  : 'text-neutral-secondary hover:bg-neutral-bg hover:text-neutral-primary'
              }`
            }
          >
            <Settings className="w-5 h-5" />
            Settings
          </NavLink>
          <NavLink
            to="/admin/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                isActive
                  ? 'bg-neutral-bg text-primary'
                  : 'text-neutral-secondary hover:bg-neutral-bg hover:text-neutral-primary'
              }`
            }
          >
            <User className="w-5 h-5" />
            Profile
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-red-500 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="h-20 bg-white border-b border-neutral-border flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-neutral-primary">Admin Control Center</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-neutral-primary">{user.name || 'System Admin'}</p>
              <p className="text-xs text-neutral-secondary">{user.email || 'admin@estatex.com'}</p>
            </div>
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold border border-primary/20">
              {(user.name || 'S')[0].toUpperCase()}
            </div>
          </div>
        </header>

        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
