'use client';

import Link from 'next/link';
import { ShoppingBag, Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/features/cart/useCart';
import { Product } from '@/types';
import { toast } from 'sonner';
import { memo, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useWishlist } from '@/features/wishlist/useWishlist';
import { useAuth } from '@/features/auth/useAuth';
import { RatingStars } from './RatingStars';

interface ProductCardPremiumProps {
  product: Product;
  variant?: 'default' | 'large' | 'minimal';
}

const ProductCardPremiumComponent = ({ product, variant = 'default' }: ProductCardPremiumProps) => {
  const { addToCart, isLoading } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { isAuthenticated } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist, fetchWishlist, hasLoaded } = useWishlist();
  const isLiked = isInWishlist(product.id);
  const safeName = product.name || 'Untitled Product';
  const safeImage = product.image || '/placeholder.svg';
  const safeCategory = product.category || 'uncategorized';
  const safePrice = Number.isFinite(product.price) ? product.price : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(product.id, 1);
      toast.success(`Added to bag`, {
        description: safeName,
      });
    } catch (error: any) {
      toast.error(error.message || 'Unable to add to cart');
    }
  };

  useEffect(() => {
    if (isAuthenticated && !hasLoaded) {
      fetchWishlist();
    }
  }, [fetchWishlist, hasLoaded, isAuthenticated]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please log in to manage your wishlist');
      return;
    }
    try {
      if (isLiked) {
        await removeFromWishlist(product.id);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(product);
        toast.success('Added to wishlist');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Wishlist update failed');
    }
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  if (variant === 'large') {
    return (
      <Link href={`/products/${product.id}`} className="block group">
        <div
          className="relative w-[320px] md:w-[380px] overflow-hidden rounded-2xl bg-card"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image Container */}
          <div className="relative aspect-[3/4] overflow-hidden">
            {/* Skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 skeleton" />
            )}
            
            <img
              src={safeImage}
              alt={safeName}
              className={cn(
                'w-full h-full object-cover transition-all duration-700 ease-out-expo',
                isHovered && 'scale-105',
                imageLoaded ? 'opacity-100' : 'opacity-0'
              )}
              onLoad={() => setImageLoaded(true)}
            />

            {/* Hover Overlay */}
            <div
              className={cn(
                'absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-500',
                isHovered ? 'opacity-100' : 'opacity-0'
              )}
            />

            {/* Badge */}
            {product.badge && (
              <div className="absolute top-4 left-4">
                <span
                  className={cn(
                    'badge-premium',
                    product.badge === 'sale' && 'bg-gradient-to-r from-red-500 to-rose-500',
                    product.badge === 'new' && 'bg-gradient-to-r from-emerald-500 to-green-500'
                  )}
                >
                  {product.badge === 'sale' ? `-${discount}%` : product.badge}
                </span>
              </div>
            )}

            {/* Quick Actions */}
            <div
              className={cn(
                'absolute top-4 right-4 flex flex-col gap-2 transition-all duration-500',
                isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
              )}
            >
              <button
                onClick={handleLike}
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                  isLiked 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white/90 backdrop-blur-sm text-foreground hover:bg-white'
                )}
              >
                <Heart className={cn('w-4 h-4', isLiked && 'fill-current')} />
              </button>
              <Link
                href={`/products/${product.id}`}
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-white transition-colors"
              >
                <Eye className="w-4 h-4" />
              </Link>
            </div>

            {/* Add to Cart Button */}
            <div
              className={cn(
                'absolute bottom-4 left-4 right-4 transition-all duration-500',
                isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
            >
              <Button
                onClick={handleAddToCart}
                disabled={isLoading}
                className="w-full h-12 rounded-full bg-white text-foreground hover:bg-white/90 font-medium"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Add to Bag
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
              {safeCategory}
            </p>
            <h3 className="font-medium text-foreground text-lg leading-snug mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
              {safeName}
            </h3>
            <div className="mb-3">
              <RatingStars rating={product.rating || 0} reviewCount={product.reviewCount || 0} size="sm" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-semibold text-foreground">
                ${safePrice.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={`/products/${product.id}`} className="block group">
      <div
        className="relative overflow-hidden rounded-2xl bg-card card-premium"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary/30">
          {/* Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton" />
          )}

          <img
            src={safeImage}
            alt={safeName}
            className={cn(
              'w-full h-full object-cover transition-all duration-700 ease-out-expo',
              isHovered && 'scale-105',
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Hover Overlay */}
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent transition-opacity duration-500',
              isHovered ? 'opacity-100' : 'opacity-0'
            )}
          />

          {/* Badge */}
          {product.badge && (
            <div className="absolute top-3 left-3">
              <span
                className={cn(
                  'inline-flex items-center px-2.5 py-1 text-[10px] font-medium tracking-wide uppercase rounded',
                  product.badge === 'sale' && 'bg-red-500 text-white',
                  product.badge === 'new' && 'bg-emerald-500 text-white',
                  product.badge === 'bestseller' && 'bg-primary text-primary-foreground'
                )}
              >
                {product.badge === 'sale' ? `-${discount}%` : product.badge}
              </span>
            </div>
          )}

          {/* Quick Actions */}
          <div
            className={cn(
              'absolute top-3 right-3 flex flex-col gap-2 transition-all duration-500',
              isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
            )}
          >
            <button
              onClick={handleLike}
              className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300',
                isLiked
                  ? 'bg-red-500 text-white'
                  : 'bg-white/90 backdrop-blur-sm text-foreground hover:bg-white'
              )}
            >
              <Heart className={cn('w-4 h-4', isLiked && 'fill-current')} />
            </button>
          </div>

          {/* Add to Cart Button */}
          <div
            className={cn(
              'absolute bottom-3 left-3 right-3 transition-all duration-500',
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            <Button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="w-full h-11 rounded-full bg-white text-foreground hover:bg-white/90 font-medium text-sm"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Add to Bag
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1.5">
            {safeCategory}
          </p>
          <h3 className="font-medium text-foreground leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {safeName}
          </h3>
          <div className="mb-2">
            <RatingStars rating={product.rating || 0} reviewCount={product.reviewCount || 0} size="sm" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold text-foreground">
              ${safePrice.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export const ProductCardPremium = memo(ProductCardPremiumComponent);
