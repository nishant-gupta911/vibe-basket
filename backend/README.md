# Vibe Basket Backend

NestJS-based e-commerce API with AI-powered features using OpenAI.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 16 with pgvector
- Redis 7
- OpenAI API Key (for AI features)

### Installation

```bash
npm install
cp .env.example .env
# Edit .env with your OpenAI API key

# Start Docker services
cd ../devops/docker && docker compose up -d

# Run migrations  
npx prisma migrate dev

# Seed database
npx prisma db seed

# Start server
npm run dev
```

## 🔑 OpenAI API Setup

**CRITICAL:** AI features require OpenAI API credits

### 1. Get API Key
Visit https://platform.openai.com/api-keys and create a new key

### 2. Add Credits
Visit https://platform.openai.com/settings/organization/billing and add funds ($5 minimum)

### 3. Configure .env
```env
OPENAI_API_KEY=sk-proj-your-actual-key-here
```

### 4. Test Connection
```bash
node test-openai.js
```

Expected: `✅ SUCCESS!`  
If error: `❌ ERROR: You exceeded your current quota` → Add credits

## 📚 AI API Endpoints

See [AI_API.md](./AI_API.md) for complete documentation.

### POST /api/ai/chat
Chat with AI shopping assistant
```json
{"message": "Show me affordable electronics"}
```

### POST /api/ai/mood  
Get mood-based recommendations
```json
{
  "occasion": "Birthday party",
  "mood": "Happy",
  "budget": 150
}
```

### POST /api/ai/embed-products
Generate product embeddings for semantic search

### POST /api/ai/semantic-search
Search products by meaning, not just keywords

## 🐛 Troubleshooting

### "OpenAI API quota exceeded"
→ Add credits at https://platform.openai.com/settings/organization/billing

### "OpenAI API key is invalid"
→ Check `.env` has correct key starting with `sk-`

### AI features return 500 errors
→ Restart server after changing `.env`: `npm run dev`

## 📖 Documentation

- [AI_API.md](./AI_API.md) - AI endpoint details
- [../docs/API.md](../docs/API.md) - Full API docs
- [test-openai.js](./test-openai.js) - Test OpenAI connection

## 🚀 Production Notes

- Monitor usage: https://platform.openai.com/usage
- Costs: ~$0.0003 per chat message
- Free tier has very limited quota
- Paid tier required for production use

---

Server: http://localhost:4000/api
