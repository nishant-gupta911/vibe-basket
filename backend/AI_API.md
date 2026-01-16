# AI Features - API Documentation

## Overview
The AI features use OpenAI's GPT-4o-mini for chat and text-embedding-3-small for semantic search.

## Setup

### 1. Get OpenAI API Key
1. Visit https://platform.openai.com/api-keys
2. Create a new API key
3. **Important:** Add credits to your account at https://platform.openai.com/settings/organization/billing

### 2. Configure Environment
```bash
# Edit backend/.env
OPENAI_API_KEY=sk-proj-your-actual-key-here
AI_MODEL=gpt-4o-mini
EMBEDDING_MODEL=text-embedding-3-small
```

### 3. Restart Server
```bash
cd backend
npm run dev
```

## API Endpoints

### 1. AI Chat - `/api/ai/chat` (POST)

**Purpose:** Natural language product search and shopping assistance

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

**Request:**
```json
{
  "message": "Show me affordable electronics under $200",
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

**Response (Success):**
```json
{
  "reply": "I found some great affordable electronics for you! Here are my top recommendations...",
  "productIds": ["prod-id-1", "prod-id-2"]
}
```

**Response (Error - No API Key):**
```json
{
  "statusCode": 500,
  "message": "OpenAI API key is invalid"
}
```

**Response (Error - Quota Exceeded):**
```json
{
  "statusCode": 500,
  "message": "OpenAI API quota exceeded. Please check your billing."
}
```

**Example:**
```bash
TOKEN="your-jwt-token"

curl -X POST http://localhost:4000/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "message": "I need running shoes for marathon training"
  }'
```

### 2. AI Mood Recommendations - `/api/ai/mood` (POST)

**Purpose:** Get personalized product recommendations based on occasion, mood, and budget

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

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

**Required Fields:**
- `occasion` (string) - The event or situation
- `mood` (string) - Current mood or desired feeling
- `budget` (number) - Maximum budget in USD

**Optional Fields:**
- `gender` (string) - "male", "female", or "unisex"
- `age` (number) - User's age

**Response (Success):**
```json
{
  "suggestions": [
    {
      "productId": "prod-123",
      "reason": "This elegant dress is perfect for a birthday celebration and matches your happy mood",
      "product": {
        "id": "prod-123",
        "title": "Elegant Party Dress",
        "price": 89.99,
        "image": "https://...",
        "category": "Fashion"
      }
    }
  ]
}
```

**Response (Error - Invalid Input):**
```json
{
  "statusCode": 400,
  "message": "Occasion, mood, and budget are required"
}
```

**Response (Error - Quota Exceeded):**
```json
{
  "statusCode": 500,
  "message": "OpenAI API quota exceeded. Please check your billing."
}
```

**Example:**
```bash
TOKEN="your-jwt-token"

curl -X POST http://localhost:4000/api/ai/mood \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "occasion": "Job interview",
    "mood": "Confident and professional",
    "budget": 200,
    "gender": "male",
    "age": 30
  }'
```

### 3. Embed Products - `/api/ai/embed-products` (POST)

**Purpose:** Generate vector embeddings for all products (enables semantic search)

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request:** Empty body

**Response:**
```json
{
  "message": "Products embedded successfully",
  "embedded": 50,
  "total": 50
}
```

**Example:**
```bash
TOKEN="your-jwt-token"

curl -X POST http://localhost:4000/api/ai/embed-products \
  -H "Authorization: Bearer $TOKEN"
```

**Note:** This endpoint processes products in batches of 10 with 1-second delays to respect rate limits.

### 4. Semantic Search - `/api/ai/semantic-search` (POST)

**Purpose:** Search products using natural language with vector similarity

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

**Request:**
```json
{
  "query": "comfortable shoes for walking long distances",
  "limit": 10
}
```

**Response:**
```json
{
  "products": [
    {
      "id": "prod-123",
      "title": "Running Shoes",
      "description": "Comfortable athletic shoes",
      "price": 129.99,
      "category": "clothing"
    }
  ]
}
```

**Example:**
```bash
TOKEN="your-jwt-token"

curl -X POST http://localhost:4000/api/ai/semantic-search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "wireless headphones with good battery life",
    "limit": 5
  }'
```

## Error Handling

All AI endpoints return consistent error responses:

### Authentication Errors (401)
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### Validation Errors (400)
```json
{
  "statusCode": 400,
  "message": "Specific validation error message"
}
```

### OpenAI Errors (500)
```json
{
  "statusCode": 500,
  "message": "OpenAI API quota exceeded. Please check your billing."
}
```

OR

```json
{
  "statusCode": 500,
  "message": "OpenAI API key is invalid"
}
```

## Troubleshooting

### "OpenAI API key is invalid"
**Solution:** Check that `OPENAI_API_KEY` in `.env` is correct and starts with `sk-`

### "OpenAI API quota exceeded"
**Solutions:**
1. Visit https://platform.openai.com/settings/organization/billing
2. Add credits to your account
3. Check your usage limits

### No AI response after long wait
**Possible causes:**
- OpenAI API is slow (can take 2-5 seconds)
- Network issues
- Rate limiting

## Cost Estimates

- **Chat (gpt-4o-mini):** ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
- **Embeddings (text-embedding-3-small):** ~$0.02 per 1M tokens
- **Typical chat message:** ~500 tokens (~$0.0003)
- **Embedding 100 products:** ~$0.001

## Rate Limits

OpenAI has the following default limits:
- **Free tier:** Very limited, may have quota issues
- **Paid tier:** Higher limits based on your plan

The system implements batch processing with delays to respect rate limits.

## Frontend Integration

### Chat Page
Visit: http://localhost:3000/chatbot

### Mood Finder
Visit: http://localhost:3000/mood

Both pages automatically use the API endpoints with stored JWT tokens.
