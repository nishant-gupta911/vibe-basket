'use client';

import { useSearchParams } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/products/ProductGrid';
import { products } from '@/data/products';
import { Search as SearchIcon } from 'lucide-react';
import { Reveal, Fade } from '@/design-system/components/motion';
import { EmptyState } from '@/design-system/components/loading-states';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const searchResults = products.filter((product) => {
    const searchTerm = query.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Reveal>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Search Results
            </h1>
            {query && (
              <p className="text-muted-foreground">
                {searchResults.length} results for &ldquo;{query}&rdquo;
              </p>
            )}
          </div>
        </Reveal>

        {!query ? (
          <Fade>
            <EmptyState
              icon={SearchIcon}
              title="Search for products"
              message="Enter a search term to find products"
            />
          </Fade>
        ) : searchResults.length > 0 ? (
          <Reveal delay={0.1}>
            <ProductGrid products={searchResults} />
          </Reveal>
        ) : (
          <Fade>
            <EmptyState
              icon={SearchIcon}
              title={`No products found for "${query}"`}
              message="Try searching with different keywords"
              action={{
                label: 'Browse All Products',
                onClick: () => window.location.href = '/products',
              }}
            />
          </Fade>
        )}
      </div>
    </Layout>
  );
}
