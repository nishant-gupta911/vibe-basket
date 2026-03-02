# Vibe Basket — Full-Stack E-Commerce Platform

A production-ready e-commerce platform built with **Next.js 15**, **NestJS**, **PostgreSQL**, and **AI-powered** shopping features.

![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=next.js)
![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?logo=nestjs)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## Features

### Core Commerce

- JWT authentication with refresh tokens and profile management
- Product catalog with search, filters, categories, and pagination
- Shopping cart, order placement, and order tracking
- Responsive UI built on a shared design system (Tailwind CSS + shadcn/ui)

### Marketplace & Vendors

- Vendor accounts with product ownership and data isolation
- Commission calculation and payout ledger
- Vendor analytics dashboard and admin moderation

### Payments & Finance

- Razorpay payment intents, confirmations, and webhooks
- Order payment lifecycle (PENDING → PAID → FAILED → REFUNDED)
- Refund flow with transaction logging
- Coupons, discounts, and region-based tax calculation
- Invoice generation and revenue reporting

### AI & Intelligence

- Rule-based shopping assistant chatbot
- Mood-based product recommendations
- Personalization engine with behavioral tracking
- Optional OpenAI embeddings for semantic search

### Reliability & Ops

- Structured logging and request metrics
- Health checks and rate limiting
- Hardened error responses (no stack traces or secrets leak to clients)
- Integration test harness with Docker / local PG / SQLite fallback
- E2E tests with dynamic port allocation (Playwright)

---

## Tech Stack

| Layer | Technology |
| -------- | ---------- |
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Zustand, Axios |
| Backend | NestJS 10, TypeScript, Prisma ORM, PostgreSQL 16, Redis |
| AI | Rule-based assistant, optional OpenAI embeddings |
| Testing | Jest, Supertest, Playwright, ts-jest |
| DevOps | Docker, Netlify (frontend), GitHub |

---

## Project Structure

```
ecommerce-platform/
├── backend/                 # NestJS API server
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/        # JWT authentication
│   │   │   ├── user/        # User management
│   │   │   ├── product/     # Product catalog
│   │   │   ├── cart/        # Shopping cart
│   │   │   ├── order/       # Order processing
│   │   │   ├── payments/    # Razorpay integration
│   │   │   ├── review/      # Reviews & ratings
│   │   │   ├── wishlist/    # Wishlist
│   │   │   ├── vendors/     # Multi-vendor marketplace
│   │   │   ├── coupons/     # Discount codes
│   │   │   ├── tax/         # Tax calculation
│   │   │   ├── invoice/     # Invoice generation
│   │   │   ├── reports/     # Revenue reporting
│   │   │   ├── notifications/ # User notifications
│   │   │   ├── ai/          # Chatbot & recommendations
│   │   │   └── personalization/ # Behavioral tracking
│   │   ├── config/          # Env, Prisma service
│   │   └── common/          # Guards, filters, middleware
│   └── prisma/
│       └── schema.prisma    # Database schema (20+ models)
├── frontend/                # Next.js 15 frontend
│   └── src/
│       ├── app/             # App Router pages
│       │   ├── products/    # Product listing & detail
│       │   ├── cart/        # Cart page
│       │   ├── chatbot/     # AI shopping assistant
│       │   ├── mood/        # Mood-based recommender
│       │   ├── wishlist/    # Wishlist page
│       │   ├── admin/       # Admin dashboard
│       │   └── ...
│       ├── components/      # Shared UI components
│       ├── features/        # Feature modules (auth, cart, products)
│       ├── design-system/   # Premium UI components
│       └── state/           # Zustand stores
├── tests/
│   ├── e2e/                 # Playwright E2E tests
│   ├── integration/         # API integration tests
│   └── unit/                # Unit tests
├── scripts/
│   ├── run-e2e.js           # E2E runner with dynamic port allocation
│   └── test-integration.sh  # Integration test runner (Docker/PG/SQLite)
├── devops/                  # Docker & Nginx configs
├── docs/                    # Documentation
├── netlify.toml             # Netlify deployment config
└── playwright.config.ts     # Playwright config
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16 (or Docker)
- Redis (optional, falls back gracefully)
- OpenAI API key (optional, for embeddings)

### Quick Start

```bash
# 1. Clone and install
git clone <repository-url>
cd ecommerce-platform
npm run install:all

# 2. Configure backend
cd backend
cp .env.example .env
# Edit .env with your database URL, JWT secrets, etc.

# 3. Set up database
npx prisma migrate dev
npx prisma db seed

# 4. Start everything (from root)
cd ..
npm run dev
```

The app will be available at:

| Service | URL |
| ------- | --- |
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:4000/api |
| AI Chatbot | http://localhost:3000/chatbot |
| Mood Finder | http://localhost:3000/mood |

---

## Environment Variables

### Backend (`backend/.env`)

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
OPENAI_API_KEY=sk-...              # optional
EMBEDDING_MODEL=text-embedding-3-small  # optional
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

## API Reference

See [docs/API.md](docs/API.md) for the complete reference. Key endpoints:

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/profile` | Profile (auth) |
| GET | `/api/products` | List products |
| GET | `/api/products/:id` | Product detail |
| GET | `/api/products/categories` | Categories |
| GET | `/api/cart` | Get cart (auth) |
| POST | `/api/cart` | Add to cart (auth) |
| POST | `/api/orders` | Create order (auth) |
| POST | `/api/payments/create-intent` | Payment intent |
| POST | `/api/payments/confirm` | Confirm payment |
| GET | `/api/wishlist` | Get wishlist (auth) |
| POST | `/api/ai/chat` | Chat with assistant |
| POST | `/api/ai/mood` | Mood recommendations |

---

## Testing

```bash
# Unit tests (backend)
npm run test:unit

# Frontend tests
npm run test:frontend

# Integration tests (auto-detects Docker / local PG / SQLite)
npm run test:integration

# E2E tests (Playwright, dynamic port allocation)
npm run test:e2e

# Everything
npm run test:full
```

### Test Results

| Suite | Count | Status |
| ----- | ----- | ------ |
| Unit | 23 | ✅ |
| Frontend | 4 | ✅ |
| Integration | 48 | ✅ |
| E2E (Playwright) | 12 | ✅ |

---

## Deployment

### Frontend (Netlify)

The frontend deploys automatically via Netlify with `@netlify/plugin-nextjs`:

```
Base directory:    frontend
Build command:     npm run build
Publish directory: .next
```

Set `NEXT_PUBLIC_API_URL` in Netlify environment variables.

### Backend

```bash
cd backend
npm run build
npm run start:prod
```

---

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌────────────┐
│  Next.js 15  │────▶│  NestJS API  │────▶│ PostgreSQL │
│  (Netlify)   │     │  (Port 4000) │     │   Prisma   │
└─────────────┘     └──────┬───────┘     └────────────┘
                           │
                    ┌──────┴───────┐
                    │    Redis     │
                    │  (Sessions)  │
                    └──────────────┘
```

---

## Security

- JWT authentication with access + refresh token rotation
- Password hashing with bcrypt (10 rounds)
- CORS with configurable origins
- Rate limiting (300 req / 15 min per IP)
- Input validation and sanitization on all endpoints
- Hardened error responses — no Prisma errors, stack traces, or env vars leak to clients
- SQL injection prevention via Prisma ORM
- Security headers (X-Frame-Options, CSP, XSS Protection)

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by the Vibe Basket team