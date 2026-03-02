'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProductCardPremium } from '@/components/products/ProductCardPremium';
import { PremiumButton } from '@/design-system/components/premium-button';
import { EmptyState } from '@/design-system/components/loading-states';
import { productService, Product } from '@/features/products/productService';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { toast } from 'sonner';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'popularity';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [tags, setTags] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Array<{ name: string; count: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const searchQuery = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';

  const [headerRef, headerVisible] = useScrollReveal<HTMLElement>({ threshold: 0.3 });

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategory, priceRange, page, categoryParam, minRating, tags, inStockOnly, sortBy]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productService.getCategories();
        setCategories(response.data || []);
      } catch {
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await productService.getProducts({
        page,
        limit: 12,
        search: searchQuery,
        category: categoryParam || selectedCategory || undefined,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        minRating: minRating ?? undefined,
        tags: tags.trim() || undefined,
        inStock: inStockOnly ? true : undefined,
        sortBy: sortBy === 'featured' ? 'newest' : sortBy,
      });

      setProducts(response.data.products);
      setTotalPages(response.data.pagination?.totalPages || 1);
      setTotalCount(response.data.pagination?.total || response.data.products.length);
    } catch {
      toast.error('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setPriceRange([0, 1000]);
    setMinRating(null);
    setTags('');
    setInStockOnly(false);
    setPage(1);
  };

  const hasActiveFilters =
    selectedCategory ||
    priceRange[0] > 0 ||
    priceRange[1] < 1000 ||
    minRating !== null ||
    tags.trim().length > 0 ||
    inStockOnly;

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-4 tracking-wide">Category</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={cn(
              'px-4 py-2 rounded-full text-sm transition-all duration-300',
              !selectedCategory
                ? 'bg-foreground text-background'
                : 'bg-secondary text-foreground hover:bg-secondary/80'
            )}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={cn(
                'px-4 py-2 rounded-full text-sm transition-all duration-300',
                selectedCategory === category.name
                  ? 'bg-foreground text-background'
                  : 'bg-secondary text-foreground hover:bg-secondary/80'
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-4 tracking-wide">Price Range</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Under $50', range: [0, 50] },
            { label: '$50 - $100', range: [50, 100] },
            { label: '$100 - $250', range: [100, 250] },
            { label: '$250 - $500', range: [250, 500] },
            { label: '$500+', range: [500, 1000] },
            { label: 'All Prices', range: [0, 1000] },
          ].map(({ label, range }) => (
            <button
              key={label}
              onClick={() => setPriceRange(range as [number, number])}
              className={cn(
                'px-4 py-3 rounded-xl text-sm transition-all duration-300 text-center',
                priceRange[0] === range[0] && priceRange[1] === range[1]
                  ? 'bg-foreground text-background'
                  : 'bg-secondary text-foreground hover:bg-secondary/80'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-4 tracking-wide">Minimum Rating</h3>
        <div className="flex flex-wrap gap-2">
          {[null, 4, 3, 2, 1].map((value) => (
            <button
              key={value ?? 'all'}
              onClick={() => setMinRating(value)}
              className={cn(
                'px-4 py-2 rounded-full text-sm transition-all duration-300',
                minRating === value
                  ? 'bg-foreground text-background'
                  : 'bg-secondary text-foreground hover:bg-secondary/80'
              )}
            >
              {value ? `${value}+` : 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-4 tracking-wide">Tags</h3>
        <Input
          placeholder="e.g. casual, premium"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>

      {/* Stock */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-foreground mb-1 tracking-wide">In Stock Only</h3>
          <p className="text-xs text-muted-foreground">Hide out of stock items</p>
        </div>
        <Switch checked={inStockOnly} onCheckedChange={setInStockOnly} />
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
          Clear all filters
        </button>
      )}
    </div>
  );

  // Skeleton loader
  const ProductSkeleton = () => (
    <div className="animate-pulse">
      <div className="aspect-[3/4] rounded-2xl bg-secondary mb-4" />
      <div className="space-y-2">
        <div className="h-3 w-1/3 bg-secondary rounded" />
        <div className="h-4 w-2/3 bg-secondary rounded" />
        <div className="h-5 w-1/4 bg-secondary rounded" />
      </div>
    </div>
  );

  return (
    <Layout>
      {/* Hero Header */}
      <section
        ref={headerRef}
        className="relative pt-32 pb-16 bg-foreground text-background overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_var(--tw-gradient-stops))] from-primary/40 to-transparent" />
        </div>
        <div className="container mx-auto px-6 lg:px-8 relative">
          <div
            className={cn(
              'max-w-2xl transition-all duration-1000',
              headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
          >
            <p className="text-premium-xs text-background/50 mb-4">
              {searchQuery ? 'Search Results' : 'Our Collection'}
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4">
              {searchQuery ? (
                <>
                  Results for
                  <br />
                  <span className="text-primary">"{searchQuery}"</span>
                </>
              ) : (
                <>
                  Discover
                  <br />
                  <span className="text-gradient">Exceptional Products</span>
                </>
              )}
            </h1>
            <p className="text-background/60 text-lg">
              {totalCount} {totalCount === 1 ? 'product' : 'products'} available
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 lg:py-20 bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          {/* Toolbar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12 pb-8 border-b border-border">
            {/* Desktop Filters */}
            <div className="hidden lg:block flex-1">
              <FilterContent />
            </div>

            {/* Mobile Filter + Sort */}
            <div className="flex items-center justify-between lg:justify-end gap-4 w-full lg:w-auto">
              {/* Mobile Filter */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="lg:hidden h-11 px-5 rounded-full gap-2"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                    {hasActiveFilters && (
                      <span className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
                  <SheetHeader className="pb-6">
                    <SheetTitle className="font-display text-2xl">Filters</SheetTitle>
                  </SheetHeader>
                  <FilterContent />
                </SheetContent>
              </Sheet>

              {/* Sort */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground hidden sm:inline">Sort by</span>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                  <SelectTrigger className="w-44 h-11 rounded-full border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-asc">Price: Low → High</SelectItem>
                    <SelectItem value="price-desc">Price: High → Low</SelectItem>
                    <SelectItem value="rating">Top Rated</SelectItem>
                    <SelectItem value="popularity">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                >
                  <ProductCardPremium product={product} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={SlidersHorizontal}
              title="No products found"
              message="No products found matching your criteria."
              action={{
                label: 'Clear Filters',
                onClick: clearFilters,
              }}
            />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-16">
              <PremiumButton
                variant="outline"
                size="icon"
                className="rounded-full"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronDown className="w-4 h-4 rotate-90" />
              </PremiumButton>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={cn(
                      'w-10 h-10 rounded-full text-sm font-medium transition-all duration-300',
                      page === i + 1
                        ? 'bg-foreground text-background'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <PremiumButton
                variant="outline"
                size="icon"
                className="rounded-full"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </PremiumButton>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
