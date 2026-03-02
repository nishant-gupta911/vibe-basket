'use client';

import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Reveal, Fade, Slide } from '@/design-system/components/motion';
import { EmptyState } from '@/design-system/components/loading-states';
import { PackageX, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { productService, Product } from '@/features/products/productService';

interface CategoryPageComponentProps {
  category: string;
}

export default function CategoryPageComponent({ category }: CategoryPageComponentProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (!category) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await productService.getProducts({
          category,
          page: 1,
          limit: 24,
        });

        setProducts(response.data.products || []);
      } catch {
        setError('Failed to load category products.');
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [category]);

  if (!category) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <EmptyState
            icon={PackageX}
            title="Category Not Found"
            message="The category you're looking for doesn't exist."
            action={{
              label: 'Browse All Products',
              onClick: () => {
                window.location.href = '/products';
              },
            }}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Fade duration="slow">
        <div className="relative h-72 md:h-80 overflow-hidden bg-foreground">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(255,255,255,0.15)_0%,_transparent_55%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/95 via-foreground/70 to-foreground/40" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="container mx-auto">
              <Slide direction="up" delay={200}>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">Back to all products</span>
                </Link>
                <h1 className="text-4xl md:text-5xl font-display text-white mb-3 capitalize">
                  {category}
                </h1>
                {!isLoading && (
                  <p className="text-white/70 text-lg">
                    {products.length} {products.length === 1 ? 'product' : 'products'}
                  </p>
                )}
              </Slide>
            </div>
          </div>
        </div>
      </Fade>

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        {isLoading ? (
          <EmptyState icon={PackageX} title="Loading products" message="Fetching products for this category..." />
        ) : error ? (
          <EmptyState
            icon={PackageX}
            title="Could not load category"
            message={error}
            action={{
              label: 'Browse All Products',
              onClick: () => {
                window.location.href = '/products';
              },
            }}
          />
        ) : products.length > 0 ? (
          <Reveal>
            <ProductGrid products={products} />
          </Reveal>
        ) : (
          <EmptyState
            icon={PackageX}
            title="No Products Yet"
            message={`No products found in ${category}. Check back soon!`}
            action={{
              label: 'Browse Other Categories',
              onClick: () => {
                window.location.href = '/products';
              },
            }}
          />
        )}
      </div>
    </Layout>
  );
}
