'use client';

import { useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/products/ProductGrid';
import { EmptyState } from '@/design-system/components/loading-states';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/features/wishlist/useWishlist';
import { useAuth } from '@/features/auth/useAuth';
import { useRouter } from 'next/navigation';

export default function WishlistPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { products, isLoading, fetchWishlist, hasLoaded } = useWishlist();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!hasLoaded) {
      fetchWishlist();
    }
  }, [fetchWishlist, hasLoaded, isAuthenticated, router]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">Wishlist</h1>
        {isLoading ? (
          <EmptyState icon={Heart} title="Loading wishlist" message="Fetching your saved items..." />
        ) : products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            message="Save products to revisit them later."
            action={{
              label: 'Browse Products',
              onClick: () => {
                router.push('/products');
              },
            }}
          />
        )}
      </div>
    </Layout>
  );
}
