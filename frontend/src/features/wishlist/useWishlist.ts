import { useCallback } from 'react';
import { useWishlistStore } from '@/state/wishlistStore';
import { wishlistService } from './wishlistService';
import { Product } from '@/types';

export const useWishlist = () => {
  const {
    products,
    isLoading,
    hasLoaded,
    setProducts,
    setLoading,
    setHasLoaded,
  } = useWishlistStore();

  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true);
      const response = await wishlistService.getWishlist();
      setProducts(response.data || []);
      setHasLoaded(true);
    } finally {
      setLoading(false);
    }
  }, [setHasLoaded, setLoading, setProducts]);

  const addToWishlist = useCallback(
    async (product: Product) => {
      await wishlistService.addToWishlist(product.id);
      setProducts([...products, product]);
    },
    [products, setProducts]
  );

  const removeFromWishlist = useCallback(
    async (productId: string) => {
      await wishlistService.removeFromWishlist(productId);
      setProducts(products.filter((item) => item.id !== productId));
    },
    [products, setProducts]
  );

  const isInWishlist = useCallback(
    (productId: string) => products.some((item) => item.id === productId),
    [products]
  );

  return {
    products,
    isLoading,
    hasLoaded,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };
};
