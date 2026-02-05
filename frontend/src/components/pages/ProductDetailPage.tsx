'use client';

import Link from 'next/link';
import { ArrowLeft, Minus, Plus, ShoppingCart, Heart, Share2, Check, Truck } from 'lucide-react';
import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { RatingStars } from '@/components/products/RatingStars';
import { ProductGrid } from '@/components/products/ProductGrid';
import { products } from '@/data/products';
import { useCart } from '@/features/cart/useCart';
import { useAuth } from '@/features/auth/useAuth';
import { toast } from 'sonner';

interface ProductDetailPageProps {
  id: string;
}

export default function ProductDetailPage({ id }: ProductDetailPageProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isLoading } = useCart();
  const { isAuthenticated } = useAuth();

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const relatedProducts = products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to add items to cart');
      return;
    }
    
    try {
      // The API expects productId, but our local data uses string IDs
      // We'll call addToCart for the quantity specified
      await addToCart(id, quantity);
      toast.success(`${quantity} × ${product.name} added to cart`);
    } catch {
      toast.error('Failed to add item to cart');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-foreground">Products</Link>
          <span>/</span>
          <Link href={`/categories/${product.categorySlug}`} className="hover:text-foreground">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-secondary/30">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.badge && (
              <div className="absolute top-4 left-4">
                {product.badge === 'sale' && (
                  <span className="badge-sale text-sm">-{discountPercent}% OFF</span>
                )}
                {product.badge === 'new' && (
                  <span className="badge-new text-sm">New Arrival</span>
                )}
                {product.badge === 'bestseller' && (
                  <span className="bg-primary text-primary-foreground text-sm font-semibold px-3 py-1 rounded-full">
                    Bestseller
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="mb-4">
              <Link
                href={`/categories/${product.categorySlug}`}
                className="text-sm text-primary font-medium hover:underline"
              >
                {product.category}
              </Link>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="lg" />
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-foreground">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-sm font-medium text-destructive">
                    Save ${(product.originalPrice - product.price).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-6">
              {product.inStock ? (
                <>
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm font-medium text-green-600">In Stock</span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm font-medium text-red-600">Out of Stock</span>
                </>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center border border-border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="rounded-none"
                >
                  <Minus size={16} />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  className="rounded-none"
                >
                  <Plus size={16} />
                </Button>
              </div>

              <Button
                size="lg"
                className="flex-1 bg-primary hover:bg-primary/90 gap-2 min-w-[200px]"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart size={18} />
                Add to Cart
              </Button>

              <Button variant="outline" size="icon" className="h-11 w-11">
                <Heart size={18} />
              </Button>

              <Button variant="outline" size="icon" className="h-11 w-11">
                <Share2 size={18} />
              </Button>
            </div>

            {/* Features */}
            <div className="border-t border-border pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <Truck size={20} className="text-primary" />
                <span className="text-sm">Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center gap-3">
                <Check size={20} className="text-primary" />
                <span className="text-sm">30-day easy returns</span>
              </div>
              <div className="flex items-center gap-3">
                <Check size={20} className="text-primary" />
                <span className="text-sm">Secure checkout</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              You might also like
            </h2>
            <ProductGrid products={relatedProducts} />
          </section>
        )}
      </div>
    </Layout>
  );
}
