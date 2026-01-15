import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: (email: string, _password: string) => {
        // Mock login - in production, this would call an API
        const mockUser: User = {
          id: '1',
          name: email.split('@')[0],
          email: email,
        };
        
        set({ user: mockUser, isAuthenticated: true });
        return true;
      },
      
      register: (name: string, email: string, _password: string) => {
        // Mock registration - in production, this would call an API
        const mockUser: User = {
          id: '1',
          name: name,
          email: email,
        };
        
        set({ user: mockUser, isAuthenticated: true });
        return true;
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
