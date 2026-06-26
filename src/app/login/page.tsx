"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, User, Phone, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const { user, login, register } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('register') === 'true') {
        setIsSignUp(true);
      }
    }
  }, []);

  const handleRedirect = (role: string) => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const redirectUrl = urlParams.get('redirect');
      if (redirectUrl) {
        router.push(redirectUrl);
        return;
      }
    }
    router.push(role === 'admin' ? '/admin' : '/dashboard');
  };

  useEffect(() => {
    if (user) {
      handleRedirect(user.role);
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || (!isForgotPassword && !password)) {
      setErrorMsg(isForgotPassword ? "Email is required." : "Email and password are required.");
      return;
    }
    setLoading(true);
    try {
        if (isForgotPassword) {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/update-password`,
          });
          if (error) throw new Error(error.message);
          setErrorMsg("Password reset link sent! Check your email.");
          return;
        }

        if (isSignUp) {
          if (!name) {
          setErrorMsg("Name is required for registration.");
          setLoading(false);
          return;
        }
        const loggedUser = await register(email, name, phone, password);
        handleRedirect(loggedUser.role);
      } else {
        const loggedUser = await login(email, password);
        handleRedirect(loggedUser.role);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Authentication failed. Make sure you registered or created the database tables.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-beige flex items-center justify-center overflow-hidden px-4 py-12">
      {/* ============================================ */}
      {/* Decorative Background */}
      {/* ============================================ */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radial glow - top right */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-gold/5 blur-[120px]" />
        {/* Radial glow - bottom left */}
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-gold/5 blur-[100px]" />

        {/* Decorative geometric arcs */}
        <svg className="absolute top-0 left-0 w-48 h-48 text-gold/[0.06]" viewBox="0 0 200 200" fill="none">
          <path d="M0 0 L0 200 M0 0 L200 0" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="0" cy="0" r="40" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="0" cy="0" r="80" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
        </svg>
        <svg className="absolute bottom-0 right-0 w-64 h-64 text-gold/[0.06]" viewBox="0 0 200 200" fill="none">
          <path d="M200 200 L200 0 M200 200 L0 200" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="200" cy="200" r="40" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="200" cy="200" r="80" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
        </svg>

        {/* Scattered decorative dots */}
        <div className="absolute top-1/4 right-1/4 w-1.5 h-1.5 rounded-full bg-gold/20" />
        <div className="absolute bottom-1/3 left-1/4 w-2 h-2 rounded-full bg-gold/15" />
        <div className="absolute top-[40%] left-[15%] w-1 h-1 rounded-full bg-gold/25" />
        <div className="absolute bottom-[30%] right-[20%] w-1.5 h-1.5 rounded-full bg-gold/20" />
        <div className="absolute top-[20%] left-[60%] w-1 h-1 rounded-full bg-gold/15" />
      </div>

      {/* ============================================ */}
      {/* Glass Card */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[420px]"
      >
        <div className="relative bg-white/80 backdrop-blur-2xl border border-gold/20 rounded-3xl shadow-2xl p-8 sm:p-10">
          {/* ============================================ */}
          {/* Brand Section */}
          {/* ============================================ */}
          <div className="text-center space-y-5 mb-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative inline-block">
                <div className="absolute inset-0 rounded-full bg-gold/20 blur-xl scale-150" />
                <img
                  src="/logo.png"
                  alt="A Gift Story"
                  className="relative h-20 w-20 rounded-full object-contain border-2 border-gold/30 mx-auto shadow-lg"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
            >
              <h1 className="font-heading text-2xl sm:text-3xl font-bold">
                <span className="text-gold-gradient">A Gift Story</span>
              </h1>
              <div className="w-10 h-0.5 bg-gold mx-auto mt-3 mb-2" />
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">
                Patron Access
              </p>
            </motion.div>
          </div>

          {/* ============================================ */}
          {/* Tab Toggle */}
          {/* ============================================ */}

          {!isForgotPassword && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex bg-gray-100/80 rounded-xl p-1 mb-6"
            >
              <button
                type="button"
                onClick={() => { setIsSignUp(false); setErrorMsg(''); }}
                className={`relative flex-1 py-2.5 text-xs font-heading font-bold uppercase tracking-wider rounded-lg transition-all duration-300 ${
                  !isSignUp
                    ? 'text-black shadow-sm bg-white'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <span className="relative z-10">Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => { setIsSignUp(true); setErrorMsg(''); }}
                className={`relative flex-1 py-2.5 text-xs font-heading font-bold uppercase tracking-wider rounded-lg transition-all duration-300 ${
                  isSignUp
                    ? 'text-black shadow-sm bg-white'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <span className="relative z-10">Register</span>
              </button>
            </motion.div>
          )}

          {/* ============================================ */}
          {/* Form */}
          {/* ============================================ */}
          <AnimatePresence mode="wait">
            <motion.form
              key={isForgotPassword ? 'forgot' : isSignUp ? 'register' : 'signin'}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {isForgotPassword && (
                <div className="text-center mb-6">
                  <p className="text-xs text-gray-500 font-medium px-4">
                    Enter your email address and we'll send you a secure link to reset your password.
                  </p>
                </div>
              )}

              {!isForgotPassword && isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-heading font-bold text-gray-500 uppercase tracking-wider">
                      Name <span className="text-gold">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        className="input !pl-11 h-12"
                        required
                      />
                      <User size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-heading font-bold text-gray-500 uppercase tracking-wider">
                      Phone
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 72079 32026"
                        className="input !pl-11 h-12"
                      />
                      <Phone size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="space-y-1.5">
                <label className="block text-[11px] font-heading font-bold text-gray-500 uppercase tracking-wider">
                  Email <span className="text-gold">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="input !pl-11 h-12"
                    required
                  />
                  <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {!isForgotPassword && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-heading font-bold text-gray-500 uppercase tracking-wider">
                      Password <span className="text-gold">*</span>
                    </label>
                    {!isSignUp && (
                      <button 
                        type="button"
                        onClick={() => { setIsForgotPassword(true); setErrorMsg(''); }}
                        className="text-[10px] font-semibold text-gold hover:text-gold-600 transition-colors"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input !pl-11 !pr-10 h-12"
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
              )}

              {/* Error/Success Message */}
              <AnimatePresence>
                {errorMsg && (
                  <motion.p
                    initial={{ opacity: 0, y: -6, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -6, height: 0 }}
                    className={`text-xs font-semibold border rounded-xl px-4 py-2.5 leading-relaxed ${
                      errorMsg.includes('sent') 
                        ? 'text-green-600 bg-green-50/80 border-green-100' 
                        : 'text-red-500 bg-red-50/80 border-red-100'
                    }`}
                  >
                    {errorMsg}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="relative w-full h-12 bg-gold text-black font-heading font-bold text-xs uppercase tracking-wider rounded-xl overflow-hidden transition-all duration-300 hover:bg-gold-600 hover:shadow-lg hover:shadow-gold/25 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      {isSignUp ? 'Registering...' : 'Signing In...'}
                    </>
                  ) : (
                    <>
                      {isForgotPassword ? 'Send Reset Link' : isSignUp ? 'Create Account' : 'Sign In'}
                      {isForgotPassword ? null : <ArrowRight size={16} />}
                    </>
                  )}
                </span>
              </button>

              {isForgotPassword && (
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => { setIsForgotPassword(false); setErrorMsg(''); }}
                    className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors inline-flex items-center gap-1.5"
                  >
                    <ArrowLeft size={14} /> Back to Sign In
                  </button>
                </div>
              )}
            </motion.form>
          </AnimatePresence>
        </div>

        {/* ============================================ */}
        {/* Footer */}
        {/* ============================================ */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="text-center text-[10px] text-gray-300 mt-6 tracking-wider"
        >
          &copy; {new Date().getFullYear()} A Gift Story. All rights reserved.
        </motion.p>
      </motion.div>
    </div>
  );
}
