'use client';

import { useState } from 'react';
import { Sparkles, Loader2, ShoppingBag, ArrowRight, Wand2 } from 'lucide-react';
import { PremiumButton } from '@/design-system/components/premium-button';
import { PremiumInput } from '@/design-system/components/premium-input';
import { Label } from '@/components/ui/label';
import { Layout } from '@/components/layout/Layout';
import { ProductCardPremium } from '@/components/products/ProductCardPremium';
import { EmptyState } from '@/design-system/components/loading-states';
import { Reveal, Slide, Fade, StaggerContainer } from '@/design-system/components/motion';
import { useCart } from '@/features/cart/useCart';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/analytics';

interface ProductSuggestion {
  productId: string;
  reason: string;
  product?: {
    id: string;
    title: string;
    price: number;
    image: string;
    category: string;
  };
}

const occasions = [
  { value: 'Birthday', emoji: '🎂' },
  { value: 'Anniversary', emoji: '💝' },
  { value: 'Wedding', emoji: '💒' },
  { value: 'Graduation', emoji: '🎓' },
  { value: 'Christmas', emoji: '🎄' },
  { value: "Valentine's Day", emoji: '❤️' },
  { value: "Mother's Day", emoji: '👩' },
  { value: "Father's Day", emoji: '👨' },
  { value: 'Just Because', emoji: '✨' },
  { value: 'Thank You', emoji: '🙏' },
];

const moods = [
  { value: 'Excited', color: 'from-yellow-400 to-orange-500' },
  { value: 'Romantic', color: 'from-pink-400 to-rose-500' },
  { value: 'Thoughtful', color: 'from-blue-400 to-indigo-500' },
  { value: 'Fun', color: 'from-green-400 to-emerald-500' },
  { value: 'Elegant', color: 'from-purple-400 to-violet-500' },
  { value: 'Casual', color: 'from-slate-400 to-slate-500' },
  { value: 'Professional', color: 'from-gray-500 to-gray-700' },
  { value: 'Adventurous', color: 'from-orange-400 to-red-500' },
  { value: 'Relaxed', color: 'from-teal-400 to-cyan-500' },
  { value: 'Energetic', color: 'from-lime-400 to-green-500' },
];

export default function MoodPagePremium() {
  const [occasion, setOccasion] = useState('');
  const [mood, setMood] = useState('');
  const [budget, setBudget] = useState('');
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [clarification, setClarification] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { addToCart } = useCart();

  const [headerRef, headerVisible] = useScrollReveal<HTMLElement>();
  const [resultsRef, resultsVisible] = useScrollReveal<HTMLElement>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!occasion || !mood || !budget) {
      toast.error('Please fill in all required fields');
      return;
    }

    const budgetNum = parseFloat(budget);
    if (isNaN(budgetNum) || budgetNum <= 0) {
      toast.error('Please enter a valid budget');
      return;
    }

    setIsLoading(true);
    setSuggestions([]);
    setClarification(null);
    setHasSearched(true);

    try {
      const payload = {
        occasion,
        mood,
        budget: budgetNum,
      };

      trackEvent('mood_selection', { occasion, mood, budget: budgetNum });

      const response = await api.post('/ai/mood', payload);

      if (response.success) {
        setSuggestions(response.data.suggestions || []);
        setClarification(response.data.clarification || null);
        if (response.data.suggestions.length === 0) {
          toast.info(response.data.clarification || 'No products found matching your criteria. Try adjusting your budget.');
        } else {
          toast.success(`Found ${response.data.suggestions.length} perfect matches!`);
        }
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error('Mood recommendation error:', error);
      toast.error(error.message || 'Failed to get recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAllToCart = async () => {
    if (suggestions.length === 0) return;

    let successCount = 0;
    for (const suggestion of suggestions) {
      try {
        await addToCart(suggestion.productId, 1);
        successCount++;
      } catch (error) {
        console.error(`Failed to add ${suggestion.productId}:`, error);
      }
    }

    if (successCount > 0) {
      toast.success(`Added ${successCount} items to cart!`);
    } else {
      toast.error('Failed to add items to cart');
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section
        ref={headerRef}
        className="relative min-h-[60vh] flex items-center overflow-hidden bg-foreground text-background"
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-[128px] animate-float" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-[128px] animate-float" style={{ animationDelay: '2s' }} />
          </div>
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative z-10 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-8 transition-all duration-1000',
                headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
            >
              <Wand2 className="w-4 h-4 text-primary" />
              <span className="text-white/90 text-sm tracking-wide">AI-Powered Discovery</span>
            </div>

            <h1
              className={cn(
                'font-display text-5xl md:text-6xl lg:text-7xl mb-6 transition-all duration-1000 delay-100',
                headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              )}
            >
              Find Your Perfect
              <br />
              <span className="text-gradient">Match</span>
            </h1>

            <p
              className={cn(
                'text-lg md:text-xl text-white/60 max-w-xl mx-auto transition-all duration-1000 delay-200',
                headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
            >
              Tell us about your occasion and mood. Our AI will curate 
              personalized product recommendations just for you.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 bg-background -mt-20 relative z-10">
        <div className="container mx-auto px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="bg-card rounded-3xl p-8 md:p-12 shadow-premium-lg border border-border/50">
              {/* Occasion Selection */}
              <div className="mb-10">
                <Label className="text-base font-medium mb-4 block">
                  What's the occasion?
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {occasions.map((occ) => (
                    <button
                      key={occ.value}
                      type="button"
                      onClick={() => setOccasion(occ.value)}
                      className={cn(
                        'flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300',
                        occasion === occ.value
                          ? 'border-primary bg-primary/5 shadow-glow'
                          : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                      )}
                    >
                      <span className="text-2xl mb-1">{occ.emoji}</span>
                      <span className="text-xs font-medium text-center">{occ.value}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood Selection */}
              <div className="mb-10">
                <Label className="text-base font-medium mb-4 block">
                  What mood are you going for?
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {moods.map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setMood(m.value)}
                      className={cn(
                        'relative overflow-hidden p-4 rounded-2xl border-2 transition-all duration-300',
                        mood === m.value
                          ? 'border-primary shadow-glow'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <div className={cn(
                        'absolute inset-0 bg-gradient-to-br opacity-10',
                        m.color
                      )} />
                      <span className="relative text-sm font-medium">{m.value}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Input */}
              <div className="mb-10">
                <Label className="text-base font-medium mb-4 block">
                  What's your budget?
                </Label>
                <div className="relative max-w-xs">
                  <PremiumInput
                    type="number"
                    min="1"
                    step="0.01"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="500"
                    leftIcon={<span className="text-muted-foreground">$</span>}
                    size="lg"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <PremiumButton
                type="submit"
                variant="premium"
                size="lg"
                disabled={isLoading || !occasion || !mood || !budget}
                loading={isLoading}
                loadingText="Finding Matches..."
                leftIcon={!isLoading && <Sparkles className="w-5 h-5" />}
                className="w-full sm:w-auto"
              >
                Find My Perfect Products
              </PremiumButton>
            </div>
          </form>
        </div>
      </section>

      {/* Results Section */}
      {hasSearched && (
        <section ref={resultsRef} className="py-20 bg-secondary/30">
          <div className="container mx-auto px-6 lg:px-8">
            {isLoading ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
                <p className="text-lg text-muted-foreground">Analyzing your preferences...</p>
              </div>
            ) : suggestions.length > 0 ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
                  <div
                    className={cn(
                      'transition-all duration-800',
                      resultsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    )}
                  >
                    <p className="text-premium-xs text-muted-foreground mb-2">Your Curated Selection</p>
                    <h2 className="font-display text-3xl md:text-4xl">
                      {suggestions.length} Perfect Matches
                    </h2>
                  </div>
                  <PremiumButton
                    onClick={handleAddAllToCart}
                    variant="premium"
                    size="lg"
                    leftIcon={<ShoppingBag className="w-4 h-4" />}
                  >
                    Add All to Bag
                  </PremiumButton>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={suggestion.productId}
                      className={cn(
                        'transition-all duration-800',
                        resultsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                      )}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      {suggestion.product ? (
                        <div>
                          <ProductCardPremium
                            product={{
                              id: suggestion.product.id,
                              name: suggestion.product.title,
                              description: suggestion.reason,
                              price: suggestion.product.price,
                              image: suggestion.product.image,
                              category: suggestion.product.category,
                            }}
                          />
                          <p className="mt-3 text-sm text-muted-foreground italic">
                            "{suggestion.reason}"
                          </p>
                        </div>
                      ) : (
                        <div className="p-6 rounded-2xl bg-card border border-border">
                          <p className="text-muted-foreground">Product ID: {suggestion.productId}</p>
                          <p className="text-sm mt-2">{suggestion.reason}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <EmptyState
                icon={Sparkles}
                title="No Matches Found"
                description={clarification || "We couldn't find products matching your criteria. Try adjusting your preferences or budget."}
                action={{
                  label: 'Try Different Preferences',
                  onClick: () => {
                    setOccasion('');
                    setMood('');
                    setBudget('');
                    setHasSearched(false);
                  },
                }}
              />
            )}
          </div>
        </section>
      )}
    </Layout>
  );
}
