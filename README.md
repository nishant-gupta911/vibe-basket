# Vibe Basket - Full-Stack E-commerce Platform

A modern, production-ready e-commerce platform built with Next.js 15, NestJS, PostgreSQL, and AI-powered features.

## 🚀 Features

### Core E-commerce
- ✅ User authentication & authorization (JWT)
- ✅ Product catalog with categories
- ✅ Shopping cart management
- ✅ Order processing and history
- ✅ User profiles and order tracking
- ✅ Responsive design with Tailwind CSS

### AI-Powered Features (Phase 4) 🤖
- ✅ **Shopping Assistant Chatbot** - Natural language product search
- ✅ **Mood-Based Recommender** - AI suggests products based on occasion, mood, and budget
- ✅ **Semantic Search** - Vector similarity search using pgvector
- ✅ **Smart Product Embeddings** - OpenAI text-embedding-3-small

## 🏗️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Axios** - API requests
- **Shadcn/ui** - Modern UI components

### Backend
- **NestJS** - Enterprise Node.js framework
- **TypeScript** - Type-safe backend
- **Prisma** - Modern ORM
- **PostgreSQL 16** - Database with pgvector extension
- **Redis** - Session & cache management
- **JWT** - Authentication

### AI/ML
- **OpenAI GPT-4o-mini** - Chat completions
- **OpenAI text-embedding-3-small** - Vector embeddings (1536d)
- **pgvector** - Vector similarity search in PostgreSQL

### DevOps
- **Docker** - Containerized PostgreSQL + Redis
- **Git** - Version control

## 📁 Project Structure

```
ecommerce-platform/
├── backend/              # NestJS backend
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/     # Authentication
│   │   │   ├── user/     # User management
│   │   │   ├── product/  # Product catalog
│   │   │   ├── cart/     # Shopping cart
│   │   │   ├── order/    # Order processing
│   │   │   └── ai/       # AI features (NEW)
│   │   ├── config/       # Configuration
│   │   └── common/       # Guards, decorators
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   └── .env              # Environment variables
├── frontend/             # Next.js frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── chatbot/  # AI chatbot page (NEW)
│   │   │   ├── mood/     # Mood recommender (NEW)
│   │   │   ├── products/ # Product pages
│   │   │   ├── cart/     # Cart page
│   │   │   └── ...
│   │   ├── components/   # React components
│   │   └── features/     # Feature modules
│   └── .env.local        # Environment variables
├── devops/
│   └── docker/           # Docker configs
└── docs/                 # Documentation
    ├── AI_FEATURES.md    # AI features guide (NEW)
    ├── API.md            # API documentation
    ├── MODELS.md         # Data models
    └── SYSTEM_DESIGN.md  # Architecture
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Docker Desktop
- OpenAI API key

### 1. Clone Repository
```bash
git clone <repository-url>
cd ecommerce-platform
```

### 2. Setup Backend
```bash
cd backend
npm install

# Configure environment
cp .env.example .env
# Add your OpenAI API key to .env

# Start Docker containers
cd ../devops/docker
docker compose up -d

# Run migrations
cd ../../backend
npx prisma migrate dev

# Seed database
npx prisma db seed

# Start backend
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install

# Start frontend
npm run dev
```

### 4. Generate Product Embeddings (for AI features)
```bash
# Login to get JWT token, then:
curl -X POST http://localhost:4000/api/ai/embed-products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api
- AI Chatbot: http://localhost:3000/chatbot
- Mood Finder: http://localhost:3000/mood

## 📚 API Documentation

See [API.md](docs/API.md) for complete API reference.

### Key Endpoints

**Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

**Products:**
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `GET /api/products/categories` - Get categories

**Cart:**
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:itemId` - Update quantity
- `DELETE /api/cart/:itemId` - Remove from cart

**Orders:**
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details

**AI Features:**
- `POST /api/ai/chat` - Chat with shopping assistant
- `POST /api/ai/mood` - Get mood-based recommendations
- `POST /api/ai/semantic-search` - Semantic product search
- `POST /api/ai/embed-products` - Generate embeddings (auth required)

## 🤖 AI Features Guide

See [AI_FEATURES.md](docs/AI_FEATURES.md) for detailed AI documentation.

### Shopping Assistant Chatbot
Natural language product search:
```
User: "I need comfortable running shoes under $100"
AI: "I found these great options for you..."
```

### Mood-Based Recommender
Get personalized suggestions:
```json
{
  "occasion": "Date night",
  "mood": "Romantic",
  "budget": 150,
  "gender": "female"
}
```

## 🔒 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/vibebasket
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
OPENAI_API_KEY=sk-...
AI_MODEL=gpt-4o-mini
EMBEDDING_MODEL=text-embedding-3-small
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## 📦 Phase Completion

- ✅ **Phase 1:** Next.js frontend conversion
- ✅ **Phase 2:** NestJS backend with all modules
- ✅ **Phase 3:** Frontend-backend API integration
- ✅ **Phase 4:** AI chatbot + mood recommendation system

## 🧪 Testing

### Backend
```bash
cd backend
npm run test
```

### Frontend
```bash
cd frontend
npm run test
```

### Manual Testing
1. Register a new user
2. Browse products
3. Add items to cart
4. Create an order
5. Try the AI chatbot at `/chatbot`
6. Use mood finder at `/mood`

## 🚀 Deployment

### Backend
```bash
cd backend
npm run build
npm run start:prod
```

### Frontend
```bash
cd frontend
npm run build
npm start
```

### Docker Production
```bash
docker compose -f docker-compose.prod.yml up -d
```

## 🛠️ Development

### Run in Development Mode
```bash
# Backend with hot reload
cd backend
npm run dev

# Frontend with hot reload
cd frontend
npm run dev
```

### Database Management
```bash
# Create migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio
```

## 📊 Performance

- **Backend Response Time:** <100ms average
- **Frontend Load Time:** <2s initial load
- **AI Chat Response:** 1-3s depending on complexity
- **Embedding Generation:** ~10s per 100 products

## 🔐 Security

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- CORS configuration
- Input validation on all endpoints
- SQL injection prevention (Prisma ORM)
- XSS protection
- Environment variable secrets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Open a pull request

## 📝 License

MIT License

## 👥 Team

Built with ❤️ by the Vibe Basket team

## 📞 Support

For issues and questions, please open a GitHub issue.

---

**Latest Update:** Phase 4 - AI Features Integration ✨
