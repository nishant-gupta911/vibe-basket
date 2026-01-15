import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { RatingStars } from './RatingStars';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/products/${product.id}`} className="block">
      <div className="product-card group h-full flex flex-col">
        <div className="relative overflow-hidden aspect-square bg-secondary/30">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {product.badge && (
            <div className="absolute top-3 left-3">
              {product.badge === 'sale' && (
                <span className="badge-sale">-{discountPercent}%</span>
              )}
              {product.badge === 'new' && (
                <span className="badge-new">New</span>
              )}
              {product.badge === 'bestseller' && (
                <span className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full">
                  Bestseller
                </span>
              )}
            </div>
          )}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300" />
        </div>
        
        <div className="p-4 flex flex-col flex-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            {product.category}
          </p>
          <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="sm" />
          
          <div className="mt-auto pt-3 flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
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
