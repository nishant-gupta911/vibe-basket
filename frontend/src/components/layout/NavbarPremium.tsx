'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, User, Menu, X, ChevronDown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/features/cart/useCart';
import { useAuth } from '@/features/auth/useAuth';
import { categories } from '@/data/categories';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();

  const { getCartItemCount, fetchCart } = useCart();
  const { isAuthenticated, user, logout } = useAuth();

  const itemCount = getCartItemCount();

  // Handle scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled
            ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 py-3'
            : 'bg-transparent py-5'
        )}
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              <div className="relative w-10 h-10 rounded-xl bg-primary flex items-center justify-center overflow-hidden">
                <span className="text-primary-foreground font-display text-xl">V</span>
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="hidden sm:block">
                <span className={cn(
                  'text-lg font-semibold tracking-tight transition-colors duration-300',
                  isScrolled ? 'text-foreground' : 'text-white'
                )}>
                  Vibe Basket
                </span>
              </div>
            </Link>

            {/* Center Navigation - Desktop */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                href="/products"
                className={cn(
                  'px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-full nav-link-underline',
                  isScrolled
                    ? 'text-foreground/80 hover:text-foreground'
                    : 'text-white/80 hover:text-white'
                )}
              >
                Shop
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      'px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-full flex items-center gap-1',
                      isScrolled
                        ? 'text-foreground/80 hover:text-foreground'
                        : 'text-white/80 hover:text-white'
                    )}
                  >
                    Categories
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-56 p-2 bg-background/95 backdrop-blur-xl border border-border/50">
                  {categories.map((category) => (
                    <DropdownMenuItem key={category.id} asChild>
                      <Link
                        href={`/categories/${category.slug}`}
                        className="cursor-pointer py-2.5 px-3 rounded-lg"
                      >
                        {category.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link
                href="/mood"
                className={cn(
                  'px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-full flex items-center gap-2',
                  isScrolled
                    ? 'text-foreground/80 hover:text-foreground'
                    : 'text-white/80 hover:text-white'
                )}
              >
                <Sparkles className="w-4 h-4" />
                Mood Finder
              </Link>

              <Link
                href="/chatbot"
                className={cn(
                  'px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-full',
                  isScrolled
                    ? 'text-foreground/80 hover:text-foreground'
                    : 'text-white/80 hover:text-white'
                )}
              >
                AI Assistant
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                  isScrolled
                    ? 'text-foreground/80 hover:bg-secondary'
                    : 'text-white/80 hover:bg-white/10'
                )}
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart */}
              <Link
                href="/cart"
                className={cn(
                  'relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                  isScrolled
                    ? 'text-foreground/80 hover:bg-secondary'
                    : 'text-white/80 hover:bg-white/10'
                )}
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        'hidden md:flex items-center gap-2 h-10 px-4 rounded-full transition-all duration-300',
                        isScrolled
                          ? 'text-foreground/80 hover:bg-secondary'
                          : 'text-white/80 hover:bg-white/10'
                      )}
                    >
                      <User className="w-5 h-5" />
                      <span className="text-sm font-medium max-w-[100px] truncate">
                        {user?.name?.split(' ')[0]}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 p-2 bg-background/95 backdrop-blur-xl border border-border/50">
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer py-2.5 px-3 rounded-lg">
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="cursor-pointer py-2.5 px-3 rounded-lg text-destructive focus:text-destructive"
                    >
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login" className="hidden md:block">
                  <Button
                    size="sm"
                    className={cn(
                      'h-10 px-5 rounded-full font-medium transition-all duration-300',
                      isScrolled
                        ? 'bg-foreground text-background hover:bg-foreground/90'
                        : 'bg-white text-foreground hover:bg-white/90'
                    )}
                  >
                    Sign In
                  </Button>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={cn(
                  'lg:hidden w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                  isScrolled
                    ? 'text-foreground/80 hover:bg-secondary'
                    : 'text-white/80 hover:bg-white/10'
                )}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar - Expandable */}
        <div
          className={cn(
            'absolute left-0 right-0 top-full overflow-hidden transition-all duration-500',
            isSearchOpen ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className={cn(
            'py-4 border-b',
            isScrolled ? 'bg-background/95 backdrop-blur-xl border-border/50' : 'bg-foreground/95 backdrop-blur-xl border-white/10'
          )}>
            <div className="container mx-auto px-6 lg:px-8">
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={cn(
                      'w-full h-12 pl-5 pr-14 rounded-full text-base border-0',
                      isScrolled
                        ? 'bg-secondary text-foreground placeholder:text-muted-foreground'
                        : 'bg-white/10 text-white placeholder:text-white/50'
                    )}
                    autoFocus
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className={cn(
                      'absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full',
                      isScrolled
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-white text-foreground'
                    )}
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Full Screen Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 lg:hidden transition-all duration-500',
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-background/98 backdrop-blur-xl"
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Menu Content */}
        <div className={cn(
          'relative h-full flex flex-col pt-24 pb-8 px-6 transition-all duration-500',
          isMenuOpen ? 'translate-y-0' : '-translate-y-8'
        )}>
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-5 pr-14 rounded-2xl text-base bg-secondary border-0"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl bg-primary text-primary-foreground"
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </form>

          {/* Navigation Links */}
          <nav className="flex-1 flex flex-col gap-1">
            <Link
              href="/products"
              onClick={() => setIsMenuOpen(false)}
              className="py-4 text-2xl font-display text-foreground hover:text-primary transition-colors"
            >
              Shop All
            </Link>
            <Link
              href="/mood"
              onClick={() => setIsMenuOpen(false)}
              className="py-4 text-2xl font-display text-foreground hover:text-primary transition-colors flex items-center gap-3"
            >
              <Sparkles className="w-6 h-6 text-primary" />
              Mood Finder
            </Link>
            <Link
              href="/chatbot"
              onClick={() => setIsMenuOpen(false)}
              className="py-4 text-2xl font-display text-foreground hover:text-primary transition-colors"
            >
              AI Assistant
            </Link>

            <div className="h-px bg-border my-4" />

            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Categories</p>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                onClick={() => setIsMenuOpen(false)}
                className="py-3 text-lg text-foreground/80 hover:text-foreground transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Auth Actions */}
          <div className="pt-6 border-t border-border">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="text-destructive hover:text-destructive"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="flex-1">
                  <Button className="w-full h-14 rounded-2xl text-base bg-foreground text-background hover:bg-foreground/90">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsMenuOpen(false)} className="flex-1">
                  <Button variant="outline" className="w-full h-14 rounded-2xl text-base">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
