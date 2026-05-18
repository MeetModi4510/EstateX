import React from 'react';
import { Search, Bell, Plus, Menu } from 'lucide-react';
import { Button } from '../ui/Button';

export const TopNav: React.FC = () => {
  const [userData, setUserData] = React.useState<any>(() => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  });

  React.useEffect(() => {
    const handleStorageChange = () => {
      const userStr = localStorage.getItem('user');
      setUserData(userStr ? JSON.parse(userStr) : null);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const name = userData?.name || 'Broker User';
  const role = userData?.brokerId ? `Broker ID: ${userData.brokerId}` : 'Senior Broker';
  const initials = name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <header className="h-[72px] bg-white border-b border-neutral-divider px-4 lg:px-8 flex items-center justify-between sticky top-0 z-40">
      
      {/* Mobile Menu Toggle (Placeholder) */}
      <div className="flex items-center gap-4 lg:hidden">
        <button className="text-neutral-primary">
          <Menu className="w-6 h-6" />
        </button>
        <span className="text-lg font-display font-bold text-neutral-primary">Estate<span className="text-primary">X</span></span>
      </div>

      {/* Search */}
      <div className="hidden lg:flex flex-1 max-w-md">
        <div className="relative w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-secondary group-focus-within:text-primary transition-colors" />
          <input 
            type="text"
            placeholder="Search properties, leads, or contacts..."
            className="w-full bg-neutral-bg pl-10 pr-4 py-2 rounded-full border border-transparent focus:border-primary focus:bg-white outline-none text-sm transition-all shadow-sm focus:shadow-md"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-auto">
        <Button variant="outline" size="sm" className="hidden md:flex rounded-full gap-2 font-medium">
          <Plus className="w-4 h-4" /> Add Property
        </Button>
        
        <div className="h-6 w-px bg-neutral-divider mx-2 hidden md:block"></div>
        
        <button className="relative p-2 text-neutral-secondary hover:text-primary transition-colors rounded-full hover:bg-neutral-bg">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <button className="flex items-center gap-3 p-1 rounded-full hover:bg-neutral-bg transition-colors">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/20">
            {initials}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-bold text-neutral-primary leading-tight">{name}</div>
            <div className="text-[10px] font-medium text-neutral-secondary leading-tight">{role}</div>
          </div>
        </button>
      </div>
    </header>
  );
};
