/**
 * MOOD RECOMMENDATION CONFIGURATION
 * 
 * This is the SINGLE SOURCE OF TRUTH for all mood-based product recommendations.
 * All logic is deterministic - no AI APIs, no network calls.
 * 
 * Each configuration defines:
 * - mood: The mood selection
 * - occasion: The occasion selection
 * - allowedCategories: Product categories that fit this mood/occasion
 * - keywords: Terms to match in product titles/descriptions
 * - budgetMultiplier: How much of the budget to target (0.5 = 50%, 0.8 = 80%, etc.)
 * - explanation: Template for why products were recommended
 */

export interface MoodConfig {
  mood: string;
  occasion: string;
  allowedCategories: string[];
  keywords: string[];
  budgetMultiplier: number;
  explanation: string;
}

/**
 * Mood-Occasion Configuration Matrix
 * Add new combinations here to expand recommendations
 */
export const MOOD_CONFIGURATIONS: MoodConfig[] = [
  // BIRTHDAY COMBINATIONS
  {
    mood: 'Excited',
    occasion: 'Birthday',
    allowedCategories: ['electronics', 'sports', 'accessories'],
    keywords: ['wireless', 'smart', 'pro', 'premium', 'watch'],
    budgetMultiplier: 0.8,
    explanation: 'Perfect for an exciting birthday celebration! This will make their special day unforgettable.',
  },
  {
    mood: 'Fun',
    occasion: 'Birthday',
    allowedCategories: ['sports', 'electronics', 'accessories'],
    keywords: ['running', 'yoga', 'watch', 'sunglasses'],
    budgetMultiplier: 0.7,
    explanation: 'A fun gift that brings joy and excitement to their birthday!',
  },
  {
    mood: 'Elegant',
    occasion: 'Birthday',
    allowedCategories: ['accessories', 'electronics'],
    keywords: ['leather', 'premium', 'sunglasses', 'wallet'],
    budgetMultiplier: 0.9,
    explanation: 'An elegant choice that shows sophistication and thoughtfulness for their birthday.',
  },

  // ANNIVERSARY COMBINATIONS
  {
    mood: 'Romantic',
    occasion: 'Anniversary',
    allowedCategories: ['accessories', 'electronics', 'home'],
    keywords: ['leather', 'premium', 'wallet', 'watch', 'sunglasses'],
    budgetMultiplier: 0.85,
    explanation: 'A romantic gesture perfect for celebrating your special anniversary together.',
  },
  {
    mood: 'Elegant',
    occasion: 'Anniversary',
    allowedCategories: ['accessories', 'electronics'],
    keywords: ['premium', 'leather', 'smart', 'watch', 'wallet'],
    budgetMultiplier: 0.9,
    explanation: 'An elegant anniversary gift that speaks volumes about your refined taste.',
  },
  {
    mood: 'Thoughtful',
    occasion: 'Anniversary',
    allowedCategories: ['home', 'accessories', 'electronics'],
    keywords: ['coffee', 'premium', 'leather', 'wallet'],
    budgetMultiplier: 0.75,
    explanation: 'A thoughtful choice that shows how much you care about your relationship.',
  },

  // WEDDING COMBINATIONS
  {
    mood: 'Elegant',
    occasion: 'Wedding',
    allowedCategories: ['home', 'accessories', 'electronics'],
    keywords: ['coffee', 'maker', 'premium', 'leather'],
    budgetMultiplier: 0.9,
    explanation: 'An elegant wedding gift that the couple will cherish for years to come.',
  },
  {
    mood: 'Thoughtful',
    occasion: 'Wedding',
    allowedCategories: ['home', 'accessories'],
    keywords: ['coffee', 'maker', 'leather', 'wallet'],
    budgetMultiplier: 0.8,
    explanation: 'A thoughtful gift perfect for the newlyweds starting their journey together.',
  },
  {
    mood: 'Professional',
    occasion: 'Wedding',
    allowedCategories: ['home', 'electronics', 'accessories'],
    keywords: ['coffee', 'laptop', 'backpack', 'premium'],
    budgetMultiplier: 0.85,
    explanation: 'A practical and professional gift for the modern couple.',
  },

  // GRADUATION COMBINATIONS
  {
    mood: 'Excited',
    occasion: 'Graduation',
    allowedCategories: ['electronics', 'accessories'],
    keywords: ['smart', 'watch', 'laptop', 'backpack', 'wireless'],
    budgetMultiplier: 0.8,
    explanation: 'Celebrate their achievement with an exciting gift for their next chapter!',
  },
  {
    mood: 'Professional',
    occasion: 'Graduation',
    allowedCategories: ['accessories', 'electronics'],
    keywords: ['laptop', 'backpack', 'wallet', 'leather'],
    budgetMultiplier: 0.85,
    explanation: 'A professional gift to help them succeed in their career journey.',
  },
  {
    mood: 'Adventurous',
    occasion: 'Graduation',
    allowedCategories: ['sports', 'accessories', 'electronics'],
    keywords: ['backpack', 'running', 'shoes', 'watch'],
    budgetMultiplier: 0.75,
    explanation: 'Perfect for the adventurous graduate ready to explore the world!',
  },

  // CHRISTMAS COMBINATIONS
  {
    mood: 'Excited',
    occasion: 'Christmas',
    allowedCategories: ['electronics', 'home', 'sports'],
    keywords: ['wireless', 'headphones', 'smart', 'coffee'],
    budgetMultiplier: 0.8,
    explanation: 'A festive gift that will bring excitement on Christmas morning!',
  },
  {
    mood: 'Relaxed',
    occasion: 'Christmas',
    allowedCategories: ['home', 'sports', 'accessories'],
    keywords: ['coffee', 'yoga', 'mat', 'sunglasses'],
    budgetMultiplier: 0.7,
    explanation: 'Perfect for a cozy and relaxed Christmas celebration.',
  },
  {
    mood: 'Thoughtful',
    occasion: 'Christmas',
    allowedCategories: ['home', 'accessories', 'electronics'],
    keywords: ['coffee', 'leather', 'wallet', 'premium'],
    budgetMultiplier: 0.75,
    explanation: 'A thoughtful Christmas gift that shows you truly care.',
  },

  // VALENTINE'S DAY COMBINATIONS
  {
    mood: 'Romantic',
    occasion: "Valentine's Day",
    allowedCategories: ['accessories', 'electronics'],
    keywords: ['premium', 'leather', 'wallet', 'sunglasses', 'watch'],
    budgetMultiplier: 0.85,
    explanation: "Express your love with this romantic Valentine's Day gift.",
  },
  {
    mood: 'Elegant',
    occasion: "Valentine's Day",
    allowedCategories: ['accessories', 'electronics'],
    keywords: ['leather', 'premium', 'sunglasses', 'smart'],
    budgetMultiplier: 0.9,
    explanation: 'An elegant expression of your affection this Valentine\'s Day.',
  },
  {
    mood: 'Fun',
    occasion: "Valentine's Day",
    allowedCategories: ['accessories', 'sports', 'home'],
    keywords: ['sunglasses', 'yoga', 'coffee'],
    budgetMultiplier: 0.7,
    explanation: "A fun and playful gift to celebrate Valentine's Day together!",
  },

  // MOTHER'S DAY COMBINATIONS
  {
    mood: 'Thoughtful',
    occasion: "Mother's Day",
    allowedCategories: ['home', 'accessories', 'sports'],
    keywords: ['coffee', 'maker', 'yoga', 'mat', 'sunglasses'],
    budgetMultiplier: 0.75,
    explanation: 'A thoughtful gift to show mom how much she means to you.',
  },
  {
    mood: 'Elegant',
    occasion: "Mother's Day",
    allowedCategories: ['accessories', 'home', 'electronics'],
    keywords: ['sunglasses', 'premium', 'coffee', 'smart'],
    budgetMultiplier: 0.85,
    explanation: 'An elegant way to celebrate the amazing mom in your life.',
  },
  {
    mood: 'Relaxed',
    occasion: "Mother's Day",
    allowedCategories: ['home', 'sports', 'accessories'],
    keywords: ['coffee', 'yoga', 'mat', 'sunglasses'],
    budgetMultiplier: 0.7,
    explanation: 'Help mom relax and unwind with this perfect Mother\'s Day gift.',
  },

  // FATHER'S DAY COMBINATIONS
  {
    mood: 'Professional',
    occasion: "Father's Day",
    allowedCategories: ['accessories', 'electronics', 'home'],
    keywords: ['wallet', 'leather', 'coffee', 'laptop', 'backpack'],
    budgetMultiplier: 0.85,
    explanation: 'A professional gift that dad will use and appreciate every day.',
  },
  {
    mood: 'Adventurous',
    occasion: "Father's Day",
    allowedCategories: ['sports', 'accessories', 'electronics'],
    keywords: ['running', 'backpack', 'sunglasses', 'watch'],
    budgetMultiplier: 0.8,
    explanation: 'Perfect for the adventurous dad who loves staying active!',
  },
  {
    mood: 'Casual',
    occasion: "Father's Day",
    allowedCategories: ['accessories', 'home', 'sports'],
    keywords: ['wallet', 'coffee', 'sunglasses', 'backpack'],
    budgetMultiplier: 0.7,
    explanation: 'A casual and practical gift for everyday use.',
  },

  // JUST BECAUSE COMBINATIONS
  {
    mood: 'Fun',
    occasion: 'Just Because',
    allowedCategories: ['sports', 'accessories', 'home'],
    keywords: ['yoga', 'sunglasses', 'coffee', 'running'],
    budgetMultiplier: 0.6,
    explanation: 'A fun surprise gift to brighten someone\'s day!',
  },
  {
    mood: 'Casual',
    occasion: 'Just Because',
    allowedCategories: ['accessories', 'home', 'sports'],
    keywords: ['wallet', 'coffee', 'mat', 'sunglasses'],
    budgetMultiplier: 0.6,
    explanation: 'A casual gift to show you\'re thinking of them.',
  },
  {
    mood: 'Energetic',
    occasion: 'Just Because',
    allowedCategories: ['sports', 'electronics', 'accessories'],
    keywords: ['running', 'shoes', 'watch', 'yoga', 'wireless'],
    budgetMultiplier: 0.7,
    explanation: 'An energetic surprise to motivate and inspire!',
  },

  // THANK YOU COMBINATIONS
  {
    mood: 'Thoughtful',
    occasion: 'Thank You',
    allowedCategories: ['home', 'accessories'],
    keywords: ['coffee', 'maker', 'leather', 'wallet'],
    budgetMultiplier: 0.7,
    explanation: 'A thoughtful way to express your sincere gratitude.',
  },
  {
    mood: 'Elegant',
    occasion: 'Thank You',
    allowedCategories: ['accessories', 'home'],
    keywords: ['leather', 'premium', 'sunglasses', 'coffee'],
    budgetMultiplier: 0.8,
    explanation: 'An elegant token of appreciation for their kindness.',
  },
  {
    mood: 'Professional',
    occasion: 'Thank You',
    allowedCategories: ['accessories', 'electronics', 'home'],
    keywords: ['wallet', 'leather', 'coffee', 'laptop', 'backpack'],
    budgetMultiplier: 0.75,
    explanation: 'A professional way to say thank you for their support.',
  },

  // CATCH-ALL COMBINATIONS (for unlisted mood/occasion pairs)
  {
    mood: 'Relaxed',
    occasion: 'Birthday',
    allowedCategories: ['home', 'sports', 'accessories'],
    keywords: ['coffee', 'yoga', 'sunglasses'],
    budgetMultiplier: 0.7,
    explanation: 'A relaxing gift perfect for unwinding on their birthday.',
  },
  {
    mood: 'Casual',
    occasion: 'Anniversary',
    allowedCategories: ['accessories', 'home'],
    keywords: ['wallet', 'coffee', 'sunglasses'],
    budgetMultiplier: 0.7,
    explanation: 'A casual yet meaningful anniversary gift.',
  },
  {
    mood: 'Energetic',
    occasion: 'Graduation',
    allowedCategories: ['sports', 'electronics'],
    keywords: ['running', 'watch', 'wireless', 'yoga'],
    budgetMultiplier: 0.75,
    explanation: 'An energetic gift to kickstart their next adventure!',
  },
];

/**
 * Find the best matching mood configuration
 */
export function findMoodConfig(mood: string, occasion: string): MoodConfig | null {
  // Try exact match first
  const exactMatch = MOOD_CONFIGURATIONS.find(
    (config) => 
      config.mood.toLowerCase() === mood.toLowerCase() && 
      config.occasion.toLowerCase() === occasion.toLowerCase()
  );
  
  if (exactMatch) {
    return exactMatch;
  }

  // Try mood-only match for the occasion
  const moodMatch = MOOD_CONFIGURATIONS.find(
    (config) => config.occasion.toLowerCase() === occasion.toLowerCase()
  );

  // If we have a mood match for the occasion, use it
  if (moodMatch) {
    return moodMatch;
  }

  // Last resort: return a generic configuration
  return {
    mood: mood,
    occasion: occasion,
    allowedCategories: ['electronics', 'accessories', 'home', 'sports', 'clothing'],
    keywords: [],
    budgetMultiplier: 0.7,
    explanation: `A great choice for ${occasion.toLowerCase()} that matches your ${mood.toLowerCase()} mood!`,
  };
}
