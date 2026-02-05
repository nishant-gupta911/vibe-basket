import { useAuthStore } from '@/state/authStore';
import { authService, LoginData, RegisterData } from './authService';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { tokenManager } from '@/lib/api';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, setUser, setLoading, logout: logoutStore } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const register = async (data: RegisterData) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.register(data);
      
      if (response.success && response.data && response.data.user) {
        setUser(response.data.user);
        router.push('/profile');
        return response;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginData) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.login(data);
      
      if (response.success && response.data && response.data.user) {
        setUser(response.data.user);
        router.push('/profile');
        return response;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    logoutStore();
    router.push('/login');
  };

  const checkAuth = async () => {
    const token = tokenManager.getAccessToken();
    
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await authService.getProfile();
      
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      // Silently handle auth failures - user just isn't logged in
      setUser(null);
      tokenManager.clearTokens();
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    register,
    login,
    logout,
    checkAuth,
  };
};
