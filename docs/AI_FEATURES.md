# AI Features Documentation

## Overview
Phase 4 adds intelligent AI-powered features to the e-commerce platform using OpenAI's GPT-4o-mini and text-embedding-3-small models, along with PostgreSQL's pgvector extension for semantic search.

## Features

### 1. Shopping Assistant Chatbot
**Route:** `/chatbot`  
**API Endpoint:** `POST /api/ai/chat`

An intelligent shopping assistant that helps users find products through natural language conversations.

**Features:**
- Natural language product queries
- Context-aware responses with conversation history
- Direct product recommendations with links
- Real-time chat interface with loading states

**Request:**
```json
{
  "message": "I need a gift for my mom",
  "history": [
    {
      "role": "user",
      "content": "Previous message"
    },
    {
      "role": "assistant",
      "content": "Previous response"
    }
  ]
}
```

**Response:**
```json
{
  "reply": "I'd recommend checking out...",
  "productIds": ["prod_123", "prod_456"]
}
```

### 2. Mood-Based Product Recommender
**Route:** `/mood`  
**API Endpoint:** `POST /api/ai/mood`

Suggests products based on occasion, mood, budget, and personal preferences using AI reasoning.

**Features:**
- Occasion-aware recommendations
- Mood and context analysis
- Budget-conscious suggestions
- Personalized reasoning for each product
- Direct add-to-cart functionality

**Request:**
```json
{
  "occasion": "Birthday party",
  "mood": "Happy and celebratory",
  "budget": 150,
  "gender": "female",
  "age": 25
}
```

**Response:**
```json
{
  "suggestions": [
    {
      "productId": "prod_123",
      "reason": "This elegant dress is perfect for a birthday celebration...",
      "product": {
        "id": "prod_123",
        "title": "Elegant Party Dress",
        "price": 89.99,
        "image": "url",
        "category": "Fashion"
      }
    }
  ]
}
```

### 3. Semantic Product Search
**API Endpoint:** `POST /api/ai/semantic-search`

Search products using natural language with vector similarity matching.

**Request:**
```json
{
  "query": "comfortable shoes for walking",
  "limit": 10
}
```

**Response:**
```json
{
  "products": [...]
}
```

### 4. Product Embedding System
**API Endpoint:** `POST /api/ai/embed-products`  
**Access:** Authenticated users only

Generates and stores vector embeddings for all products to enable semantic search.

**Response:**
```json
{
  "message": "Products embedded successfully",
  "embedded": 50,
  "total": 50
}
```

## Technical Implementation

### Backend Architecture

**Stack:**
- NestJS controllers and services
- OpenAI SDK for LLM and embeddings
- pgvector extension for vector similarity
- PostgreSQL with vector column (1536 dimensions)

**Services:**
- `embedding.service.ts` - Handles OpenAI embedding generation
- `chatbot.service.ts` - Chat logic and semantic search
- `recommendation.service.ts` - Mood-based recommendations
- `ai.controller.ts` - API endpoints

**Key Technologies:**
- **OpenAI Models:**
  - `gpt-4o-mini` for chat completions
  - `text-embedding-3-small` for embeddings (1536d)
- **pgvector:** PostgreSQL extension for vector similarity search
- **Cosine Distance:** Used for similarity calculations

### Database Schema Changes

Added to `Product` model:
```prisma
model Product {
  // ... existing fields
  embedding Unsupported("vector(1536)")?
}
```

Migration: `20260115160741_add_vector_support`

### Frontend Components

**Chatbot Page (`/chatbot`):**
- Real-time chat interface
- Message history with role-based styling
- Product recommendation cards
- Auto-scroll to latest message
- Loading indicators

**Mood Finder Page (`/mood`):**
- Multi-field form (occasion, mood, budget, gender, age)
- Product suggestion cards with AI reasoning
- Direct add-to-cart functionality
- Responsive grid layout

**Navigation Updates:**
- Added "AI Assistant" link to navbar
- Added "Mood Finder" link to navbar
- Mobile menu support

## Environment Variables

Add to `backend/.env`:
```env
OPENAI_API_KEY=your-openai-api-key-here
AI_MODEL=gpt-4o-mini
EMBEDDING_MODEL=text-embedding-3-small
```

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install openai pgvector
```

### 2. Update Database
```bash
cd backend
npx prisma migrate dev --name add_vector_support
```

### 3. Configure OpenAI
Add your OpenAI API key to `backend/.env`

### 4. Start Services
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 5. Generate Embeddings
After products are seeded, generate embeddings:
```bash
curl -X POST http://localhost:4000/api/ai/embed-products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Usage Examples

### Using the Chatbot
1. Navigate to `/chatbot`
2. Ask natural questions:
   - "Show me affordable laptops"
   - "I need a gift for my tech-savvy friend"
   - "What's on sale in electronics?"
3. Click product links to view details

### Using Mood Finder
1. Navigate to `/mood`
2. Fill out the form:
   - Occasion: "Date night"
   - Mood: "Romantic"
   - Budget: 200
   - Gender: Female
   - Age: 28
3. View AI-generated suggestions with personalized reasoning
4. Add products directly to cart or view details

## API Testing

### Test Chatbot
```bash
curl -X POST http://localhost:4000/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT" \
  -d '{
    "message": "Show me electronics under $500"
  }'
```

### Test Mood Recommender
```bash
curl -X POST http://localhost:4000/api/ai/mood \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT" \
  -d '{
    "occasion": "Gym workout",
    "mood": "Energetic",
    "budget": 100
  }'
```

### Test Semantic Search
```bash
curl -X POST http://localhost:4000/api/ai/semantic-search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT" \
  -d '{
    "query": "wireless headphones for running",
    "limit": 5
  }'
```

## Performance Considerations

1. **Rate Limits:** OpenAI API has rate limits. Embedding generation batches requests (10 per batch with 1s delay)

2. **Caching:** Consider implementing Redis cache for frequent queries

3. **Vector Index:** pgvector automatically creates HNSW index for fast similarity search

4. **Costs:** 
   - gpt-4o-mini: ~$0.15 per 1M input tokens
   - text-embedding-3-small: ~$0.02 per 1M tokens

## Error Handling

All endpoints include:
- Authentication validation (JWT required)
- Input validation with meaningful error messages
- Graceful fallback for AI failures
- Detailed console logging for debugging

## Future Enhancements

- [ ] Add product review sentiment analysis
- [ ] Implement personalized recommendations based on order history
- [ ] Add image-based product search
- [ ] Create admin dashboard for AI analytics
- [ ] Add multi-language support
- [ ] Implement conversation memory persistence

## Troubleshooting

**Issue:** Vector extension not installed
```bash
# Solution: Run migration
npx prisma migrate dev
```

**Issue:** OpenAI API errors
```bash
# Check API key is set
echo $OPENAI_API_KEY

# Verify in .env file
cat backend/.env | grep OPENAI
```

**Issue:** No product recommendations
```bash
# Generate embeddings first
curl -X POST http://localhost:4000/api/ai/embed-products \
  -H "Authorization: Bearer YOUR_JWT"
```

## Security Notes

- All AI endpoints require JWT authentication
- API keys stored in environment variables (never committed)
- Input validation on all endpoints
- Rate limiting recommended for production
- User context isolation in conversations

## Commit
```bash
git add -A
git commit -m "Phase 4: AI chatbot + mood recommendation system"
git push origin main
```

---

**Phase 4 Complete** ✅
- Shopping assistant chatbot with semantic search
- Mood-based product recommendations
- pgvector integration
- OpenAI GPT-4o-mini and embeddings
- Full frontend UI with chat and mood pages
- All existing features preserved
