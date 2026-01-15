import { api } from '@/lib/api';
import { Cart, CartItem } from '@/state/cartStore';

export interface AddToCartData {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemData {
  productId: number;
  quantity: number;
}

export const cartService = {
  getCart: async () => {
    const response = await api.get<Cart>('/cart');
    return response;
  },

  addToCart: async (data: AddToCartData) => {
    const response = await api.post<Cart>('/cart/items', data);
    return response;
  },

  updateCartItem: async (itemId: number, quantity: number) => {
    const response = await api.patch<Cart>(`/cart/items/${itemId}`, { quantity });
    return response;
  },

  removeCartItem: async (itemId: number) => {
    const response = await api.delete<Cart>(`/cart/items/${itemId}`);
    return response;
  },

  clearCart: async () => {
    const response = await api.delete<void>('/cart/clear');
    return response;
  },
};
