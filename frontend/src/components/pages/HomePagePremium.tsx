'use client';

import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Sparkles, Play, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { ProductCardPremium } from '@/components/products/ProductCardPremium';
import { productService, Product } from '@/features/products/productService';
import { useScrollReveal, useStaggerReveal } from '@/hooks/useScrollReveal';
import { useEffect, useRef, useState } from 'react';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Array<{ name: string; count: number }>>([]);

  // Scroll refs for animations
  const [heroRef, heroVisible] = useScrollReveal<HTMLElement>({ threshold: 0.2 });
  const [collectionRef, collectionVisible] = useStaggerReveal<HTMLElement>();
  const [moodRef, moodVisible] = useScrollReveal<HTMLElement>();
  const [storyRef, storyVisible] = useScrollReveal<HTMLElement>();
  const [productsRef, productsVisible] = useStaggerReveal<HTMLElement>();

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          productService.getProducts({ page: 1, limit: 12 }),
          productService.getCategories(),
        ]);

        const fetchedProducts = productsResponse.data.products || [];
        setFeaturedProducts(fetchedProducts.slice(0, 4));
        setTrendingProducts(fetchedProducts.slice(0, 6));
        setCategories(categoriesResponse.data || []);
      } catch {
        setFeaturedProducts([]);
        setTrendingProducts([]);
        setCategories([]);
      }
    };

    fetchHomeData();
  }, []);

  const scrollCollection = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 400;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <Layout>
      {/* ==================== HERO SECTION ==================== */}
      <section
        ref={heroRef}
        className="relative min-h-[100vh] flex items-end overflow-hidden bg-foreground"
      >
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop"
            alt="Hero"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="hero-overlay-radial" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/50 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full pb-20 pt-40 lg:pb-32 lg:pt-48">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl">
              {/* Label */}
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-8 transition-all duration-1000 ${
                  heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-white/90 text-sm tracking-wide">New Collection 2026</span>
              </div>

              {/* Main Headline */}
              <h1
                className={`font-display text-5xl md:text-7xl lg:text-8xl text-white leading-[0.95] mb-8 transition-all duration-1000 delay-100 ${
                  heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
              >
                Curated for the
                <br />
                <span className="text-gradient">Extraordinary</span>
              </h1>

              {/* Subheadline */}
              <p
                className={`text-lg md:text-xl text-white/70 max-w-xl mb-12 leading-relaxed transition-all duration-1000 delay-200 ${
                  heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                Discover a refined selection of premium products, 
                thoughtfully chosen to elevate your everyday experience.
              </p>

              {/* CTA Buttons */}
              <div
                className={`flex flex-wrap items-center gap-4 transition-all duration-1000 delay-300 ${
                  heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <Link href="/products">
                  <Button
                    size="lg"
                    className="btn-premium h-14 px-8 rounded-full text-base font-medium text-white"
                  >
                    <span className="flex items-center gap-2">
                      Explore Collection
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </Button>
                </Link>
                <Link href="/mood">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="h-14 px-8 rounded-full text-white/90 hover:text-white hover:bg-white/10 border border-white/20"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Discover Your Mood
                  </Button>
                </Link>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div
              className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-1000 delay-500 ${
                heroVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <span className="text-white/50 text-xs tracking-widest uppercase">Scroll</span>
              <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURED COLLECTION STRIP ==================== */}
      <section ref={collectionRef} className="section-padding bg-background relative">
        <div className="container mx-auto px-6 lg:px-8 mb-12">
          <div className="flex items-end justify-between">
            <div
              className={`transition-all duration-800 ${
                collectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <p className="text-premium-xs text-muted-foreground mb-3">Featured Selection</p>
              <h2 className="font-display text-4xl md:text-5xl text-foreground">
                Editor's Picks
              </h2>
            </div>
            <div
              className={`hidden md:flex items-center gap-2 transition-all duration-800 delay-200 ${
                collectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <button
                onClick={() => scrollCollection('left')}
                className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
              <button
                onClick={() => scrollCollection('right')}
                className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scroll Collection */}
        <div
          ref={scrollContainerRef}
          className="scroll-container px-6 lg:px-8"
          style={{ scrollPaddingLeft: '1.5rem' }}
        >
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              className={`scroll-item transition-all duration-800 ${
                collectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <ProductCardPremium product={product} variant="large" />
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="container mx-auto px-6 lg:px-8 mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors line-animate"
          >
            <span className="font-medium">View All Products</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ==================== MOOD FINDER SPOTLIGHT ==================== */}
      <section ref={moodRef} className="relative py-0 overflow-hidden">
        <div className="grid lg:grid-cols-2 min-h-[80vh]">
          {/* Left - Image */}
          <div className="relative h-[50vh] lg:h-auto overflow-hidden img-zoom">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=1600&fit=crop"
              alt="Mood Finder"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/20 lg:to-background" />
          </div>

          {/* Right - Content */}
          <div className="relative flex items-center bg-background lg:bg-transparent">
            <div className="px-8 lg:px-16 py-16 lg:py-0 max-w-xl">
              <div
                className={`transition-all duration-1000 ${
                  moodVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
                }`}
              >
                <p className="text-premium-xs text-primary mb-4">AI-Powered Discovery</p>
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 leading-[1.1]">
                  Find Products
                  <br />
                  That Match
                  <br />
                  <span className="text-gradient">Your Mood</span>
                </h2>
                <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                  Our intelligent mood finder analyzes your current vibe and curates 
                  a personalized selection of products perfect for your moment.
                </p>
                <Link href="/mood">
                  <Button
                    size="lg"
                    className="btn-premium h-14 px-8 rounded-full text-white"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Try Mood Finder
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PRODUCT STORY - EDITORIAL ==================== */}
      <section ref={storyRef} className="section-padding bg-secondary/30">
        <div className="container mx-auto px-6 lg:px-8">
          {/* Story Block 1 */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-32">
            <div
              className={`order-2 lg:order-1 transition-all duration-1000 ${
                storyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
            >
              <p className="text-premium-xs text-muted-foreground mb-4">Premium Quality</p>
              <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6 leading-[1.1]">
                Crafted with
                <br />
                Precision
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Every product in our collection is meticulously selected for quality, 
                design, and craftsmanship. We partner with the world's finest brands 
                to bring you exceptional pieces that stand the test of time.
              </p>
              <Link href="/categories/electronics">
                <Button variant="outline" size="lg" className="rounded-full h-12 px-6 group">
                  Explore Electronics
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <div
              className={`order-1 lg:order-2 transition-all duration-1000 delay-200 ${
                storyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
            >
              <div className="aspect-[4/5] rounded-3xl overflow-hidden img-zoom shadow-premium-lg">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=1000&fit=crop"
                  alt="Premium Electronics"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Story Block 2 */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden img-zoom shadow-premium-lg">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1000&fit=crop"
                alt="Fashion Collection"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-premium-xs text-muted-foreground mb-4">Timeless Style</p>
              <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6 leading-[1.1]">
                Elegance in
                <br />
                Every Detail
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Fashion is more than clothing—it's an expression of identity. 
                Our curated fashion collection brings together pieces that 
                celebrate individuality while maintaining timeless appeal.
              </p>
              <Link href="/categories/clothing">
                <Button variant="outline" size="lg" className="rounded-full h-12 px-6 group">
                  Explore Clothing
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== TRENDING PRODUCTS ==================== */}
      <section ref={productsRef} className="section-padding bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p
              className={`text-premium-xs text-muted-foreground mb-3 transition-all duration-800 ${
                productsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              What's Hot
            </p>
            <h2
              className={`font-display text-4xl md:text-5xl text-foreground transition-all duration-800 delay-100 ${
                productsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Trending Now
            </h2>
          </div>

          {/* Product Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingProducts.map((product, index) => (
              <div
                key={product.id}
                className={`transition-all duration-800 ${
                  productsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <ProductCardPremium product={product} />
              </div>
            ))}
          </div>

          {/* View All */}
          <div className="text-center mt-16">
            <Link href="/products">
              <Button size="lg" className="btn-premium h-14 px-10 rounded-full text-white">
                <span className="flex items-center gap-2">
                  View All Products
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== CATEGORIES SHOWCASE ==================== */}
      <section className="py-20 bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-premium-xs text-background/50 mb-3">Browse By</p>
            <h2 className="font-display text-4xl md:text-5xl">Categories</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.name}
                href={`/categories/${encodeURIComponent(category.name)}`}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden"
              >
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop"
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-end p-6">
                  <div className="transform transition-transform duration-500 group-hover:translate-y-[-4px]">
                    <h3 className="font-display text-2xl text-white mb-1">{category.name}</h3>
                    <p className="text-white/60 text-sm">{category.count} Products</p>
                  </div>
                </div>
                <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowUpRight className="w-5 h-5 text-white" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== NEWSLETTER ==================== */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-premium-xs text-muted-foreground mb-4">Stay Updated</p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
              Join the Inner Circle
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              Be the first to know about new arrivals, exclusive offers, and curated 
              collections delivered straight to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 h-14 px-6 rounded-full border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              <Button type="submit" className="btn-premium h-14 px-8 rounded-full text-white shrink-0">
                <span>Subscribe</span>
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-4">
              By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
