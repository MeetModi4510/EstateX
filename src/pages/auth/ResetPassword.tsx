import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Invalid or missing reset token');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to reset password');
      
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-neutral-bg flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-neutral-border text-center">
          <div className="text-red-500 mb-4 text-5xl">⚠️</div>
          <h1 className="text-xl font-bold mb-2">Invalid Link</h1>
          <p className="text-neutral-secondary mb-6">This password reset link is invalid or has expired.</p>
          <Button variant="outline" className="w-full" onClick={() => navigate('/forgot-password')}>
            Request New Link
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-neutral-border">
        {isSuccess ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-primary mb-2">Password Reset Successful</h2>
            <p className="text-neutral-secondary mb-6">
              Your password has been changed. You will be redirected to the login page momentarily.
            </p>
            <Button variant="primary" className="w-full" onClick={() => navigate('/login')}>
              Go to Login Now
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-neutral-primary mb-2">Set New Password</h1>
              <p className="text-neutral-secondary">
                Please enter your new password below.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-neutral-primary mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-secondary w-5 h-5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-neutral-primary mb-2">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-secondary w-5 h-5" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" className="w-full py-4 text-lg" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Reset Password'}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
