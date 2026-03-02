'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Search as SearchIcon } from 'lucide-react';
import { Reveal, Fade } from '@/design-system/components/motion';
import { EmptyState } from '@/design-system/components/loading-states';
import { productService, Product } from '@/features/products/productService';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';

  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!search.trim()) {
        setResults([]);
        setError(null);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await productService.getProducts({
          search: search.trim(),
          page: 1,
          limit: 20,
        });

        setResults(response.data.products || []);
      } catch {
        setError('Failed to load search results. Please try again.');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [search]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Reveal>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Search Results</h1>
            {search && !isLoading && (
              <p className="text-muted-foreground">
                {results.length} results for &ldquo;{search}&rdquo;
              </p>
            )}
          </div>
        </Reveal>

        {!search ? (
          <Fade>
            <EmptyState
              icon={SearchIcon}
              title="Search for products"
              message="Enter a search term to find products"
            />
          </Fade>
        ) : isLoading ? (
          <Fade>
            <EmptyState icon={SearchIcon} title="Searching..." message="Loading products from the catalog" />
          </Fade>
        ) : error ? (
          <Fade>
            <EmptyState
              icon={SearchIcon}
              title="Search failed"
              message={error}
              action={{
                label: 'Browse All Products',
                onClick: () => {
                  window.location.href = '/products';
                },
              }}
            />
          </Fade>
        ) : results.length > 0 ? (
          <Reveal delay={0.1}>
            <ProductGrid products={results} />
          </Reveal>
        ) : (
          <Fade>
            <EmptyState
              icon={SearchIcon}
              title={`No products found for "${search}"`}
              message="Try searching with different keywords"
              action={{
                label: 'Browse All Products',
                onClick: () => {
                  window.location.href = '/products';
                },
              }}
            />
          </Fade>
        )}
      </div>
    </Layout>
  );
}
