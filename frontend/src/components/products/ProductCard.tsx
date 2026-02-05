'use client'

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { RatingStars } from './RatingStars';
import { Button } from '@/components/ui/button';
import { useCart } from '@/features/cart/useCart';
import { Product } from '@/types';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(product.id, 1);
      toast.success(`${product.name} added to cart`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to cart');
    }
  };

  return (
    <Link href={`/products/${product.id}`} className="block">
      <div className="product-card group h-full flex flex-col">
        <div className="relative overflow-hidden aspect-square bg-secondary/30">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300" />
        </div>
        
        <div className="p-4 flex flex-col flex-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            {product.category}
          </p>
          <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <div className="mt-auto pt-3 flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground">
                ${product.price.toFixed(2)}
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
