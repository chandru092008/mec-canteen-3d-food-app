'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, getStoredAuth, setStoredAuth, clearAuth } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

interface SignupData {
  email: string;
  password: string;
  fullName: string;
  studentId?: string;
  phone?: string;
  role: 'student' | 'admin';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredAuth();
    setUser(stored);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = true) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        // Only persist to localStorage if rememberMe is true
        if (rememberMe) {
          setStoredAuth(data.user);
        }
        return { success: true };
      }

      return { success: false, error: data.error || 'Login failed' };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const signup = async (signupData: SignupData) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        setStoredAuth(data.user); // Always remember for new signups
        return { success: true };
      }

      return { success: false, error: data.error || 'Signup failed' };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    setUser(null);
    clearAuth();
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}