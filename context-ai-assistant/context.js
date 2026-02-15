/**
 * KNOWLEDGE BASE
 * This is the ONLY source of truth for the AI assistant.
 * All responses must come from this context - no hallucinations allowed.
 * 
 * Each entry contains:
 * - id: unique identifier
 * - title: short description of the topic
 * - keywords: array of terms that trigger this response
 * - content: the actual response text
 */

const knowledgeBase = [
  {
    id: 1,
    title: "About the Website",
    keywords: ["website", "platform", "what is this", "about", "site", "application"],
    content: "This is an e-commerce platform where you can browse and purchase a wide variety of products. We offer a seamless shopping experience with secure payments and fast delivery."
  },
  {
    id: 2,
    title: "How to Shop",
    keywords: ["shop", "buy", "purchase", "order", "how to buy", "shopping"],
    content: "Shopping is easy! Browse our products, add items to your cart, proceed to checkout, and complete your purchase. You can track your order status from your profile."
  },
  {
    id: 3,
    title: "Payment Methods",
    keywords: ["payment", "pay", "credit card", "debit card", "payment methods", "billing"],
    content: "We accept all major credit and debit cards, including Visa, Mastercard, and American Express. All transactions are secured with industry-standard encryption."
  },
  {
    id: 4,
    title: "Shipping Information",
    keywords: ["shipping", "delivery", "ship", "arrive", "when will", "tracking"],
    content: "We offer standard shipping (5-7 business days) and express shipping (2-3 business days). Once your order ships, you'll receive a tracking number via email."
  },
  {
    id: 5,
    title: "Returns and Refunds",
    keywords: ["return", "refund", "exchange", "money back", "cancel order"],
    content: "You can return most items within 30 days of delivery for a full refund. Items must be unused and in original packaging. Contact our support team to initiate a return."
  },
  {
    id: 6,
    title: "Account Creation",
    keywords: ["account", "register", "sign up", "create account", "profile"],
    content: "Creating an account is free and easy! Click the 'Register' button, fill in your details, and you'll be able to track orders, save addresses, and checkout faster."
  },
  {
    id: 7,
    title: "Customer Support",
    keywords: ["support", "help", "contact", "customer service", "assistance"],
    content: "Our customer support team is here to help! You can reach us through the contact form on our website, or email us at support@example.com. We respond within 24 hours."
  },
  {
    id: 8,
    title: "Product Categories",
    keywords: ["categories", "products", "types", "what sell", "items", "catalog"],
    content: "We offer a wide range of products across multiple categories including electronics, fashion, home & garden, sports, and much more. Use the category menu to browse."
  },
  {
    id: 9,
    title: "Security and Privacy",
    keywords: ["security", "privacy", "safe", "secure", "data protection", "personal information"],
    content: "We take your privacy seriously. Your personal information is encrypted and never shared with third parties. We comply with all data protection regulations."
  },
  {
    id: 10,
    title: "Discounts and Promotions",
    keywords: ["discount", "sale", "promo", "coupon", "deal", "offer"],
    content: "We regularly offer discounts and promotions! Sign up for our newsletter to receive exclusive deals and be the first to know about upcoming sales."
  },
  {
    id: 11,
    title: "Greeting",
    keywords: ["hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening"],
    content: "Hello! I'm here to help you with any questions about our e-commerce platform. Feel free to ask me anything about shopping, shipping, returns, or our services!"
  },
  {
    id: 12,
    title: "Gratitude Response",
    keywords: ["thank", "thanks", "appreciate", "grateful"],
    content: "You're very welcome! I'm happy to help. If you have any other questions, feel free to ask!"
  }
];

// Export the knowledge base
// In browser, this will be available globally
if (typeof module !== 'undefined' && module.exports) {
  module.exports = knowledgeBase;
}
