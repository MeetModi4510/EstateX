import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@estatex.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: 'ADMIN' }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Login failed');

      if (data.user.role !== 'ADMIN') throw new Error('Unauthorized access');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold font-display text-xl">E</span>
            </div>
            <span className="font-display font-bold text-2xl text-neutral-primary">EstateX</span>
          </Link>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h1 className="text-3xl font-display font-bold text-neutral-primary mb-2">Super Admin</h1>
          <p className="text-neutral-secondary">Restricted access area.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl border border-neutral-border shadow-sm"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-neutral-primary mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-secondary" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-bg border border-neutral-border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="admin@estatex.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-primary mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-secondary" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-bg border border-neutral-border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button type="submit" className="w-full py-4 text-base" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> Authenticating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Access Dashboard <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
