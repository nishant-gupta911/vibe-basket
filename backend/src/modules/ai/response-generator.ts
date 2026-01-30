/**
 * RESPONSE GENERATOR
 * 
 * Generates natural, conversational responses for the shopping assistant.
 * Creates context-aware, helpful replies that feel like ChatGPT
 * but stay grounded in the product catalog.
 * 
 * NO AI APIs - template-based with smart variations
 */

import { Intent, UserContext } from './intent-classifier';
import { ScoredProduct } from './product-ranker';

/**
 * Generate a natural conversational response
 */
export function generateResponse(
  intent: Intent,
  context: UserContext,
  products: ScoredProduct[],
  query: string
): string {
  switch (intent) {
    case Intent.GREETING:
      return generateGreeting();
    
    case Intent.OFF_TOPIC:
      return generateOffTopicResponse();
    
    case Intent.STYLE_ADVICE:
      return generateStyleAdvice(context, products);
    
    case Intent.BUDGET_FILTER:
      return generateBudgetResponse(context, products);
    
    case Intent.RECOMMENDATION:
      return generateRecommendation(context, products, query);
    
    case Intent.PRODUCT_SEARCH:
      return generateSearchResponse(context, products);
    
    case Intent.COMPARISON:
      return generateComparisonResponse(products);
    
    case Intent.GENERAL_HELP:
    default:
      return generateGeneralHelp(context, products);
  }
}

/**
 * Generate greeting response
 */
function generateGreeting(): string {
  const greetings = [
    "Hi there! 👋 I'm your shopping assistant. What can I help you find today?",
    "Hello! I'm here to help you discover great products. What are you looking for?",
    "Hey! Ready to find something amazing? Tell me what you need!",
    "Hi! I can help you choose the perfect products. What's on your shopping list?",
  ];
  return randomChoice(greetings);
}

/**
 * Generate off-topic response
 */
function generateOffTopicResponse(): string {
  return "I'm your shopping assistant, so I can help you choose products or find options available on this website. What would you like to shop for today?";
}

/**
 * Generate style advice response (for body type queries)
 */
function generateStyleAdvice(
  context: UserContext,
  products: ScoredProduct[]
): string {
  if (products.length === 0) {
    return "I'd love to help you find something that suits you! Could you tell me more about what category you're interested in? (clothing, accessories, etc.)";
  }

  let response = '';

  // Personalized opening based on body type
  if (context.bodyType === 'plus-size') {
    response = "For a comfortable and flattering fit, I recommend focusing on relaxed styles. ";
  } else if (context.bodyType === 'slim') {
    response = "Tailored and fitted styles would complement your build really well. ";
  } else if (context.bodyType === 'athletic') {
    response = "You'd look great in performance-oriented fits that highlight your physique. ";
  } else {
    response = "Based on your preferences, ";
  }

  // Add product recommendations
  if (products.length === 1) {
    const product = products[0];
    response += `I think the **${product.product.title}** would be perfect for you`;
    if (product.reasons.length > 0) {
      response += ` - it's ${product.reasons[0]}`;
    }
    response += `. Priced at $${product.product.price.toFixed(2)}.`;
  } else {
    response += `here are ${products.length} great options that would suit you:\n\n`;
    products.slice(0, 3).forEach((item, index) => {
      response += `${index + 1}. **${item.product.title}** ($${item.product.price.toFixed(2)})`;
      if (item.reasons.length > 0) {
        response += ` - ${item.reasons[0]}`;
      }
      response += '\n';
    });
  }

  return response.trim();
}

/**
 * Generate budget-focused response
 */
function generateBudgetResponse(
  context: UserContext,
  products: ScoredProduct[]
): string {
  if (!context.budget) {
    return "I can help you find great options within your budget! Could you let me know your price range?";
  }

  const budgetText = context.budget.max === Infinity
    ? `over $${context.budget.min}`
    : `under $${context.budget.max}`;

  if (products.length === 0) {
    return `I couldn't find products ${budgetText} that match your criteria. Would you like to adjust your budget or look at different categories?`;
  }

  let response = `Great! Here are the best options ${budgetText}:\n\n`;

  products.slice(0, 4).forEach((item, index) => {
    response += `${index + 1}. **${item.product.title}** - $${item.product.price.toFixed(2)}`;
    if (item.reasons.length > 0) {
      response += `\n   ${capitalize(item.reasons[0])}`;
    }
    response += '\n\n';
  });

  response += `These ${products.length > 1 ? 'are all' : 'are'} solid choices within your budget!`;

  return response.trim();
}

/**
 * Generate recommendation response
 */
function generateRecommendation(
  context: UserContext,
  products: ScoredProduct[],
  query: string
): string {
  if (products.length === 0) {
    // Ask clarifying question
    if (!context.budget && !context.categories) {
      return "I'd love to help you choose! To give you the best recommendations, could you tell me:\n- What's your budget?\n- What category are you interested in? (electronics, clothing, accessories, etc.)";
    }
    return "I don't have products matching those exact criteria. Would you like to see similar options or adjust your preferences?";
  }

  let response = '';

  // Context-aware opening
  if (context.useCase) {
    response = `For ${context.useCase} use, `;
  } else if (context.budget) {
    response = `Within your budget, `;
  } else {
    response = 'Based on what you\'re looking for, ';
  }

  // Add recommendations
  if (products.length === 1) {
    const product = products[0];
    response += `I'd recommend the **${product.product.title}**`;
    if (product.reasons.length > 0) {
      response += ` - it's ${product.reasons[0]}`;
    }
    response += `. It's priced at $${product.product.price.toFixed(2)} and usually works really well for most people.`;
  } else {
    response += `here are my top picks:\n\n`;
    products.slice(0, 3).forEach((item, index) => {
      response += `**${index + 1}. ${item.product.title}** ($${item.product.price.toFixed(2)})\n`;
      if (item.reasons.length > 0) {
        response += `   ${capitalize(item.reasons[0])}\n`;
      }
      response += '\n';
    });

    // Add helpful context
    if (products.length > 3) {
      response += `I have ${products.length - 3} more options if you'd like to explore further!`;
    }
  }

  return response.trim();
}

/**
 * Generate product search response
 */
function generateSearchResponse(
  context: UserContext,
  products: ScoredProduct[]
): string {
  if (products.length === 0) {
    let response = "I couldn't find exact matches";
    if (context.categories && context.categories.length > 0) {
      response += ` in the ${context.categories.join(', ')} category`;
    }
    if (context.budget) {
      response += ` within your budget of $${context.budget.max}`;
    }
    response += ". Would you like to see other categories or adjust your filters?";
    return response;
  }

  const categoryText = context.categories && context.categories.length > 0
    ? ` in ${context.categories.join(' & ')}`
    : '';

  let response = `Found ${products.length} great option${products.length > 1 ? 's' : ''}${categoryText}:\n\n`;

  products.slice(0, 5).forEach((item, index) => {
    response += `${index + 1}. **${item.product.title}**\n`;
    response += `   $${item.product.price.toFixed(2)}`;
    if (item.product.description) {
      response += ` - ${item.product.description}`;
    }
    response += '\n\n';
  });

  if (products.length > 5) {
    response += `...and ${products.length - 5} more! Let me know if you want to narrow it down.`;
  }

  return response.trim();
}

/**
 * Generate comparison response
 */
function generateComparisonResponse(products: ScoredProduct[]): string {
  if (products.length === 0) {
    return "I'd be happy to help you compare options! Could you tell me which products or categories you're interested in comparing?";
  }

  if (products.length === 1) {
    return `I only found one matching product. Would you like to see similar alternatives to compare?`;
  }

  let response = "Here's a comparison of your top options:\n\n";

  products.slice(0, 3).forEach((item, index) => {
    response += `**${index + 1}. ${item.product.title}** - $${item.product.price.toFixed(2)}\n`;
    if (item.product.description) {
      response += `   ${item.product.description}\n`;
    }
    if (item.reasons.length > 0) {
      response += `   ✓ ${capitalize(item.reasons[0])}\n`;
    }
    response += '\n';
  });

  // Add comparison insight
  const prices = products.slice(0, 3).map(p => p.product.price);
  const cheapest = Math.min(...prices);
  const mostExpensive = Math.max(...prices);

  if (mostExpensive - cheapest > 50) {
    response += `💡 Price-wise, there's a ${((mostExpensive - cheapest) / cheapest * 100).toFixed(0)}% difference between the lowest and highest option. `;
    response += "Consider what features matter most to you!";
  }

  return response.trim();
}

/**
 * Generate general help response
 */
function generateGeneralHelp(
  context: UserContext,
  products: ScoredProduct[]
): string {
  if (products.length === 0) {
    return "I'm here to help you find the perfect products! You can ask me things like:\n" +
           "- 'Show me laptops under $1000'\n" +
           "- 'What should I buy for college?'\n" +
           "- 'Best running shoes for daily use'\n\n" +
           "What are you shopping for today?";
  }

  let response = "Based on what you mentioned, here are some options:\n\n";

  products.slice(0, 3).forEach((item, index) => {
    response += `${index + 1}. **${item.product.title}** ($${item.product.price.toFixed(2)})\n`;
    if (item.reasons.length > 0) {
      response += `   ${capitalize(item.reasons[0])}\n`;
    }
    response += '\n';
  });

  response += "Need help narrowing it down? Let me know your budget or specific preferences!";

  return response.trim();
}

/**
 * Capitalize first letter of string
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Get random choice from array
 */
function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
