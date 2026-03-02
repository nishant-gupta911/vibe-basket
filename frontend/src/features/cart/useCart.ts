import { useCartStore } from '@/state/cartStore';
import { cartService, AddToCartData } from './cartService';
import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';

export const useCart = () => {
  const { cart, isLoading, setCart, setLoading, clearCart: clearCartStore } = useCartStore();
  const [error, setError] = useState<string | null>(null);

  const fetchCart = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await cartService.getCart();
      setCart(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch cart';
      setError(errorMessage);
      console.error('Fetch cart error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      setError(null);
      setLoading(true);
      const response = await cartService.addToCart({ productId, quantity });
      setCart(response.data);
      trackEvent('cart_add', { productId, quantity });
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to add to cart';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId: string, quantity: number) => {
    try {
      setError(null);
      setLoading(true);
      const response = await cartService.updateCartItem(itemId, quantity);
      setCart(response.data);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update cart';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const removeCartItem = async (itemId: string) => {
    try {
      setError(null);
      setLoading(true);
      const response = await cartService.removeCartItem(itemId);
      setCart(response.data);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to remove item';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      setLoading(true);
      await cartService.clearCart();
      clearCartStore();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to clear cart';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = () => {
    if (!cart) return 0;
    return cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getCartItemCount = () => {
    if (!cart) return 0;
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  };

  return {
    cart,
    isLoading,
    error,
    fetchCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    getCartTotal,
    getCartItemCount,
  };
};
