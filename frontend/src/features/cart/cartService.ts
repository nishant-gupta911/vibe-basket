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
    return {
      ...response,
      data: normalizeCart(response.data),
    };
  },

  addToCart: async (data: AddToCartData) => {
    const response = await api.post<Cart>('/cart', data);
    return {
      ...response,
      data: normalizeCart(response.data),
    };
  },

  updateCartItem: async (itemId: string, quantity: number) => {
    const response = await api.patch<Cart>(`/cart/${itemId}`, { quantity });
    return {
      ...response,
      data: normalizeCart(response.data),
    };
  },

  removeCartItem: async (itemId: string) => {
    const response = await api.delete<Cart>(`/cart/${itemId}`);
    return {
      ...response,
      data: normalizeCart(response.data),
    };
  },

  clearCart: async () => {
    const response = await api.delete<void>('/cart');
    return response;
  },
};

function normalizeCart(cart: Cart | null): Cart | null {
  if (!cart) return null;
  return {
    ...cart,
    items: (cart.items || []).map((item: any) => ({
      ...item,
      product: {
        id: item.product?.id || item.productId,
        name: item.product?.name || item.product?.title || 'Untitled Product',
        price: typeof item.product?.price === 'number' ? item.product.price : 0,
        image: item.product?.image || '/placeholder.svg',
        stock: typeof item.product?.stock === 'number' ? item.product.stock : 0,
      },
    })),
  };
}
