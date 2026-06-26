"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    // Check if we actually have a session (the reset link auto-logs the user in temporarily)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setErrorMsg("Your reset link is invalid or has expired. Please request a new one.");
      }
    };
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }
    
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        throw new Error(error.message);
      }
      
      setSuccess(true);
      
      // Update public.users table as well since we store it there (legacy sync)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('users').update({ password }).eq('id', user.id);
      }
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-beige flex items-center justify-center overflow-hidden px-4 py-12">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-gold/5 blur-[120px]" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-gold/5 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[420px]"
      >
        <div className="relative bg-white/80 backdrop-blur-2xl border border-gold/20 rounded-3xl shadow-2xl p-8 sm:p-10">
          <div className="text-center space-y-5 mb-8">
            <h1 className="font-heading text-2xl font-bold">
              Update Password
            </h1>
            <p className="text-xs text-gray-500">
              Please enter your new password below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-heading font-bold text-gray-500 uppercase tracking-wider">
                New Password <span className="text-gold">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input !pl-11 !pr-10 h-12 w-full"
                  required
                />
                <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-heading font-bold text-gray-500 uppercase tracking-wider">
                Confirm Password <span className="text-gold">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input !pl-11 !pr-10 h-12 w-full"
                  required
                />
                <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {errorMsg && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-red-500 font-semibold bg-red-50 border border-red-100 rounded-xl px-4 py-2.5"
                >
                  {errorMsg}
                </motion.p>
              )}
              {success && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-green-600 font-semibold bg-green-50 border border-green-100 rounded-xl px-4 py-2.5"
                >
                  Password updated successfully! Redirecting...
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading || success || !!errorMsg.includes('invalid')}
              className="relative w-full h-12 mt-2 bg-gold text-black font-heading font-bold text-xs uppercase tracking-wider rounded-xl overflow-hidden transition-all duration-300 hover:bg-gold-600 hover:shadow-lg hover:shadow-gold/25 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    Update Password <ArrowRight size={16} />
                  </>
                )}
              </span>
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
