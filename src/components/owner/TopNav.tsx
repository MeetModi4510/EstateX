import React, { useState } from 'react';
import { Bell, Search, Menu, User, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

export const TopNav: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const navigate = useNavigate();

  const userStr = localStorage.getItem('user');
  let user: any = null;
  if (userStr) {
    try { user = JSON.parse(userStr); } catch (e) {}
  }
  const name = user?.name || 'Property Owner';
  const firstName = name.split(' ')[0];
  const initials = firstName.charAt(0).toUpperCase() + (name.split(' ')[1]?.[0]?.toUpperCase() || '');
  const email = user?.email || 'owner@example.com';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login/owner');
  };

  return (
    <header className="h-20 bg-white border-b border-neutral-border flex items-center justify-between px-4 md:px-8 shrink-0 relative z-40">
      <div className="flex items-center gap-4 flex-1">
        <button className="md:hidden p-2 text-neutral-secondary hover:text-primary transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="hidden md:flex items-center w-full max-w-md relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-secondary group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search properties, locations..." 
            className="w-full bg-neutral-bg border border-transparent focus:border-primary/30 focus:bg-white pl-12 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <div className="relative">
          <button 
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsProfileOpen(false);
            }}
            className="relative p-2 text-neutral-secondary hover:text-primary transition-colors rounded-full hover:bg-neutral-bg"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-neutral-divider overflow-hidden"
              >
                <div className="p-4 border-b border-neutral-divider flex justify-between items-center">
                  <h3 className="font-bold text-neutral-primary">Notifications</h3>
                  <button className="text-xs text-primary font-medium hover:underline">Mark all as read</button>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  <div className="p-4 border-b border-neutral-divider hover:bg-neutral-bg/50 transition-colors cursor-pointer opacity-50">
                    <p className="text-sm font-medium text-neutral-primary mb-1">Property Approved</p>
                    <p className="text-xs text-neutral-secondary">Your property "Sea View Penthouse" is now live.</p>
                  </div>
                  <div className="p-4 border-b border-neutral-divider hover:bg-neutral-bg/50 transition-colors cursor-pointer">
                    <p className="text-sm font-medium text-neutral-primary mb-1">Broker Requested Changes</p>
                    <p className="text-xs text-neutral-secondary">Update the images for "3BHK Villa" as requested.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-8 w-px bg-neutral-divider hidden sm:block"></div>

        <div className="relative">
          <button 
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotificationsOpen(false);
            }}
            className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-neutral-bg transition-colors border border-transparent hover:border-neutral-divider"
          >
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
              {initials}
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm font-bold text-neutral-primary">{firstName}</span>
              <ChevronDown className="w-4 h-4 text-neutral-secondary" />
            </div>
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-neutral-divider overflow-hidden py-2"
              >
                <div className="px-4 py-3 border-b border-neutral-divider">
                  <div className="font-bold text-neutral-primary">{name}</div>
                  <div className="text-xs text-neutral-secondary">{email}</div>
                </div>
                <div className="py-2">
                  <Link to="/dashboard/owner/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-primary hover:bg-neutral-bg transition-colors">
                    <User className="w-4 h-4 text-neutral-secondary" /> Profile
                  </Link>
                </div>
                <div className="px-2 pt-2 border-t border-neutral-divider">
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
