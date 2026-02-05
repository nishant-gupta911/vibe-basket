'use client';

import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/products/ProductGrid';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { Reveal, Fade, Slide } from '@/design-system/components/motion';
import { EmptyState } from '@/design-system/components/loading-states';
import { PremiumButton } from '@/design-system/components/premium-button';
import { PremiumImage } from '@/design-system/components/premium-image';
import { PackageX, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface CategoryPageComponentProps {
  slug: string;
}

export default function CategoryPageComponent({ slug }: CategoryPageComponentProps) {
  const category = categories.find((c) => c.slug === slug);
  const categoryProducts = products.filter((p) => p.categorySlug === slug);

  if (!category) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <EmptyState
            icon={PackageX}
            title="Category Not Found"
            description="The category you're looking for doesn't exist or has been removed."
            action={{
              label: 'Browse All Products',
              onClick: () => window.location.href = '/products',
            }}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Banner */}
      <Fade duration="slow">
        <div className="relative h-72 md:h-80 overflow-hidden">
          <PremiumImage
            src={category.image}
            alt={category.name}
            className="w-full h-full"
            aspectRatio="auto"
            hoverEffect="none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/50 to-transparent" />
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
                <h1 className="text-4xl md:text-5xl font-display text-white mb-3">
                  {category.name}
                </h1>
                <p className="text-white/70 text-lg">
                  {categoryProducts.length} {categoryProducts.length === 1 ? 'product' : 'products'}
                </p>
              </Slide>
            </div>
          </div>
        </div>
      </Fade>

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        {categoryProducts.length > 0 ? (
          <Reveal>
            <ProductGrid products={categoryProducts} />
          </Reveal>
        ) : (
          <EmptyState
            icon={PackageX}
            title="No Products Yet"
            description={`No products found in ${category.name}. Check back soon!`}
            action={{
              label: 'Browse Other Categories',
              onClick: () => window.location.href = '/products',
            }}
          />
        )}
      </div>
    </Layout>
  );
}
