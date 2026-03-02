'use client';

import Link from 'next/link';
import { ArrowLeft, Minus, Plus, ShoppingCart, Heart, Share2, Check, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PremiumButton } from '@/design-system/components/premium-button';
import { PremiumCard } from '@/design-system/components/premium-card';
import { PremiumImage } from '@/design-system/components/premium-image';
import { Reveal, Slide, HoverLift, PressScale } from '@/design-system/components/motion';
import { EmptyState, Skeleton } from '@/design-system/components/loading-states';
import { RatingStars } from '@/components/products/RatingStars';
import dynamic from 'next/dynamic';
import { useCart } from '@/features/cart/useCart';
import { useAuth } from '@/features/auth/useAuth';
import { api } from '@/lib/api';
import { Product } from '@/types';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { trackEvent } from '@/lib/analytics';
import { productService } from '@/features/products/productService';

interface ProductDetailPageProps {
  id: string;
}

type RawProduct = Partial<Product> & {
  id?: string | number;
  title?: string;
};

interface ReviewItem {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  user: { id: string; name: string };
}

const normalizeProduct = (product: RawProduct): Product => ({
  ...product,
  id: String(product?.id ?? ''),
  name: product?.name || product?.title || 'Untitled Product',
  description: product?.description || '',
  image: product?.image || '/placeholder.svg',
  category: product?.category || 'uncategorized',
  stock: typeof product?.stock === 'number' ? product.stock : 0,
  inStock: typeof product?.inStock === 'boolean' ? product.inStock : (product?.stock ?? 0) > 0,
});

const ProductGrid = dynamic(
  () => import('@/components/products/ProductGrid').then((mod) => mod.ProductGrid),
  { ssr: false },
);

export default function ProductDetailPage({ id }: ProductDetailPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState<string>('5');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const { addToCart, isLoading } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setIsNotFound(true);
        setIsLoadingProduct(false);
        return;
      }

      try {
        setIsLoadingProduct(true);
        setError(null);
        setIsNotFound(false);

        const response = await api.get<RawProduct>(`/products/${id}`);
        const normalizedProduct = normalizeProduct(response.data);
        setProduct(normalizedProduct);

        trackEvent('product_view', { productId: normalizedProduct.id });

        const relatedResponse = await productService.getPersonalizedProducts(5, normalizedProduct.category);
        const nextRelated = (relatedResponse.data?.products || [])
          .map(normalizeProduct)
          .filter((candidate: Product) => candidate.id !== normalizedProduct.id)
          .slice(0, 4);

        setRelatedProducts(nextRelated);

        const reviewResponse = await api.get<ReviewItem[]>(`/products/${id}/reviews`);
        setReviews(reviewResponse.data || []);
      } catch (fetchError: unknown) {
        const status = (fetchError as AxiosError)?.response?.status;

        if (status === 404) {
          setIsNotFound(true);
          setProduct(null);
        } else {
          setError('Failed to load product. Please try again.');
        }
      } finally {
        setIsLoadingProduct(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    if (!isAuthenticated) {
      toast.error('Please log in to add items to cart');
      return;
    }

    try {
      await addToCart(product.id, quantity);
      toast.success(`${quantity} × ${product.name} added to cart`);
    } catch {
      toast.error('Failed to add item to cart');
    }
  };

  const handleSubmitReview = async () => {
    if (!product) return;
    if (!isAuthenticated) {
      toast.error('Please log in to submit a review');
      return;
    }

    try {
      setIsSubmittingReview(true);
      await api.post(`/products/${product.id}/reviews`, {
        rating: Number(reviewRating),
        comment: reviewComment.trim() || undefined,
      });
      const updatedProduct = await api.get<RawProduct>(`/products/${product.id}`);
      setProduct(normalizeProduct(updatedProduct.data));
      const updatedReviews = await api.get<ReviewItem[]>(`/products/${product.id}/reviews`);
      setReviews(updatedReviews.data || []);
      setReviewComment('');
      setReviewRating('5');
      toast.success('Review submitted');
    } catch (submitError: any) {
      const message = submitError?.response?.data?.message || 'Failed to submit review';
      toast.error(message);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoadingProduct) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <Skeleton variant="rect" className="aspect-square rounded-2xl" />
            <div className="space-y-4">
              <Skeleton variant="text" className="h-6 w-1/3" />
              <Skeleton variant="text" className="h-10 w-2/3" />
              <Skeleton variant="text" className="h-6 w-1/4" />
              <Skeleton variant="text" lines={4} />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (isNotFound) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <Reveal>
            <EmptyState
              icon={ShoppingCart}
              title="Product not found"
              message="The product you're looking for doesn't exist or has been removed."
              action={{
                label: 'Back to Products',
                onClick: () => {
                  window.location.href = '/products';
                },
              }}
            />
          </Reveal>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <Reveal>
            <EmptyState
              icon={ArrowLeft}
              title="Unable to load product"
              message={error || 'An unexpected error occurred.'}
              action={{
                label: 'Back to Products',
                onClick: () => {
                  window.location.href = '/products';
                },
              }}
            />
          </Reveal>
        </div>
      </Layout>
    );
  }

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Reveal>
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-foreground transition-colors">Products</Link>
            <span>/</span>
            <Link href={`/categories/${encodeURIComponent(product.category)}`} className="hover:text-foreground transition-colors">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <Slide direction="left">
            <div className="relative">
              <PremiumCard variant="glass" className="aspect-square rounded-2xl overflow-hidden">
                <PremiumImage
                  src={product.image}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                  zoomOnHover
                />
              </PremiumCard>
              {product.badge && (
                <div className="absolute top-4 left-4 z-10">
                  {product.badge === 'sale' && <span className="badge-sale text-sm">-{discountPercent}% OFF</span>}
                  {product.badge === 'new' && <span className="badge-new text-sm">New Arrival</span>}
                  {product.badge === 'bestseller' && (
                    <span className="bg-primary text-primary-foreground text-sm font-semibold px-3 py-1 rounded-full">
                      Bestseller
                    </span>
                  )}
                </div>
              )}
            </div>
          </Slide>

          <Slide direction="right">
            <div className="flex flex-col">
              <div className="mb-4">
                <Link href={`/categories/${encodeURIComponent(product.category)}`} className="text-sm text-primary font-medium hover:underline">
                  {product.category}
                </Link>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">{product.name}</h1>

              <div className="flex items-center gap-4 mb-6">
                <RatingStars rating={product.rating || 0} reviewCount={product.reviewCount || 0} size="lg" />
              </div>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-foreground">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
                    <span className="text-sm font-medium text-destructive">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>

              <div className="flex items-center gap-2 mb-6">
                {product.inStock ? (
                  <>
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">In Stock</span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">Out of Stock</span>
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-8">
                <div className="flex items-center border border-border rounded-xl overflow-hidden">
                  <PressScale>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-11 w-11 flex items-center justify-center hover:bg-secondary transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                  </PressScale>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <PressScale>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="h-11 w-11 flex items-center justify-center hover:bg-secondary transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </PressScale>
                </div>

                <PremiumButton
                  size="lg"
                  variant="premium"
                  className="flex-1 gap-2 min-w-[200px]"
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isLoading}
                >
                  <ShoppingCart size={18} />
                  Add to Cart
                </PremiumButton>

                <HoverLift>
                  <PremiumButton variant="outline" size="icon" className="h-11 w-11">
                    <Heart size={18} />
                  </PremiumButton>
                </HoverLift>

                <HoverLift>
                  <PremiumButton variant="outline" size="icon" className="h-11 w-11">
                    <Share2 size={18} />
                  </PremiumButton>
                </HoverLift>
              </div>

              <PremiumCard variant="glass" className="p-6 space-y-4">
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
              </PremiumCard>
            </div>
          </Slide>
        </div>

        {relatedProducts.length > 0 && (
          <Reveal delay={0.3}>
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">You might also like</h2>
              <ProductGrid products={relatedProducts} />
            </section>
          </Reveal>
        )}

        <div className="mt-16 space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Reviews</h2>
          <div className="grid gap-6">
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Write a review</h3>
              <div className="grid gap-4">
                <Select value={reviewRating} onValueChange={setReviewRating}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 - Excellent</SelectItem>
                    <SelectItem value="4">4 - Good</SelectItem>
                    <SelectItem value="3">3 - Average</SelectItem>
                    <SelectItem value="2">2 - Poor</SelectItem>
                    <SelectItem value="1">1 - Terrible</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder="Share your thoughts (optional)"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                />
                <PremiumButton
                  variant="premium"
                  onClick={handleSubmitReview}
                  disabled={isSubmittingReview}
                >
                  Submit Review
                </PremiumButton>
              </div>
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border border-border rounded-2xl p-4 bg-background">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-foreground">{review.user?.name || 'Customer'}</p>
                      <RatingStars rating={review.rating} reviewCount={0} size="sm" />
                    </div>
                    {review.comment && (
                      <p className="text-muted-foreground">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={ArrowLeft}
                title="No reviews yet"
                message="Be the first to review this product."
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
