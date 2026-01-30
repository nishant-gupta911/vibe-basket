# Local Database Setup Guide

## Prerequisites

- **Node.js** 18+ installed
- **PostgreSQL 15** installed locally
- **Homebrew** (macOS) for package management

## Quick Setup (4 Commands)

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Database
PostgreSQL should already be running. If not:
```bash
# Start PostgreSQL service
brew services start postgresql@15

# Create database
createdb vibebasket
```

### 3. Run Migrations
```bash
npm run prisma:migrate
```

### 4. Seed Database (100 Products)
```bash
npm run seed
```

### 5. Start Backend Server
```bash
npm run dev
```

## Environment Variables

Create a `.env` file from the example:
```bash
cp .env.example .env
```

Update the `DATABASE_URL` with your username:
```env
DATABASE_URL="postgresql://YOUR_USERNAME@localhost:5432/vibebasket?schema=public"
```

Replace `YOUR_USERNAME` with your macOS username (run `whoami` to find it).

Example:
```env
DATABASE_URL="postgresql://nishant@localhost:5432/vibebasket?schema=public"
PORT=4000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

## Database Schema

### Product Model
```prisma
model Product {
  id          String    @id @default(uuid())
  title       String
  description String?
  category    String    // clothing, footwear, electronics, laptops, accessories, home
  price       Float
  image       String?
  inStock     Boolean   @default(true)
  stock       Int       @default(100)
  tags        String[]  @default([])  // NEW: For Mood Finder & filters
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

## Seeded Products (100 Total)

### Categories
- **Men's Clothing**: 15 products (shirts, jeans, blazers, etc.)
- **Women's Clothing**: 15 products (dresses, blouses, leggings, etc.)
- **Footwear**: 15 products (sneakers, boots, sandals, etc.)
- **Electronics**: 20 products (headphones, smartwatch, chargers, etc.)
- **Laptops**: 10 products (ultrabooks, gaming, student editions)
- **Accessories**: 15 products (wallets, sunglasses, bags, etc.)
- **Home Essentials**: 10 products (coffee maker, blankets, organizers, etc.)

### Tags (82 Unique)
Products are tagged for intelligent recommendations:
- **Mood/Occasion**: romantic, party, formal, casual, office, college
- **Attributes**: premium, budget, comfort, trendy, elegant, sporty
- **Use Cases**: gym, travel, daily-use, gift, performance

### Price Range
- **Minimum**: $14.99 (Keychain)
- **Maximum**: $2,499.99 (Workstation Laptop)
- **Average**: $195.07

## Available Scripts

```bash
# Development
npm run dev              # Start backend in watch mode

# Database Management
npm run prisma:migrate   # Run migrations
npm run seed             # Seed 100 products
npm run db:setup         # Migrate + Seed (fresh setup)
npm run db:reset         # Reset database (⚠️ deletes all data)

# Build & Production
npm run build            # Build for production
npm start                # Start production server
```

## Testing the Setup

### 1. Verify Database Connection
```bash
psql vibebasket
```

### 2. Check Product Count
```sql
SELECT COUNT(*) FROM "Product";
-- Should return: 100
```

### 3. View Products by Category
```sql
SELECT category, COUNT(*) FROM "Product" GROUP BY category;
```

### 4. Test API Endpoints
```bash
# Get all products
curl http://localhost:4000/products

# Get products by category
curl http://localhost:4000/products?category=electronics

# Search products
curl http://localhost:4000/products/search?q=laptop
```

## Mood Finder Integration

Products are tagged to work with the Mood Finder feature:

### Example: Romantic + Anniversary
Tags matched: `romantic`, `elegant`, `premium`, `gift`

Returns products like:
- Premium Leather Jacket
- Elegant Midi Dress
- Minimalist Watch
- Cashmere Cardigan

### Example: Sporty + Gym
Tags matched: `sporty`, `gym`, `performance`, `athletic`

Returns products like:
- Athletic Leggings
- Running Shoes
- Sports Bra
- Compression Workout Shirt

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL status
brew services list | grep postgresql

# Restart PostgreSQL
brew services restart postgresql@15

# Check database exists
psql -l | grep vibebasket
```

### Seed Script Errors
```bash
# Generate Prisma client first
npx prisma generate

# Then re-run seed
npm run seed
```

### Port Already in Use
```bash
# Kill process on port 4000
lsof -ti:4000 | xargs kill -9
```

## NO Docker / Kubernetes

This setup intentionally avoids containerization for simplicity:
- ✅ Local PostgreSQL instance
- ✅ Direct database connection
- ✅ Simple npm scripts
- ❌ No docker-compose
- ❌ No container orchestration
- ❌ No cloud dependencies

## Product Data Quality

All 100 products feature:
- ✅ Realistic names and descriptions
- ✅ Accurate pricing ($14.99 - $2,499.99)
- ✅ Intentional tagging for recommendations
- ✅ Unsplash image URLs (placeholder-ready)
- ✅ Proper stock quantities (25-300 units)
- ✅ Category consistency

## Next Steps

1. **Frontend Integration**: Connect frontend to backend API
2. **Search Enhancement**: Implement tag-based search
3. **Mood Finder Testing**: Test with various mood-occasion combinations
4. **Filters**: Add price range, category, and tag filters

---

**Last Updated**: January 30, 2026
**Database Version**: PostgreSQL 15
**Total Products**: 100
**Seed Duration**: ~5 seconds
