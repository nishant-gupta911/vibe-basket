/**
 * MOOD-BASED SHOPPING STYLIST - INTENT PROFILES
 * 
 * Single source of truth for mood → shopping intent translation.
 * Converts human feelings into actionable product recommendations.
 * 
 * This is NOT an AI - it's a smart decision helper using rules and heuristics.
 */

/**
 * MoodProfile: Maps user mood/occasion to shopping intent
 */
export interface MoodProfile {
  mood: string;
  occasion: string;
  intentTags: string[];           // Tags that describe what this mood means
  avoidTags?: string[];            // Tags to avoid for this mood
  preferredCategories: string[];   // Categories that fit this mood
  budgetStrategy: 'conservative' | 'moderate' | 'premium'; // How to use the budget
  explanationTemplate: string;     // Why this recommendation fits
}

/**
 * Product tags for matching
 * These describe product characteristics and use cases
 */
export const PRODUCT_TAGS = {
  // Style tags
  elegant: ['premium', 'leather', 'quality', 'sophisticated'],
  casual: ['comfortable', 'everyday', 'relaxed', 'simple'],
  professional: ['business', 'formal', 'work', 'office'],
  sporty: ['athletic', 'running', 'fitness', 'gym', 'sport'],
  trendy: ['modern', 'stylish', 'fashion', 'cool'],
  
  // Occasion tags
  gift: ['premium', 'special', 'quality', 'unique'],
  personal: ['practical', 'useful', 'everyday', 'essential'],
  celebration: ['special', 'premium', 'memorable'],
  
  // Emotion tags
  exciting: ['wireless', 'smart', 'tech', 'innovative', 'advanced'],
  romantic: ['premium', 'elegant', 'special', 'quality'],
  thoughtful: ['practical', 'useful', 'quality', 'meaningful'],
  fun: ['colorful', 'playful', 'active', 'energetic'],
  
  // Functional tags
  tech: ['wireless', 'smart', 'electronic', 'digital', 'advanced'],
  comfort: ['comfortable', 'soft', 'ergonomic', 'relaxed'],
  durability: ['durable', 'quality', 'strong', 'lasting'],
  portability: ['portable', 'compact', 'lightweight', 'travel'],
};

/**
 * Budget strategies define how to target the budget
 */
export const BUDGET_STRATEGIES = {
  conservative: 0.6,  // Target 60% of budget (leave room for more)
  moderate: 0.75,     // Target 75% of budget (balanced)
  premium: 0.9,       // Target 90% of budget (splurge)
};

/**
 * MOOD PROFILES - The heart of the shopping stylist
 * Maps human emotions → shopping decisions
 */
export const MOOD_PROFILES: MoodProfile[] = [
  // ========== BIRTHDAY ==========
  {
    mood: 'Excited',
    occasion: 'Birthday',
    intentTags: ['exciting', 'tech', 'trendy', 'celebration'],
    preferredCategories: ['electronics', 'sports', 'accessories'],
    budgetStrategy: 'moderate',
    explanationTemplate: 'This energetic choice will make their birthday extra special and memorable!',
  },
  {
    mood: 'Fun',
    occasion: 'Birthday',
    intentTags: ['fun', 'sporty', 'casual', 'celebration'],
    preferredCategories: ['sports', 'accessories', 'electronics'],
    budgetStrategy: 'conservative',
    explanationTemplate: 'A fun gift that brings joy and celebrates their special day!',
  },
  {
    mood: 'Elegant',
    occasion: 'Birthday',
    intentTags: ['elegant', 'gift', 'romantic', 'trendy'],
    avoidTags: ['sporty', 'casual'],
    preferredCategories: ['accessories', 'electronics'],
    budgetStrategy: 'premium',
    explanationTemplate: 'An elegant choice that shows sophistication and thoughtfulness.',
  },
  {
    mood: 'Relaxed',
    occasion: 'Birthday',
    intentTags: ['comfort', 'casual', 'personal'],
    preferredCategories: ['home', 'sports', 'accessories'],
    budgetStrategy: 'conservative',
    explanationTemplate: 'A relaxing gift perfect for unwinding and enjoying their birthday.',
  },

  // ========== ANNIVERSARY ==========
  {
    mood: 'Romantic',
    occasion: 'Anniversary',
    intentTags: ['romantic', 'elegant', 'gift', 'celebration'],
    avoidTags: ['casual', 'sporty'],
    preferredCategories: ['accessories', 'electronics', 'home'],
    budgetStrategy: 'premium',
    explanationTemplate: 'A romantic gesture that beautifully celebrates your special anniversary together.',
  },
  {
    mood: 'Elegant',
    occasion: 'Anniversary',
    intentTags: ['elegant', 'romantic', 'gift', 'tech'],
    avoidTags: ['casual'],
    preferredCategories: ['accessories', 'electronics'],
    budgetStrategy: 'premium',
    explanationTemplate: 'An elegant anniversary gift that reflects your refined taste and deep appreciation.',
  },
  {
    mood: 'Thoughtful',
    occasion: 'Anniversary',
    intentTags: ['thoughtful', 'personal', 'comfort', 'quality'],
    preferredCategories: ['home', 'accessories', 'electronics'],
    budgetStrategy: 'moderate',
    explanationTemplate: 'A thoughtful choice that shows how much you treasure your relationship.',
  },
  {
    mood: 'Casual',
    occasion: 'Anniversary',
    intentTags: ['casual', 'personal', 'comfort'],
    preferredCategories: ['accessories', 'home'],
    budgetStrategy: 'moderate',
    explanationTemplate: 'A casual yet meaningful way to celebrate your time together.',
  },

  // ========== WEDDING ==========
  {
    mood: 'Elegant',
    occasion: 'Wedding',
    intentTags: ['elegant', 'gift', 'romantic', 'celebration'],
    avoidTags: ['casual', 'sporty'],
    preferredCategories: ['home', 'accessories', 'electronics'],
    budgetStrategy: 'premium',
    explanationTemplate: 'An elegant wedding gift the couple will treasure for years to come.',
  },
  {
    mood: 'Thoughtful',
    occasion: 'Wedding',
    intentTags: ['thoughtful', 'personal', 'comfort', 'durability'],
    preferredCategories: ['home', 'accessories'],
    budgetStrategy: 'moderate',
    explanationTemplate: 'A thoughtful gift perfect for newlyweds starting their journey together.',
  },
  {
    mood: 'Professional',
    occasion: 'Wedding',
    intentTags: ['professional', 'elegant', 'tech', 'durability'],
    preferredCategories: ['home', 'electronics', 'accessories'],
    budgetStrategy: 'premium',
    explanationTemplate: 'A practical yet elegant gift for the modern couple.',
  },

  // ========== GRADUATION ==========
  {
    mood: 'Excited',
    occasion: 'Graduation',
    intentTags: ['exciting', 'tech', 'professional', 'portability'],
    preferredCategories: ['electronics', 'accessories'],
    budgetStrategy: 'moderate',
    explanationTemplate: 'Celebrate their achievement with this exciting tool for their next chapter!',
  },
  {
    mood: 'Professional',
    occasion: 'Graduation',
    intentTags: ['professional', 'tech', 'durability', 'elegant'],
    preferredCategories: ['accessories', 'electronics'],
    budgetStrategy: 'premium',
    explanationTemplate: 'A professional gift to help them succeed in their career journey.',
  },
  {
    mood: 'Adventurous',
    occasion: 'Graduation',
    intentTags: ['fun', 'portability', 'sporty', 'durability'],
    preferredCategories: ['sports', 'accessories', 'electronics'],
    budgetStrategy: 'conservative',
    explanationTemplate: 'Perfect for the adventurous graduate ready to explore new opportunities!',
  },
  {
    mood: 'Energetic',
    occasion: 'Graduation',
    intentTags: ['exciting', 'sporty', 'tech', 'fun'],
    preferredCategories: ['sports', 'electronics'],
    budgetStrategy: 'moderate',
    explanationTemplate: 'An energetic gift to kickstart their exciting new adventure!',
  },

  // ========== CHRISTMAS ==========
  {
    mood: 'Excited',
    occasion: 'Christmas',
    intentTags: ['exciting', 'tech', 'celebration', 'comfort'],
    preferredCategories: ['electronics', 'home', 'sports'],
    budgetStrategy: 'moderate',
    explanationTemplate: 'A festive gift that will bring excitement on Christmas morning!',
  },
  {
    mood: 'Relaxed',
    occasion: 'Christmas',
    intentTags: ['comfort', 'casual', 'personal', 'celebration'],
    preferredCategories: ['home', 'sports', 'accessories'],
    budgetStrategy: 'conservative',
    explanationTemplate: 'Perfect for a cozy and relaxed Christmas celebration at home.',
  },
  {
    mood: 'Thoughtful',
    occasion: 'Christmas',
    intentTags: ['thoughtful', 'comfort', 'personal', 'quality'],
    preferredCategories: ['home', 'accessories', 'electronics'],
    budgetStrategy: 'moderate',
    explanationTemplate: 'A thoughtful Christmas gift that shows you truly care.',
  },

  // ========== VALENTINE'S DAY ==========
  {
    mood: 'Romantic',
    occasion: "Valentine's Day",
    intentTags: ['romantic', 'elegant', 'gift', 'trendy'],
    avoidTags: ['casual', 'sporty'],
    preferredCategories: ['accessories', 'electronics'],
    budgetStrategy: 'premium',
    explanationTemplate: "Express your love with this romantic Valentine's Day gift.",
  },
  {
    mood: 'Elegant',
    occasion: "Valentine's Day",
    intentTags: ['elegant', 'romantic', 'gift', 'tech'],
    avoidTags: ['casual'],
    preferredCategories: ['accessories', 'electronics'],
    budgetStrategy: 'premium',
    explanationTemplate: 'An elegant expression of your affection this Valentine\'s Day.',
  },
  {
    mood: 'Fun',
    occasion: "Valentine's Day",
    intentTags: ['fun', 'casual', 'comfort', 'celebration'],
    preferredCategories: ['accessories', 'sports', 'home'],
    budgetStrategy: 'conservative',
    explanationTemplate: "A fun and playful way to celebrate Valentine's Day together!",
  },

  // ========== MOTHER'S DAY ==========
  {
    mood: 'Thoughtful',
    occasion: "Mother's Day",
    intentTags: ['thoughtful', 'comfort', 'personal', 'quality'],
    preferredCategories: ['home', 'accessories', 'sports'],
    budgetStrategy: 'moderate',
    explanationTemplate: 'A thoughtful gift to show mom how much she means to you.',
  },
  {
    mood: 'Elegant',
    occasion: "Mother's Day",
    intentTags: ['elegant', 'gift', 'trendy', 'comfort'],
    preferredCategories: ['accessories', 'home', 'electronics'],
    budgetStrategy: 'premium',
    explanationTemplate: 'An elegant way to celebrate the amazing mom in your life.',
  },
  {
    mood: 'Relaxed',
    occasion: "Mother's Day",
    intentTags: ['comfort', 'casual', 'personal', 'sporty'],
    preferredCategories: ['home', 'sports', 'accessories'],
    budgetStrategy: 'conservative',
    explanationTemplate: 'Help mom relax and unwind with this perfect Mother\'s Day gift.',
  },

  // ========== FATHER'S DAY ==========
  {
    mood: 'Professional',
    occasion: "Father's Day",
    intentTags: ['professional', 'tech', 'durability', 'elegant'],
    preferredCategories: ['accessories', 'electronics', 'home'],
    budgetStrategy: 'premium',
    explanationTemplate: 'A professional gift that dad will use and appreciate every day.',
  },
  {
    mood: 'Adventurous',
    occasion: "Father's Day",
    intentTags: ['fun', 'sporty', 'portability', 'durability'],
    preferredCategories: ['sports', 'accessories', 'electronics'],
    budgetStrategy: 'moderate',
    explanationTemplate: 'Perfect for the adventurous dad who loves staying active!',
  },
  {
    mood: 'Casual',
    occasion: "Father's Day",
    intentTags: ['casual', 'personal', 'comfort', 'durability'],
    preferredCategories: ['accessories', 'home', 'sports'],
    budgetStrategy: 'conservative',
    explanationTemplate: 'A casual and practical gift for everyday use.',
  },

  // ========== JUST BECAUSE ==========
  {
    mood: 'Fun',
    occasion: 'Just Because',
    intentTags: ['fun', 'casual', 'sporty', 'comfort'],
    preferredCategories: ['sports', 'accessories', 'home'],
    budgetStrategy: 'conservative',
    explanationTemplate: 'A fun surprise gift to brighten someone\'s day!',
  },
  {
    mood: 'Casual',
    occasion: 'Just Because',
    intentTags: ['casual', 'personal', 'comfort'],
    preferredCategories: ['accessories', 'home', 'sports'],
    budgetStrategy: 'conservative',
    explanationTemplate: 'A casual gift to show you\'re thinking of them.',
  },
  {
    mood: 'Energetic',
    occasion: 'Just Because',
    intentTags: ['exciting', 'sporty', 'tech', 'fun'],
    preferredCategories: ['sports', 'electronics', 'accessories'],
    budgetStrategy: 'moderate',
    explanationTemplate: 'An energetic surprise to motivate and inspire!',
  },

  // ========== THANK YOU ==========
  {
    mood: 'Thoughtful',
    occasion: 'Thank You',
    intentTags: ['thoughtful', 'personal', 'comfort', 'quality'],
    preferredCategories: ['home', 'accessories'],
    budgetStrategy: 'moderate',
    explanationTemplate: 'A thoughtful way to express your sincere gratitude.',
  },
  {
    mood: 'Elegant',
    occasion: 'Thank You',
    intentTags: ['elegant', 'gift', 'romantic', 'quality'],
    preferredCategories: ['accessories', 'home'],
    budgetStrategy: 'premium',
    explanationTemplate: 'An elegant token of appreciation for their kindness.',
  },
  {
    mood: 'Professional',
    occasion: 'Thank You',
    intentTags: ['professional', 'elegant', 'durability', 'tech'],
    preferredCategories: ['accessories', 'electronics', 'home'],
    budgetStrategy: 'moderate',
    explanationTemplate: 'A professional way to say thank you for their support.',
  },
];

/**
 * Find matching mood profile
 * Uses exact match or fallback to default
 */
export function findMoodProfile(mood: string, occasion: string): MoodProfile | null {
  // Try exact match first (case-insensitive)
  const exactMatch = MOOD_PROFILES.find(
    (profile) =>
      profile.mood.toLowerCase() === mood.toLowerCase() &&
      profile.occasion.toLowerCase() === occasion.toLowerCase()
  );

  if (exactMatch) {
    return exactMatch;
  }

  // Fallback: find any profile for this occasion
  const occasionMatch = MOOD_PROFILES.find(
    (profile) => profile.occasion.toLowerCase() === occasion.toLowerCase()
  );

  if (occasionMatch) {
    return occasionMatch;
  }

  // Last resort: generic profile
  return {
    mood,
    occasion,
    intentTags: ['personal', 'casual'],
    preferredCategories: ['electronics', 'accessories', 'home', 'sports', 'clothing'],
    budgetStrategy: 'moderate',
    explanationTemplate: `A great choice for ${occasion.toLowerCase()} that matches your ${mood.toLowerCase()} mood!`,
  };
}
