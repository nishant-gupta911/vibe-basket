import { create } from 'zustand';
import { Product } from '@/types';

interface WishlistState {
  products: Product[];
  isLoading: boolean;
  hasLoaded: boolean;
  setProducts: (products: Product[]) => void;
  setLoading: (loading: boolean) => void;
  setHasLoaded: (loaded: boolean) => void;
}

export const useWishlistStore = create<WishlistState>((set) => ({
  products: [],
  isLoading: false,
  hasLoaded: false,
  setProducts: (products) => set({ products }),
  setLoading: (loading) => set({ isLoading: loading }),
  setHasLoaded: (loaded) => set({ hasLoaded: loaded }),
}));
