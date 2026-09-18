import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';

import { brokerLogin } from '../../api/client';

export const BrokerLogin: React.FC = () => {
  const navigate = useNavigate();
  const [brokerId, setBrokerId] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Send the exact ID they typed
      const data = await brokerLogin({ brokerId, password });
      
      // Store real auth token and user
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('estatex_broker_auth', 'true');
      
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid Broker ID or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-bg flex">
      {/* Left Column - Image */}
      <div className="hidden lg:flex w-1/2 relative bg-primary items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1600" 
          alt="Broker Office" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay grayscale"
        />
        <div className="relative z-10 p-12 text-white max-w-lg text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-white/10 rounded-2xl backdrop-blur-sm flex items-center justify-center mb-8 border border-white/20">
            <Shield className="w-10 h-10 text-secondary" />
          </div>
          <h1 className="text-4xl font-display font-bold mb-4 leading-tight">
            Broker Portal
          </h1>
          <p className="text-lg text-white/70 leading-relaxed">
            Secure access to the central property management and CRM system.
          </p>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white relative">
        <Link to="/" className="absolute top-8 left-8 sm:top-12 sm:left-12 text-primary font-bold font-display text-xl flex items-center gap-2">
          <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center text-sm">E</div>
          EstateX
        </Link>

        <div className="w-full max-w-sm mt-16 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">Authorized Personnel Only</span>
              <h2 className="text-3xl font-display font-bold text-neutral-primary mb-2">
                Broker Login
              </h2>
              <p className="text-neutral-secondary text-sm">
                Please enter your assigned Broker ID and password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-bold text-neutral-primary mb-1.5">Broker ID</label>
                <div className="relative">
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. BRK-1001"
                    value={brokerId}
                    onChange={(e) => setBrokerId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-border focus:border-primary focus:bg-white bg-neutral-bg/50 outline-none transition-colors font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-primary mb-1.5 flex justify-between">
                  Password
                  <Link to="/forgot-password" className="text-primary text-xs hover:underline">Forgot password?</Link>
                </label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-border focus:border-primary focus:bg-white bg-neutral-bg/50 outline-none transition-colors"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full justify-center gap-2 py-3.5 text-base mt-4 shadow-md">
                {loading ? 'Authenticating...' : (
                  <>Access Portal <ArrowRight className="w-4 h-4" /></>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
