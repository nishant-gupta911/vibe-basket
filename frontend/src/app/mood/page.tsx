'use client';

import { useState } from 'react';
import { Sparkles, Loader2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProductCard } from '@/components/products/ProductCard';
import { useCart } from '@/features/cart/useCart';
import { api } from '@/lib/api';
import { toast } from 'sonner';

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
  'Birthday',
  'Anniversary',
  'Wedding',
  'Graduation',
  'Christmas',
  'Valentine\'s Day',
  'Mother\'s Day',
  'Father\'s Day',
  'Just Because',
  'Thank You',
];

const moods = [
  'Excited',
  'Romantic',
  'Thoughtful',
  'Fun',
  'Elegant',
  'Casual',
  'Professional',
  'Adventurous',
  'Relaxed',
  'Energetic',
];

const genders = ['Male', 'Female', 'Unisex'];

export default function MoodPage() {
  const [occasion, setOccasion] = useState('');
  const [mood, setMood] = useState('');
  const [budget, setBudget] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();

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

    try {
      const payload: any = {
        occasion,
        mood,
        budget: budgetNum,
      };

      if (gender) payload.gender = gender;
      if (age) payload.age = parseInt(age);

      const response = await api.post('/ai/mood', payload);

      if (response.success) {
        setSuggestions(response.data.suggestions || []);
        if (response.data.suggestions.length === 0) {
          toast.info('No products found matching your criteria. Try adjusting your budget or preferences.');
        } else {
          toast.success(`Found ${response.data.suggestions.length} perfect matches for you!`);
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
    <div className="container mx-auto max-w-6xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-primary" />
          Mood-Based Recommendations
        </h1>
        <p className="text-muted-foreground">
          Tell us about your occasion and mood, and we&apos;ll find the perfect products for you!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg border">
            <div>
              <Label htmlFor="occasion" className="required">
                Occasion *
              </Label>
              <Select value={occasion} onValueChange={setOccasion}>
                <SelectTrigger id="occasion">
                  <SelectValue placeholder="Select occasion" />
                </SelectTrigger>
                <SelectContent>
                  {occasions.map((occ) => (
                    <SelectItem key={occ} value={occ}>
                      {occ}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="mood" className="required">
                Mood *
              </Label>
              <Select value={mood} onValueChange={setMood}>
                <SelectTrigger id="mood">
                  <SelectValue placeholder="Select mood" />
                </SelectTrigger>
                <SelectContent>
                  {moods.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="budget" className="required">
                Budget * ($)
              </Label>
              <Input
                id="budget"
                type="number"
                min="1"
                step="0.01"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g., 1000"
              />
            </div>

            <div>
              <Label htmlFor="gender">Gender (Optional)</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {genders.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="age">Age (Optional)</Label>
              <Input
                id="age"
                type="number"
                min="1"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g., 25"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Finding Perfect Matches...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get Recommendations
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">
                  Finding the perfect products for you...
                </p>
              </div>
            </div>
          ) : suggestions.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">
                  Your Perfect Matches ({suggestions.length})
                </h2>
                <Button onClick={handleAddAllToCart} variant="outline">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Add All to Cart
                </Button>
              </div>

              <div className="space-y-6">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="bg-card p-6 rounded-lg border space-y-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-primary">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-muted-foreground italic">
                          &quot;{suggestion.reason}&quot;
                        </p>
                      </div>
                    </div>

                    {suggestion.product && (
                      <ProductCard
                        product={{
                          id: suggestion.product.id,
                          name: suggestion.product.title,
                          price: suggestion.product.price,
                          image: suggestion.product.image || '/placeholder.png',
                          category: suggestion.product.category,
                          description: '',
                          stock: 1,
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-center">
              <div>
                <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Ready to find your perfect match?</p>
                <p className="text-muted-foreground">
                  Fill out the form and let our AI help you discover amazing products!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
