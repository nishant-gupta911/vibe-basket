# Vibe Basket - Full-Stack E-commerce Platform

A modern, production-ready e-commerce platform built with Next.js 15, NestJS, PostgreSQL, and AI-powered features.

## 🚀 Features

### Core Commerce
- ✅ JWT authentication + profile management
- ✅ Product catalog with search, filters, categories, and pagination
- ✅ Cart management and order placement
- ✅ Responsive UI with a shared design system

### Marketplace & Vendors
- ✅ Vendor accounts with product ownership and isolation
- ✅ Commission calculation and payout ledger
- ✅ Vendor analytics and admin moderation

### Payments & Finance
- ✅ Razorpay payment intents, confirmations, webhooks
- ✅ Order payment lifecycle (PENDING → PAID → FAILED → REFUNDED)
- ✅ Refund flow with transaction logging
- ✅ Coupons, discounts, and region-based tax calculation
- ✅ Invoice generation and revenue reporting

### Engagement & Intelligence
- ✅ Wishlist with per-user persistence
- ✅ Reviews and ratings with aggregates
- ✅ Personalization, recommendations, and behavioral tracking
- ✅ Mood-based product suggestions and shopping assistant
- ✅ Notifications (order confirmations, wishlist alerts)

### Reliability & Ops
- ✅ Structured logging and metrics
- ✅ Health checks and request logging
- ✅ Integration test harness with Docker/local DB fallback

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
- **PostgreSQL 16** - Relational database
- **Redis** - Cache and session tracking
- **JWT** - Authentication

### Intelligence
- **Rule-based assistant** - Deterministic conversational logic
- **Optional OpenAI embeddings** - Vector embeddings when enabled

### DevOps
- **Docker** - Containerized PostgreSQL + Redis
- **Git** - Version control

## 📁 Project Structure

```
ecommerce-platform/
├── backend/              # NestJS backend
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/        # Authentication
│   │   │   ├── user/        # User management
│   │   │   ├── product/     # Product catalog
│   │   │   ├── cart/        # Shopping cart
│   │   │   ├── order/       # Order processing
│   │   │   ├── payments/    # Payment lifecycle
│   │   │   ├── review/      # Reviews & ratings
│   │   │   ├── wishlist/    # Wishlist
│   │   │   ├── vendors/     # Vendor marketplace
│   │   │   ├── reports/     # Revenue reporting
│   │   │   ├── notifications/ # Notifications
│   │   │   └── ai/          # Assistant + recommendations
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
- PostgreSQL 16
- Redis
- Docker Desktop (optional, for local DB containers)
- OpenAI API key (optional, for embeddings)

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
# Add optional AI credentials to .env if using embeddings

# Start Docker containers (optional)
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

### 4. Generate Product Embeddings (optional)
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

**Payments:**
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `POST /api/payments/webhook` - Payment webhook (provider)
- `POST /api/payments/refund` - Admin refund

**Wishlist & Reviews:**
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/:productId` - Remove from wishlist
- `GET /api/products/:id/reviews` - Get reviews
- `POST /api/products/:id/reviews` - Add review

**Vendors & Admin:**
- `GET /api/vendors/dashboard` - Vendor dashboard
- `POST /api/vendors/approve` - Admin vendor approval
- `GET /api/reports/revenue` - Admin revenue reporting

**AI Features:**
- `POST /api/ai/chat` - Chat with shopping assistant
- `POST /api/ai/mood` - Get mood-based recommendations
- `POST /api/ai/embed-products` - Generate embeddings (auth required)

## 🤖 AI Features Guide

See [AI_FEATURES.md](docs/AI_FEATURES.md) for detailed AI documentation.

### Shopping Assistant Chatbot
Natural language product search:
```
User: "I need comfortable running shoes under $100"
AI: "I found these great options for you..."
```

## 🧪 Integration Tests

- Docker mode: `npm run test:integration` will start Postgres via docker compose, create a dedicated test database, run migrations, seed minimal data, run tests, and stop the container.
- Local mode: If Docker is not available and a local Postgres is already running on `localhost:5432`, tests run against `vibebasket_test` using `TEST_DATABASE_URL`/`DATABASE_URL`.
- Fallback: If neither Docker nor local Postgres is available, integration tests are skipped with a clear message.

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
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
OPENAI_API_KEY=sk-... # optional
EMBEDDING_MODEL=text-embedding-3-small # optional
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_AI_ENABLED=true
```

## 📦 Phase Completion

- ✅ **Phase 1:** Stabilized core commerce
- ✅ **Phase 2:** Market-ready features (search, wishlist, reviews, admin)
- ✅ **Phase 3:** Intelligence + personalization
- ✅ **Phase 4:** Payments, refunds, invoices, and finance
- ✅ **Phase 5:** Multi-vendor marketplace architecture

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
5. Try the AI chatbot at `/chat`
   - Ask: "Suggest a gift for a 20 year old under 1000"
   - View recommended products with add-to-cart buttons
6. Use mood finder at `/mood`
   - Select: Birthday occasion, Excited mood, $1500 budget
   - Get personalized recommendations
   - Use "Add All to Cart" for bulk adding

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

**Latest Update:** Final polish pass
