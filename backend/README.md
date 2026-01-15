# E-Commerce Backend API

Production-ready REST API built with NestJS, PostgreSQL, Prisma, Redis, and JWT authentication.

## Tech Stack

- **Framework**: NestJS 10.3
- **Language**: TypeScript 5.3
- **Database**: PostgreSQL 16
- **ORM**: Prisma 5.8
- **Cache**: Redis 7
- **Authentication**: JWT (Access + Refresh tokens)
- **Validation**: class-validator
- **Password Hashing**: bcrypt

## Prerequisites

- Node.js 18+
- Docker & Docker Compose
- npm or yarn

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Setup

Create `.env` file in backend root (already configured):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecommerce"
REDIS_HOST="localhost"
REDIS_PORT=6379
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"
```

### 3. Start Database Services

```bash
docker-compose up -d
```

This starts PostgreSQL and Redis containers.

### 4. Run Database Migrations

```bash
npx prisma migrate dev --name init
```

### 5. Seed Database

```bash
npx prisma db seed
```

This creates 8 sample products (laptops, phones, headphones, etc).

### 6. Start Development Server

```bash
npm run start:dev
```

API runs at: `http://localhost:4000/api`

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login user | No |
| POST | `/refresh` | Refresh access token | No |
| GET | `/profile` | Get user profile | Yes |

### Users (`/api/users`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/me` | Get current user | Yes |
| PATCH | `/me` | Update profile | Yes |

### Products (`/api/products`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | List all products | No |
| GET | `/:id` | Get product by ID | No |
| GET | `/category/:category` | Get by category | No |
| GET | `/search` | Search products | No |

Query params for listing:
- `page` (default: 1)
- `limit` (default: 10)
- `category` (filter)
- `search` (search in name/description)
- `minPrice`, `maxPrice` (price range)

### Cart (`/api/cart`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get user cart | Yes |
| POST | `/items` | Add to cart | Yes |
| PATCH | `/items/:id` | Update quantity | Yes |
| DELETE | `/items/:id` | Remove item | Yes |
| DELETE | `/clear` | Clear cart | Yes |

### Orders (`/api/orders`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Create order | Yes |
| GET | `/` | Get user orders | Yes |
| GET | `/:id` | Get order by ID | Yes |

Query params for listing:
- `status` (filter: PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)

## Response Format

All endpoints return standardized JSON:

```json
{
  "success": true,
  "data": { },
  "message": "Operation successful"
}
```

## Authentication Flow

1. **Register**: POST `/api/auth/register` with email, password, name
2. **Login**: POST `/api/auth/login` → Returns `accessToken` (15m) and `refreshToken` (7d)
3. **Protected Routes**: Include `Authorization: Bearer <accessToken>` header
4. **Token Refresh**: POST `/api/auth/refresh` with `refreshToken` when access token expires

## Database Schema

### Models

- **User**: id, email, password, name, createdAt, updatedAt
- **Product**: id, name, description, price, image, category, stock, createdAt, updatedAt
- **Cart**: id, userId, items (CartItem[])
- **CartItem**: id, cartId, productId, quantity, product (Product)
- **Order**: id, userId, items (JSON), totalAmount, status, createdAt, updatedAt

### Relations

- User → Cart (1:1)
- User → Orders (1:Many)
- Cart → CartItems (1:Many)
- Product → CartItems (1:Many)

## Development

### Prisma Studio

View database in browser:

```bash
npx prisma studio
```

### Database Reset

```bash
npx prisma migrate reset
```

### Generate Prisma Client

```bash
npx prisma generate
```

## Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart services
docker-compose restart
```

## Project Structure

```
backend/
├── src/
│   ├── config/           # Environment & database config
│   ├── common/guards/    # JWT strategy & auth guard
│   ├── modules/
│   │   ├── auth/         # Authentication (register, login, refresh)
│   │   ├── user/         # User profile management
│   │   ├── product/      # Product catalog
│   │   ├── cart/         # Shopping cart
│   │   └── order/        # Order management
│   ├── app.module.ts     # Root module
│   └── main.ts           # Bootstrap
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seeder
├── .env                  # Environment variables
├── docker-compose.yml    # Docker services
└── package.json
```

## Security Features

- ✅ JWT authentication with access/refresh tokens
- ✅ Password hashing with bcrypt
- ✅ Input validation with class-validator
- ✅ CORS enabled
- ✅ Environment variable validation

## Error Handling

API returns appropriate HTTP status codes:
- `200 OK`: Success
- `201 Created`: Resource created
- `400 Bad Request`: Validation errors
- `401 Unauthorized`: Missing/invalid token
- `404 Not Found`: Resource not found
- `409 Conflict`: Duplicate resource (email exists)
- `500 Internal Server Error`: Server errors

## Production Deployment

1. Update environment variables (use strong secrets)
2. Set `NODE_ENV=production`
3. Build: `npm run build`
4. Start: `npm run start:prod`
5. Use proper PostgreSQL and Redis instances
6. Enable HTTPS
7. Set up rate limiting
8. Configure proper CORS origins

## Testing

Run tests:

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## License

MIT
