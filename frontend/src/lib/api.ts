import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Token management
export const tokenManager = {
  getAccessToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  },
  getRefreshToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
  },
  setTokens: (accessToken: string, refreshToken: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },
  clearTokens: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add access token to headers
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Don't log 401 errors on auth endpoints - they're expected when not logged in
    const isAuthEndpoint = error.config?.url?.includes('/auth/');
    if (!isAuthEndpoint || error.response?.status !== 401) {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }
    
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenManager.getRefreshToken();

      if (!refreshToken) {
        tokenManager.clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      try {
        // Call refresh endpoint
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        tokenManager.setTokens(accessToken, newRefreshToken);

        processQueue(null, accessToken);
        isRefreshing = false;

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        isRefreshing = false;
        tokenManager.clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API Response type
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
}

// Generic API methods
export const api = {
  get: async <T = any>(url: string, config = {}) => {
    const response = await apiClient.get<ApiResponse<T>>(url, config);
    return response.data;
  },
  post: async <T = any>(url: string, data?: any, config = {}) => {
    const response = await apiClient.post<ApiResponse<T>>(url, data, config);
    return response.data;
  },
  patch: async <T = any>(url: string, data?: any, config = {}) => {
    const response = await apiClient.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  },
  delete: async <T = any>(url: string, config = {}) => {
    const response = await apiClient.delete<ApiResponse<T>>(url, config);
    return response.data;
  },
};

export default apiClient;
