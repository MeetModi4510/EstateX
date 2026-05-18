import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send reset link');
      
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-neutral-border">
        <Link to="/login" className="inline-flex items-center text-sm font-medium text-neutral-secondary hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
        </Link>
        
        {isSuccess ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-primary mb-2">Check your email</h2>
            <p className="text-neutral-secondary">
              We've sent a password reset link to <span className="font-semibold text-neutral-primary">{email}</span>.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-neutral-primary mb-2">Forgot Password</h1>
              <p className="text-neutral-secondary">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-neutral-primary mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-secondary w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" className="w-full py-4 text-lg" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Send Reset Link'}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
