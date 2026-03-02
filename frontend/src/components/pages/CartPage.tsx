'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Package } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { PremiumButton } from '@/design-system/components/premium-button';
import { PremiumCard } from '@/design-system/components/premium-card';
import { Reveal, Slide, StaggerContainer, HoverLift, PressScale } from '@/design-system/components/motion';
import { Skeleton, EmptyState } from '@/design-system/components/loading-states';
import { useCart } from '@/features/cart/useCart';
import { useAuth } from '@/features/auth/useAuth';
import { orderService } from '@/features/orders/orderService';
import { toast } from 'sonner';

export default function CartPage() {
  const router = useRouter();
  const { cart, isLoading, fetchCart, updateCartItem, removeCartItem, getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shipping;

  // FIX: Changed itemId type from number to string to match CartItem.id type
  const handleRemoveItem = async (itemId: string, productName: string) => {
    try {
      await removeCartItem(itemId);
      toast.success(`${productName} removed from cart`);
    } catch (error: any) {
      toast.error('Failed to remove item');
    }
  };

  // FIX: Changed itemId type from number to string to match CartItem.id type
  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error: any) {
      toast.error('Failed to update quantity');
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await orderService.createOrder();
      toast.success('Order placed successfully!');
      router.push('/profile');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create order');
    }
  };

  // Cart now works without authentication

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-64 rounded-xl" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <Reveal>
            <EmptyState
              icon={ShoppingBag}
              title="Your cart is empty"
              message="Looks like you haven't added anything to your cart yet."
              action={{
                label: 'Start Shopping',
                onClick: () => router.push('/products'),
              }}
            />
          </Reveal>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Reveal>
          <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>
        </Reveal>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <StaggerContainer staggerDelay={0.05}>
              {cart.items.map((item) => (
                <Slide key={item.id} direction="left">
                  <HoverLift>
                    <PremiumCard variant="default" className="flex flex-col sm:flex-row gap-4 p-4">
                      <Link href={`/products/${item.product.id}`} className="shrink-0 self-start">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.product.id}`}
                          className="font-semibold text-foreground hover:text-primary line-clamp-1 transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-muted-foreground mb-2">Stock: {item.product.stock}</p>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-border rounded-lg overflow-hidden">
                            <PressScale>
                              <button
                                className="h-8 w-8 flex items-center justify-center hover:bg-secondary transition-colors"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                aria-label={`Decrease quantity for ${item.product.name}`}
                              >
                                <Minus size={14} />
                              </button>
                            </PressScale>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <PressScale>
                              <button
                                className="h-8 w-8 flex items-center justify-center hover:bg-secondary transition-colors"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                aria-label={`Increase quantity for ${item.product.name}`}
                              >
                                <Plus size={14} />
                              </button>
                            </PressScale>
                          </div>

                          <PressScale>
                            <button
                              className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                              onClick={() => handleRemoveItem(item.id, item.product.name)}
                              aria-label={`Remove ${item.product.name} from cart`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </PressScale>
                        </div>
                      </div>

                      <div className="text-left sm:text-right sm:ml-auto mt-3 sm:mt-0">
                        <p className="font-bold text-foreground">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-muted-foreground">
                            ${item.product.price.toFixed(2)} each
                          </p>
                        )}
                      </div>
                    </PremiumCard>
                  </HoverLift>
                </Slide>
              ))}
            </StaggerContainer>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Reveal delay={0.2}>
              <PremiumCard variant="elevated" className="p-6 lg:sticky lg:top-24">
                <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-green-600 dark:text-green-400">Free</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Add ${(50 - subtotal).toFixed(2)} more for free shipping
                    </p>
                  )}
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg">${total.toFixed(2)}</span>
                  </div>
                </div>

                <PremiumButton
                  className="w-full h-12 text-base"
                  variant="premium"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </PremiumButton>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Secure checkout powered by Razorpay
                </p>
              </PremiumCard>
            </Reveal>
          </div>
        </div>
      </div>
    </Layout>
  );
}
