import { api } from '@/lib/api';
import { Product } from '@/types';

export const wishlistService = {
  getWishlist: async () => {
    return api.get<Product[]>('/wishlist');
  },
  addToWishlist: async (productId: string) => {
    return api.post<{ productId: string }>(`/wishlist/${productId}`);
  },
  removeFromWishlist: async (productId: string) => {
    return api.delete<{ productId: string }>(`/wishlist/${productId}`);
  },
};
