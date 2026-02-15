# Quick Start Guide

## ✅ Project is Now Running!

Your e-commerce platform is successfully running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000/api
- **Database**: PostgreSQL on localhost:5432
- **Cache**: Redis on localhost:6379

## 🔧 What Was Fixed

1. **Docker Setup**: Updated PostgreSQL image to `pgvector/pgvector:pg16` to support vector embeddings
2. **Database**: Ran Prisma migrations and seeded with initial product data
3. **Services**: Started PostgreSQL and Redis containers via Docker

## 🚀 Running the Project

### Start Everything
```bash
npm run dev
```

This starts both frontend and backend concurrently.

### Start Individual Services

#### Backend Only
```bash
cd backend
npm run dev
```

#### Frontend Only
```bash
cd frontend
npm run dev
```

### Docker Services

#### Start PostgreSQL & Redis
```bash
cd backend
docker-compose up -d
```

#### Stop Services
```bash
cd backend
docker-compose down
```

#### View Logs
```bash
docker logs vibe-basket-db
docker logs vibe-basket-redis
```

## 📋 Prerequisites Checklist

- ✅ Node.js installed
- ✅ Docker Desktop running
- ✅ Dependencies installed (`npm install` in root, backend, and frontend)
- ✅ PostgreSQL & Redis containers running
- ✅ Database migrations applied
- ✅ Environment files configured

## 🗄️ Database Commands

### Reset Database
```bash
cd backend
npm run db:reset
```

### Run Migrations
```bash
cd backend
npm run prisma:migrate
```

### Seed Database
```bash
cd backend
npm run prisma:seed
```

### Generate Prisma Client
```bash
cd backend
npm run prisma:generate
```

## ⚙️ Environment Configuration

### Backend (.env)
Located at `backend/.env`:
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_HOST` & `REDIS_PORT`: Redis configuration
- `JWT_SECRET` & `JWT_REFRESH_SECRET`: Authentication secrets
- `OPENAI_API_KEY`: OpenAI API key for AI features (currently placeholder)
- `PORT`: Backend server port (default: 4000)

### Frontend (.env.local)
Located at `frontend/.env.local`:
- `NEXT_PUBLIC_API_URL`: Backend API URL (http://localhost:4000/api)

## 🤖 AI Features Note

The AI features (chatbot, mood-based recommendations, semantic search) require a valid OpenAI API key.

To enable AI features:
1. Get an API key from https://platform.openai.com/api-keys
2. Update `OPENAI_API_KEY` in `backend/.env`
3. Restart the backend server

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 4000 (backend)
lsof -ti:4000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### Docker Not Running
```bash
# Start Docker Desktop
open -a Docker

# Wait for it to start, then:
cd backend
docker-compose up -d
```

### Database Connection Issues
```bash
# Check if PostgreSQL container is running
docker ps | grep vibe-basket-db

# If not, start it
cd backend
docker-compose up -d postgres
```

### Clear Everything and Start Fresh
```bash
# Stop all services
docker-compose down

# Remove volumes (WARNING: deletes all data)
docker-compose down -v

# Start fresh
docker-compose up -d
cd ..
npm run dev
```

## 📚 Project Structure

```
├── backend/          # NestJS API server
│   ├── src/
│   │   ├── modules/  # Feature modules
│   │   ├── config/   # Configuration
│   │   └── common/   # Shared code
│   └── prisma/       # Database schema & migrations
├── frontend/         # Next.js application
│   └── src/
│       ├── app/      # Next.js 15 App Router
│       ├── components/ # React components
│       └── features/ # Feature-based code
└── docs/            # Documentation
```

## 🎯 Next Steps

1. Open http://localhost:3000 in your browser
2. Explore the products and categories
3. Register an account to test authentication
4. Add items to cart and create orders
5. (Optional) Configure OpenAI API key to test AI features

## 📖 More Documentation

- [API Documentation](docs/API.md)
- [AI Features](docs/AI_FEATURES.md)
- [System Design](docs/SYSTEM_DESIGN.md)
- [Data Models](docs/MODELS.md)
