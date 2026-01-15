'use client'

import Link from 'next/link'
import { ArrowRight, Truck, Shield, RefreshCw, Headphones } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Layout } from '@/components/layout/Layout'
import { ProductGrid } from '@/components/products/ProductGrid'
import { CategoryCard } from '@/components/products/CategoryCard'
import { products } from '@/data/products'
import { categories } from '@/data/categories'

export default function HomePage() {
  const featuredProducts = products.filter((p) => p.badge === 'bestseller').slice(0, 4)
  const trendingProducts = products.filter((p) => p.badge === 'new' || p.badge === 'sale').slice(0, 8)
  const saleProducts = products.filter((p) => p.badge === 'sale')

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl animate-fade-in">
            <span className="inline-block bg-primary/20 text-primary px-4 py-1 rounded-full text-sm font-medium mb-6">
              New Season Collection
            </span>
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              Discover Premium
              <br />
              <span className="text-primary">Quality Products</span>
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-lg">
              Shop the latest trends with unbeatable prices. Free shipping on orders over $50. 
              Quality guaranteed.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-12 px-8">
                  Shop Now
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/categories/electronics">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 h-12 px-8">
                  Explore Categories
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50' },
              { icon: Shield, title: 'Secure Payment', desc: '100% secure checkout' },
              { icon: RefreshCw, title: 'Easy Returns', desc: '30-day return policy' },
              { icon: Headphones, title: '24/7 Support', desc: 'Dedicated support' },
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-4 py-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <feature.icon size={22} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Shop by Category</h2>
              <p className="text-muted-foreground mt-1">Find exactly what you're looking for</p>
            </div>
            <Link href="/products" className="hidden sm:flex items-center gap-1 text-primary font-medium hover:underline">
              View All
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.slice(0, 5).map((category, index) => (
              <div key={category.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Featured Products</h2>
              <p className="text-muted-foreground mt-1">Our most popular items this month</p>
            </div>
            <Link href="/products" className="hidden sm:flex items-center gap-1 text-primary font-medium hover:underline">
              View All
              <ArrowRight size={16} />
            </Link>
          </div>
          <ProductGrid products={featuredProducts} />
        </div>
      </section>

      {/* Sale Banner */}
      {saleProducts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-destructive/90 to-destructive rounded-2xl p-8 lg:p-12 text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 w-1/2 h-full bg-white/5 -skew-x-12 hidden lg:block" />
              <div className="relative z-10 max-w-lg">
                <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-medium mb-4">
                  Limited Time Offer
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  Up to 40% Off Selected Items
                </h2>
                <p className="text-white/90 mb-6">
                  Don't miss out on our biggest sale of the season. Shop now and save big on premium products.
                </p>
                <Link href="/products">
                  <Button size="lg" className="bg-white text-destructive hover:bg-white/90 gap-2">
                    Shop Sale
                    <ArrowRight size={18} />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Trending Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Trending Now</h2>
              <p className="text-muted-foreground mt-1">What's hot this week</p>
            </div>
            <Link href="/products" className="hidden sm:flex items-center gap-1 text-primary font-medium hover:underline">
              View All
              <ArrowRight size={16} />
            </Link>
          </div>
          <ProductGrid products={trendingProducts} />
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
              Stay in the Loop
            </h2>
            <p className="text-muted-foreground mb-6">
              Subscribe to our newsletter for exclusive deals, new arrivals, and insider updates.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button type="submit" className="bg-primary hover:bg-primary/90 px-6">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  )
}
