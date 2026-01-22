import { api } from '@/lib/api';
import { Cart, CartItem } from '@/state/cartStore';

export interface AddToCartData {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemData {
  productId: string;
  quantity: number;
}

export const cartService = {
  getCart: async () => {
    const response = await api.get<Cart>('/cart');
    return response;
  },

  addToCart: async (data: AddToCartData) => {
    const response = await api.post<Cart>('/cart', data);
    return response;
  },

  updateCartItem: async (itemId: string, quantity: number) => {
    const response = await api.patch<Cart>(`/cart/${itemId}`, { quantity });
    return response;
  },

  removeCartItem: async (itemId: string) => {
    const response = await api.delete<Cart>(`/cart/${itemId}`);
    return response;
  },

  clearCart: async () => {
    const response = await api.delete<void>('/cart');
    return response;
  },
};
