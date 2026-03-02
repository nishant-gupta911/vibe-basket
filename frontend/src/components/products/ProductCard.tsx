'use client'

import Link from 'next/link';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/features/cart/useCart';
import { Product } from '@/types';
import { toast } from 'sonner';
import { useWishlist } from '@/features/wishlist/useWishlist';
import { useAuth } from '@/features/auth/useAuth';
import { useEffect } from 'react';
import { RatingStars } from './RatingStars';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist, fetchWishlist, hasLoaded } = useWishlist();
  const safeName = product.name || 'Untitled Product';
  const safeImage = product.image || '/placeholder.svg';
  const safePrice = Number.isFinite(product.price) ? product.price : 0;
  const safeCategory = product.category || 'uncategorized';
  const isLiked = isInWishlist(product.id);

  useEffect(() => {
    if (isAuthenticated && !hasLoaded) {
      fetchWishlist();
    }
  }, [fetchWishlist, hasLoaded, isAuthenticated]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(product.id, 1);
      toast.success(`${safeName} added to cart`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to cart');
    }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
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
      toast.error(error.message || 'Wishlist update failed');
    }
  };

  return (
    <Link href={`/products/${product.id}`} className="block">
      <div className="product-card group h-full flex flex-col">
        <div className="relative overflow-hidden aspect-square bg-secondary/30">
          <img
            src={safeImage}
            alt={safeName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300" />
          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
              isLiked ? 'bg-red-500 text-white' : 'bg-white/90 text-foreground hover:bg-white'
            }`}
          >
            <Heart className={isLiked ? 'fill-current' : ''} size={16} />
          </button>
        </div>
        
        <div className="p-4 flex flex-col flex-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            {safeCategory}
          </p>
          <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {safeName}
          </h3>
          <div className="mb-2">
            <RatingStars rating={product.rating || 0} reviewCount={product.reviewCount || 0} size="sm" />
          </div>
          
          <div className="mt-auto pt-3 flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground">
                ${safePrice.toFixed(2)}
              </span>
            </div>
            
            <Button
              size="icon"
              variant="outline"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-primary hover:text-primary-foreground hover:border-primary"
              onClick={handleAddToCart}
            >
              <ShoppingCart size={18} />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
