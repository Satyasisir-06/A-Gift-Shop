"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<User>;
  register: (email: string, name: string, phone: string, password?: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      // Restore secure session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        setUser({
          id: session.user.id,
          name: profile?.name || session.user.user_metadata?.name || 'Customer',
          email: session.user.email || '',
          phone: profile?.phone || session.user.user_metadata?.phone || '',
          role: profile?.role || 'customer'
        });
      }
      setLoading(false);
      
      const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setUser({
            id: session.user.id,
            name: profile?.name || session.user.user_metadata?.name || 'Customer',
            email: session.user.email || '',
            phone: profile?.phone || session.user.user_metadata?.phone || '',
            role: profile?.role || 'customer'
          });
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      });

      return () => {
        listener.subscription.unsubscribe();
      };
    };

    initAuth();
  }, []);

  const login = async (email: string, password?: string): Promise<User> => {
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: password || 'password123', // Fallback for legacy calls
      });

      if (authError || !authData.user) {
        throw new Error(authError?.message || "Invalid email or password");
      }

      // Fetch the linked profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      const loggedUser: User = {
        id: authData.user.id,
        name: profile?.name || authData.user.user_metadata?.name || 'Customer',
        email: authData.user.email || email,
        phone: profile?.phone || authData.user.user_metadata?.phone || '',
        role: profile?.role || 'customer'
      };

      setUser(loggedUser);
      setLoading(false);
      return loggedUser;
    } catch (err: any) {
      setLoading(false);
      throw err;
    }
  };

  const register = async (email: string, name: string, phone: string, password?: string): Promise<User> => {
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password: password || 'password123',
        options: {
          data: {
            name: name,
            phone: phone
          }
        }
      });

      if (authError) {
        throw new Error(authError.message);
      }
      
      if (!authData.user) {
         throw new Error("Registration failed.");
      }

      const newUser: User = {
        id: authData.user.id,
        name: name,
        email: email,
        phone: phone || '',
        role: 'customer'
      };

      // Only set user if session exists (email confirmation disabled)
      if (authData.session) {
        setUser(newUser);
      }
      
      setLoading(false);
      return newUser;
    } catch (err: any) {
      setLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
