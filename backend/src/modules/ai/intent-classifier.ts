/**
 * SHOPPING ASSISTANT - INTENT CLASSIFICATION & CONTEXT EXTRACTION
 * 
 * This module analyzes user messages to understand:
 * - What they want (intent)
 * - Shopping criteria (budget, category, use-case)
 * - Preferences (style, features, etc.)
 * 
 * NO AI APIs - pure rule-based natural language understanding
 */

export interface UserContext {
  budget?: {
    min: number;
    max: number;
  };
  categories?: string[];
  useCase?: string;
  preferences?: string[];
  bodyType?: string;
  priceRange?: 'budget' | 'mid' | 'premium';
}

export enum Intent {
  PRODUCT_SEARCH = 'product_search',        // "show me laptops"
  RECOMMENDATION = 'recommendation',         // "what should I buy for college?"
  BUDGET_FILTER = 'budget_filter',          // "best laptop under 50000"
  COMPARISON = 'comparison',                // "compare X vs Y"
  STYLE_ADVICE = 'style_advice',            // "what suits me?" (clothing)
  GENERAL_HELP = 'general_help',            // "help me choose"
  OFF_TOPIC = 'off_topic',                  // unrelated to shopping
  GREETING = 'greeting',                    // "hi", "hello"
}

export interface ClassifiedIntent {
  intent: Intent;
  context: UserContext;
  originalQuery: string;
  confidence: number;
}

/**
 * Classify user intent and extract shopping context
 */
export function classifyIntent(message: string): ClassifiedIntent {
  const normalized = message.toLowerCase().trim();
  const context: UserContext = {};

  // Extract budget if mentioned
  const budget = extractBudget(normalized);
  if (budget) {
    context.budget = budget;
  }

  // Extract categories
  const categories = extractCategories(normalized);
  if (categories.length > 0) {
    context.categories = categories;
  }

  // Extract use case
  const useCase = extractUseCase(normalized);
  if (useCase) {
    context.useCase = useCase;
  }

  // Extract preferences
  const preferences = extractPreferences(normalized);
  if (preferences.length > 0) {
    context.preferences = preferences;
  }

  // Extract body type for clothing
  const bodyType = extractBodyType(normalized);
  if (bodyType) {
    context.bodyType = bodyType;
  }

  // Determine intent
  let intent = Intent.GENERAL_HELP;
  let confidence = 0.5;

  // Check for greetings
  if (isGreeting(normalized)) {
    intent = Intent.GREETING;
    confidence = 0.95;
  }
  // Check for style/clothing advice
  else if (isStyleAdvice(normalized)) {
    intent = Intent.STYLE_ADVICE;
    confidence = 0.9;
  }
  // Check for budget-focused queries
  else if (budget && hasBudgetKeywords(normalized)) {
    intent = Intent.BUDGET_FILTER;
    confidence = 0.9;
  }
  // Check for comparison
  else if (isComparison(normalized)) {
    intent = Intent.COMPARISON;
    confidence = 0.85;
  }
  // Check for product search
  else if (isProductSearch(normalized)) {
    intent = Intent.PRODUCT_SEARCH;
    confidence = 0.8;
  }
  // Check for recommendation request
  else if (isRecommendationRequest(normalized)) {
    intent = Intent.RECOMMENDATION;
    confidence = 0.85;
  }
  // Check if off-topic
  else if (isOffTopic(normalized)) {
    intent = Intent.OFF_TOPIC;
    confidence = 0.7;
  }

  return {
    intent,
    context,
    originalQuery: message,
    confidence,
  };
}

/**
 * Extract budget from message
 * Handles: "under 50000", "below 1000", "around 500", "between 100 and 500"
 */
function extractBudget(text: string): { min: number; max: number } | null {
  // Pattern: under/below X
  const underMatch = text.match(/(?:under|below|less than|up to)\s*(?:rs\.?|₹|\$)?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i);
  if (underMatch) {
    const max = parseFloat(underMatch[1].replace(/,/g, ''));
    return { min: 0, max };
  }

  // Pattern: around/approximately X
  const aroundMatch = text.match(/(?:around|approximately|about)\s*(?:rs\.?|₹|\$)?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i);
  if (aroundMatch) {
    const target = parseFloat(aroundMatch[1].replace(/,/g, ''));
    return { min: target * 0.8, max: target * 1.2 };
  }

  // Pattern: between X and Y
  const betweenMatch = text.match(/between\s*(?:rs\.?|₹|\$)?\s*(\d+(?:,\d{3})*)\s*(?:and|to)\s*(?:rs\.?|₹|\$)?\s*(\d+(?:,\d{3})*)/i);
  if (betweenMatch) {
    const min = parseFloat(betweenMatch[1].replace(/,/g, ''));
    const max = parseFloat(betweenMatch[2].replace(/,/g, ''));
    return { min, max };
  }

  // Pattern: over/above X
  const overMatch = text.match(/(?:over|above|more than)\s*(?:rs\.?|₹|\$)?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i);
  if (overMatch) {
    const min = parseFloat(overMatch[1].replace(/,/g, ''));
    return { min, max: Infinity };
  }

  return null;
}

/**
 * Extract product categories from message
 */
function extractCategories(text: string): string[] {
  const categories: string[] = [];
  
  const categoryKeywords: { [key: string]: string[] } = {
    electronics: ['laptop', 'computer', 'phone', 'mobile', 'tablet', 'headphone', 'earphone', 'speaker', 'watch', 'smartwatch', 'electronic'],
    clothing: ['shirt', 'pant', 'jeans', 'dress', 'shoe', 'shoes', 'sneaker', 'boot', 'jacket', 'tshirt', 't-shirt', 'clothing', 'wear', 'apparel'],
    accessories: ['bag', 'backpack', 'wallet', 'belt', 'hat', 'cap', 'sunglasses', 'glasses', 'accessory', 'accessories'],
    home: ['furniture', 'chair', 'table', 'lamp', 'bed', 'sofa', 'decor', 'kitchen', 'coffee maker', 'home'],
    sports: ['gym', 'fitness', 'yoga', 'exercise', 'sports', 'athletic', 'workout', 'running'],
  };

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      categories.push(category);
    }
  }

  return categories;
}

/**
 * Extract use case from message
 */
function extractUseCase(text: string): string | null {
  const useCases: { [key: string]: string[] } = {
    college: ['college', 'university', 'student', 'class', 'lecture', 'campus'],
    office: ['office', 'work', 'professional', 'business', 'meeting', 'corporate'],
    gaming: ['gaming', 'game', 'gamer', 'fps', 'esports'],
    fitness: ['gym', 'workout', 'exercise', 'fitness', 'running', 'jogging', 'yoga'],
    travel: ['travel', 'trip', 'vacation', 'journey', 'touring'],
    daily: ['daily', 'everyday', 'regular', 'routine', 'casual'],
    gift: ['gift', 'present', 'birthday', 'anniversary'],
  };

  for (const [useCase, keywords] of Object.entries(useCases)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return useCase;
    }
  }

  return null;
}

/**
 * Extract style preferences
 */
function extractPreferences(text: string): string[] {
  const preferences: string[] = [];
  
  const preferenceKeywords = [
    'slim', 'slim-fit', 'loose', 'comfortable', 'tight',
    'lightweight', 'heavy-duty', 'durable', 'premium',
    'budget', 'cheap', 'affordable', 'expensive',
    'stylish', 'elegant', 'casual', 'formal',
    'colorful', 'dark', 'bright', 'minimalist',
    'wireless', 'noise-canceling', 'waterproof',
    'performance', 'fast', 'powerful', 'efficient',
  ];

  for (const pref of preferenceKeywords) {
    if (text.includes(pref)) {
      preferences.push(pref);
    }
  }

  return preferences;
}

/**
 * Extract body type for clothing recommendations
 */
function extractBodyType(text: string): string | null {
  if (text.match(/overweight|heavy|plus.?size|big|larger/i)) {
    return 'plus-size';
  }
  if (text.match(/slim|skinny|thin|lean/i)) {
    return 'slim';
  }
  if (text.match(/athletic|fit|muscular/i)) {
    return 'athletic';
  }
  if (text.match(/average|regular|normal/i)) {
    return 'regular';
  }
  return null;
}

/**
 * Check if message is a greeting
 */
function isGreeting(text: string): boolean {
  const greetings = [
    'hi', 'hello', 'hey', 'greetings', 'good morning',
    'good afternoon', 'good evening', 'sup', 'whats up',
    'how are you', 'hola', 'namaste',
  ];
  return greetings.some(g => text === g || text.startsWith(g + ' '));
}

/**
 * Check if asking for style/clothing advice
 */
function isStyleAdvice(text: string): boolean {
  const stylePatterns = [
    /what (should|would|will|can) (i|I) wear/,
    /what suits? (me|my)/,
    /what (looks?|fits?) (good|best|better)/,
    /suggest.*(?:clothing|outfit|dress|wear)/,
    /recommend.*(?:clothing|outfit|dress|style)/,
    /body type/,
    /overweight.*(?:wear|suit|look)/,
  ];
  return stylePatterns.some(pattern => pattern.test(text));
}

/**
 * Check if budget-focused query
 */
function hasBudgetKeywords(text: string): boolean {
  return /best.*(?:under|below|within|for)/.test(text) ||
         /show.*(?:under|below|within)/.test(text) ||
         /budget/.test(text);
}

/**
 * Check if comparison request
 */
function isComparison(text: string): boolean {
  return /compare|versus|vs\.?|difference between|better than/.test(text);
}

/**
 * Check if product search
 */
function isProductSearch(text: string): boolean {
  const searchPatterns = [
    /show (me )?(?:all |some )?(?:the )?/,
    /list (all |some )?(?:the )?/,
    /find (me )?(?:some |a )?/,
    /looking for/,
    /search for/,
    /need (?:a|an|some)/,
    /want (?:to buy|a|an|some)/,
  ];
  return searchPatterns.some(pattern => pattern.test(text));
}

/**
 * Check if recommendation request
 */
function isRecommendationRequest(text: string): boolean {
  const recPatterns = [
    /what should (i|I)/,
    /recommend(?:ation)?/,
    /suggest(?:ion)?/,
    /advice/,
    /help (me )?(?:choose|pick|select|find)/,
    /which (?:one|is best)/,
    /best (?:option|choice)/,
  ];
  return recPatterns.some(pattern => pattern.test(text));
}

/**
 * Check if message is off-topic (not shopping related)
 */
function isOffTopic(text: string): boolean {
  const offTopicKeywords = [
    'weather', 'news', 'politics', 'recipe', 'cook',
    'medical', 'doctor', 'medicine', 'symptom', 'disease',
    'legal', 'lawyer', 'law', 'court',
    'math', 'calculate', 'solve', 'equation',
    'write essay', 'homework', 'assignment',
    'tell me about', 'explain',
    'joke', 'story', 'poem',
  ];

  // Check if contains off-topic keywords AND no shopping keywords
  const hasOffTopicKeyword = offTopicKeywords.some(keyword => text.includes(keyword));
  const hasShoppingKeyword = text.match(/buy|shop|product|price|cost|purchase|recommend|suggest/);
  
  return hasOffTopicKeyword && !hasShoppingKeyword;
}
