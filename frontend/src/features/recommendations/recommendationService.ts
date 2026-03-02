import { api } from '@/lib/api';
import { Product } from '@/types';

export const recommendationService = {
  related: async (productId: string, limit: number = 6) => {
    return api.get<{ products: Product[] }>(`/recommendations/related/${productId}?limit=${limit}`);
  },
  trending: async (limit: number = 6) => {
    return api.get<{ products: Product[] }>(`/recommendations/trending?limit=${limit}`);
  },
  frequentlyBought: async (productId: string, limit: number = 4) => {
    return api.get<{ products: Product[] }>(`/recommendations/frequently-bought/${productId}?limit=${limit}`);
  },
  recentlyViewed: async (limit: number = 6) => {
    return api.get<{ products: Product[] }>(`/recommendations/recently-viewed?limit=${limit}`);
  },
};
