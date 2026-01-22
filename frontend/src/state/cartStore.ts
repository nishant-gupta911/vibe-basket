import { create } from 'zustand';

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
  };
}

export interface Cart {
  id: string;
  userId: string;
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
