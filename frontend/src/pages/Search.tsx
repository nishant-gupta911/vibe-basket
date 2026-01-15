import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/products/ProductGrid';
import { products } from '@/data/products';
import { Search as SearchIcon } from 'lucide-react';

export default function Search() {
  const [searchParams] = useSearchParams();
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Search Results
          </h1>
          {query && (
            <p className="text-muted-foreground">
              {searchResults.length} results for "{query}"
            </p>
          )}
        </div>

        {!query ? (
          <div className="text-center py-16">
            <SearchIcon size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">
              Enter a search term to find products
            </p>
          </div>
        ) : searchResults.length > 0 ? (
          <ProductGrid products={searchResults} />
        ) : (
          <div className="text-center py-16">
            <SearchIcon size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground mb-2">
              No products found for "{query}"
            </p>
            <p className="text-muted-foreground">
              Try searching with different keywords
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
