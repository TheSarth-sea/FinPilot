'use client';

import { create } from 'zustand';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

const demoUser: User = {
  id: 'usr_1a2b3c4d5e',
  name: 'Arjun Mehta',
  email: 'arjun@finpilot.in',
  avatar: undefined,
  createdAt: '2025-01-15T10:30:00Z',
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (_email: string, _password: string) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 1200));
    set({
      user: demoUser,
      token: 'demo_token_fp_' + Date.now(),
      isAuthenticated: true,
      isLoading: false,
    });
  },

  signup: async (name: string, email: string, _password: string) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    set({
      user: {
        ...demoUser,
        id: 'usr_' + Math.random().toString(36).slice(2, 12),
        name,
        email,
        createdAt: new Date().toISOString(),
      },
      token: 'demo_token_fp_' + Date.now(),
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  setUser: (user: User) => {
    set({ user });
  },
}));
