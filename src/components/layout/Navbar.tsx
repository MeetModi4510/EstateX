import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, User, Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const location = useLocation();

  // Basic UI-only auth state
  const isBrokerLoggedIn = localStorage.getItem('estatex_broker_auth') === 'true';
  const ownerStr = localStorage.getItem('user');
  let ownerUser: any = null;
  if (ownerStr) {
    try {
      ownerUser = JSON.parse(ownerStr);
    } catch (e) {}
  }
  const isOwnerLoggedIn = !!ownerUser;
  const isLoggedIn = isBrokerLoggedIn || isOwnerLoggedIn;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/search' },
    { name: 'Sell', path: '/login/owner' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path.includes('?')) {
      const [p, s] = path.split('?');
      return location.pathname === p && location.search.includes(s);
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
          isScrolled ? 'bg-white/80 backdrop-blur-md shadow-soft py-3' : 'bg-transparent py-5'
        )}
      >
        <div className="container-custom flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
            <span className="w-8 h-8 rounded-lg bg-primary text-secondary flex-center text-xl">E</span>
            EstateX
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "relative px-4 py-2 rounded-full font-medium transition-colors",
                    active ? "text-primary" : "text-neutral-primary hover:text-primary hover:bg-neutral-bg/50"
                  )}
                >
                  <span className="relative z-10">{link.name}</span>
                  {active && (
                    <motion.div
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 bg-primary/10 rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center relative">
            <button 
              onClick={() => setIsProfileModalOpen(!isProfileModalOpen)}
              className="p-2 text-neutral-secondary hover:text-primary transition-colors rounded-full hover:bg-neutral-bg flex items-center gap-2"
            >
              {isLoggedIn ? (
                <div className="w-8 h-8 rounded-full overflow-hidden border border-neutral-divider flex items-center justify-center bg-primary/10 text-primary font-bold">
                  {isOwnerLoggedIn && ownerUser?.name ? ownerUser.name.charAt(0).toUpperCase() : (isBrokerLoggedIn ? 'A' : 'U')}
                </div>
              ) : (
                <User className="w-6 h-6" />
              )}
            </button>

            {/* Profile Dropdown / Modal */}
            <AnimatePresence>
              {isProfileModalOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-12 right-0 w-64 bg-white rounded-2xl shadow-xl border border-neutral-divider overflow-hidden flex flex-col py-2"
                >
                  {isLoggedIn ? (
                    <>
                      <div className="px-4 py-3 border-b border-neutral-divider">
                        <div className="font-bold text-neutral-primary">
                          {isOwnerLoggedIn ? (ownerUser?.name || 'Owner User') : 'Arjun Sharma'}
                        </div>
                        <div className="text-xs text-neutral-secondary">
                          {isOwnerLoggedIn ? 'Property Owner' : 'Senior Broker'}
                        </div>
                      </div>
                      <div className="flex flex-col py-2">
                        <Link to={isOwnerLoggedIn ? "/dashboard/owner/profile" : "/dashboard/profile"} className="px-4 py-2 text-sm font-medium text-neutral-primary hover:bg-neutral-bg hover:text-primary transition-colors">Profile</Link>
                        <Link to={isOwnerLoggedIn ? "/dashboard/owner/settings" : "/dashboard/settings"} className="px-4 py-2 text-sm font-medium text-neutral-primary hover:bg-neutral-bg hover:text-primary transition-colors">Settings</Link>
                        <Link to={isOwnerLoggedIn ? "/dashboard/owner/notifications" : "/dashboard/notifications"} className="px-4 py-2 text-sm font-medium text-neutral-primary hover:bg-neutral-bg hover:text-primary transition-colors">Notifications</Link>
                        <Link to={isOwnerLoggedIn ? "/dashboard/owner" : "/dashboard"} className="px-4 py-2 text-sm font-bold text-primary hover:bg-primary/5 transition-colors">
                          Open {isOwnerLoggedIn ? 'Owner' : 'Broker'} Dashboard
                        </Link>
                      </div>
                      <div className="px-2 pt-2 border-t border-neutral-divider">
                        <button 
                          onClick={() => {
                            localStorage.removeItem('estatex_broker_auth');
                            localStorage.removeItem('user');
                            window.location.reload();
                          }}
                          className="w-full text-left px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-4 space-y-3">
                      <div className="mb-4">
                        <h4 className="font-bold text-neutral-primary mb-1">Welcome back</h4>
                        <p className="text-xs text-neutral-secondary">Log in to manage your account.</p>
                      </div>
                      <Link to="/login/owner" className="block" onClick={() => setIsProfileModalOpen(false)}>
                        <Button className="w-full justify-center">Property Owner Login</Button>
                      </Link>
                      <Link to="/login/broker" className="block" onClick={() => setIsProfileModalOpen(false)}>
                        <Button variant="outline" className="w-full justify-center">Broker Login</Button>
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-neutral-primary"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm md:hidden"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-3/4 max-w-sm bg-white shadow-2xl flex flex-col"
            >
              <div className="p-5 flex justify-between items-center border-b border-neutral-divider">
                <span className="text-xl font-bold text-primary">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6 text-neutral-secondary" />
                </button>
              </div>
              
              <div className="flex flex-col p-5 gap-2 overflow-y-auto flex-1 mt-4">
                {navLinks.map((link) => {
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={cn(
                        "text-lg font-medium py-3 px-4 rounded-2xl transition-colors",
                        active ? "bg-primary/10 text-primary" : "text-neutral-primary hover:bg-neutral-bg"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
              
              <div className="p-5 border-t border-neutral-divider flex flex-col gap-3">
                <Link to="/login/owner" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full justify-center">Property Owner Login</Button>
                </Link>
                <Link to="/login/broker" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center">Broker Login</Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
