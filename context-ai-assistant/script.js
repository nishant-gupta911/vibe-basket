/**
 * CONTEXT-ONLY AI ASSISTANT
 * This is NOT a real AI/LLM - it's a rule-based assistant
 * that matches user input against predefined context.
 * 
 * NO external APIs, NO network calls, NO AI models.
 * All intelligence comes from the context.js knowledge base.
 */

// Chat state
let chatHistory = [];

// Minimum score threshold for a valid response
const CONFIDENCE_THRESHOLD = 0.3;

// Minimum input length
const MIN_INPUT_LENGTH = 2;

/**
 * Initialize the chat interface
 */
function initChat() {
  const sendButton = document.getElementById('send-button');
  const userInput = document.getElementById('user-input');
  const chatMessages = document.getElementById('chat-messages');

  // Send message on button click
  sendButton.addEventListener('click', handleSendMessage);

  // Send message on Enter key (but not Shift+Enter)
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  });

  // Show welcome message
  addBotMessage("Hello! I'm your shopping assistant. How can I help you today?");
}

/**
 * Handle sending a message
 */
function handleSendMessage() {
  const userInput = document.getElementById('user-input');
  const message = userInput.value.trim();

  // Ignore empty messages
  if (!message) {
    return;
  }

  // Check minimum length
  if (message.length < MIN_INPUT_LENGTH) {
    userInput.value = '';
    addUserMessage(message);
    addBotMessage("Could you please provide a bit more detail? I'd be happy to help!");
    return;
  }

  // Add user message to chat
  addUserMessage(message);
  userInput.value = '';

  // Process the message and get response
  const response = processMessage(message);

  // Add bot response with slight delay for natural feel
  setTimeout(() => {
    addBotMessage(response);
  }, 500);
}

/**
 * Process user message and generate response
 * This is where the "AI" logic happens (keyword matching + scoring)
 */
function processMessage(userMessage) {
  // Normalize the input
  const normalizedInput = normalizeText(userMessage);
  const inputWords = normalizedInput.split(' ').filter(word => word.length > 0);

  // Score each context item
  const scoredItems = knowledgeBase.map(item => {
    const score = calculateScore(normalizedInput, inputWords, item);
    return { ...item, score };
  });

  // Sort by score (highest first)
  scoredItems.sort((a, b) => b.score - a.score);

  // Get the best match
  const bestMatch = scoredItems[0];

  // If score is above threshold, return the content
  if (bestMatch.score >= CONFIDENCE_THRESHOLD) {
    return bestMatch.content;
  }

  // No good match found
  return "I don't have information about that.";
}

/**
 * Calculate relevance score for a context item
 * Uses multiple scoring strategies:
 * - Exact keyword matches
 * - Partial keyword matches
 * - Word overlap ratio
 */
function calculateScore(normalizedInput, inputWords, contextItem) {
  let score = 0;

  // Normalize keywords
  const keywords = contextItem.keywords.map(kw => normalizeText(kw));

  // Strategy 1: Exact keyword match in input (highest weight)
  for (const keyword of keywords) {
    if (normalizedInput.includes(keyword)) {
      score += 1.0;
    }
  }

  // Strategy 2: Partial keyword matches (medium weight)
  for (const keyword of keywords) {
    const keywordWords = keyword.split(' ');
    for (const kw of keywordWords) {
      if (kw.length > 2 && normalizedInput.includes(kw)) {
        score += 0.5;
      }
    }
  }

  // Strategy 3: Word overlap ratio (lower weight)
  const contextWords = keywords.join(' ').split(' ');
  let overlaps = 0;
  for (const word of inputWords) {
    if (word.length > 2 && contextWords.some(cw => cw.includes(word) || word.includes(cw))) {
      overlaps++;
    }
  }
  const overlapRatio = overlaps / Math.max(inputWords.length, 1);
  score += overlapRatio * 0.3;

  return score;
}

/**
 * Normalize text for comparison
 * - Lowercase
 * - Remove punctuation
 * - Trim whitespace
 * - Remove extra spaces
 */
function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .replace(/\s+/g, ' ')      // Collapse multiple spaces
    .trim();
}

/**
 * Add user message to chat UI
 */
function addUserMessage(message) {
  const chatMessages = document.getElementById('chat-messages');
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message user-message';
  messageDiv.textContent = message;
  chatMessages.appendChild(messageDiv);
  scrollToBottom();

  // Add to history
  chatHistory.push({ role: 'user', content: message });
}

/**
 * Add bot message to chat UI
 */
function addBotMessage(message) {
  const chatMessages = document.getElementById('chat-messages');
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message bot-message';
  messageDiv.textContent = message;
  chatMessages.appendChild(messageDiv);
  scrollToBottom();

  // Add to history
  chatHistory.push({ role: 'bot', content: message });
}

/**
 * Scroll chat to bottom
 */
function scrollToBottom() {
  const chatMessages = document.getElementById('chat-messages');
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initChat);
