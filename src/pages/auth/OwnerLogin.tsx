import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/Button';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const OwnerLogin: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let response: Response;
      if (isLogin) {
        response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
      } else {
        response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, password, role: 'PROPERTY_OWNER' }),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Store the JWT token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/dashboard/owner');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-bg flex">
      {/* Left Column - Image */}
      <div className="hidden lg:flex w-1/2 relative bg-primary items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1600" 
          alt="Luxury Property" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay"
        />
        <div className="relative z-10 p-12 text-white max-w-lg">
          <Building2 className="w-16 h-16 mb-8 text-secondary" />
          <h1 className="text-5xl font-display font-bold mb-6 leading-tight">
            Manage your properties with ease.
          </h1>
          <p className="text-xl text-white/80 leading-relaxed">
            Join thousands of property owners who trust EstateX to list, manage, and sell their premium real estate.
          </p>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white relative">
        <Link to="/" className="absolute top-8 left-8 sm:top-12 sm:left-12 text-primary font-bold font-display text-xl flex items-center gap-2">
          <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center text-sm">E</div>
          EstateX
        </Link>

        <div className="w-full max-w-md mt-16 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-display font-bold text-neutral-primary mb-2">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-neutral-secondary mb-8">
              {isLogin 
                ? 'Enter your details to access your owner dashboard.' 
                : 'Start listing your properties today.'}
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <label className="block text-sm font-bold text-neutral-primary mb-1.5">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-border focus:border-primary focus:bg-white bg-neutral-bg/50 outline-none transition-colors"
                    />
                    <label className="block text-sm font-bold text-neutral-primary mb-1.5 mt-4">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-border focus:border-primary focus:bg-white bg-neutral-bg/50 outline-none transition-colors"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-sm font-bold text-neutral-primary mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-border focus:border-primary focus:bg-white bg-neutral-bg/50 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-primary mb-1.5 flex justify-between">
                  Password
                  {isLogin && <Link to="/forgot-password" className="text-primary text-xs hover:underline">Forgot password?</Link>}
                </label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-border focus:border-primary focus:bg-white bg-neutral-bg/50 outline-none transition-colors"
                />
              </div>

              <Button type="submit" variant="primary" className="w-full py-4 text-lg mt-6" disabled={isLoading}>
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                ) : (
                  <>{isLogin ? 'Sign In' : 'Create Account'} <ArrowRight className="w-4 h-4" /></>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-neutral-secondary">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-primary font-bold hover:underline"
              >
                {isLogin ? 'Register now' : 'Log in'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
