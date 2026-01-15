import { create } from 'zustand';

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    stock: number;
  };
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
}

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  setCart: (cart: Cart | null) => void;
  setLoading: (loading: boolean) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  isLoading: false,
  setCart: (cart) => set({ cart, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
  clearCart: () => set({ cart: null }),
}));
