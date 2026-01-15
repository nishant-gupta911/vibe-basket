import { api, tokenManager } from '@/lib/api';
import { User } from '@/state/authStore';

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  register: async (data: RegisterData) => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    if (response.success) {
      tokenManager.setTokens(response.data.accessToken, response.data.refreshToken);
    }
    return response;
  },

  login: async (data: LoginData) => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    if (response.success) {
      tokenManager.setTokens(response.data.accessToken, response.data.refreshToken);
    }
    return response;
  },

  logout: () => {
    tokenManager.clearTokens();
  },

  getProfile: async () => {
    const response = await api.get<User>('/auth/profile');
    return response;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await api.post<{ accessToken: string; refreshToken: string }>(
      '/auth/refresh',
      { refreshToken }
    );
    if (response.success) {
      tokenManager.setTokens(response.data.accessToken, response.data.refreshToken);
    }
    return response;
  },
};
