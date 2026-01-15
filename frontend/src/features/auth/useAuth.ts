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
      setUser(response.data.user);
      router.push('/products');
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
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
      setUser(response.data.user);
      router.push('/products');
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed';
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
    try {
      const token = tokenManager.getAccessToken();
      if (!token) {
        setUser(null);
        return;
      }

      setLoading(true);
      const response = await authService.getProfile();
      setUser(response.data);
    } catch (err) {
      setUser(null);
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
