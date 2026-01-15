# Frontend API Integration Guide

## ✅ Integration Complete

The Next.js 15 frontend is now fully integrated with the NestJS backend API running at `http://localhost:4000/api`.

## 📁 Updated File Structure

```
frontend/
├── src/
│   ├── lib/
│   │   └── api.ts                    # Axios client with auto token refresh
│   ├── state/
│   │   ├── authStore.ts              # Zustand auth state
│   │   └── cartStore.ts              # Zustand cart state
│   ├── features/
│   │   ├── auth/
│   │   │   ├── authService.ts        # Auth API calls
│   │   │   └── useAuth.ts            # Auth hook
│   │   ├── products/
│   │   │   └── productService.ts     # Product API calls
│   │   ├── cart/
│   │   │   ├── cartService.ts        # Cart API calls
│   │   │   └── useCart.ts            # Cart hook
│   │   └── orders/
│   │       └── orderService.ts       # Order API calls
│   ├── components/
│   │   ├── auth/
│   │   │   └── ProtectedRoute.tsx    # Route protection HOC
│   │   ├── pages/                    # Updated with API integration
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── ProductsPage.tsx
│   │   │   └── CartPage.tsx
│   │   └── layout/
│   │       └── Navbar.tsx            # Updated with cart count
│   └── app/                          # Next.js 15 App Router
├── .env.local                        # Environment variables
└── package.json
```

## 🔐 Authentication Flow

### 1. Registration
```typescript
POST /api/auth/register
Body: { email, password, name }
Response: { user, accessToken, refreshToken }
```

### 2. Login
```typescript
POST /api/auth/login
Body: { email, password }
Response: { user, accessToken, refreshToken }
```

### 3. Token Storage
- `accessToken` (15 minutes) → localStorage
- `refreshToken` (7 days) → localStorage
- Auto-attached to all requests via interceptor

### 4. Auto Token Refresh
- Axios interceptor catches 401 errors
- Automatically calls `/api/auth/refresh`
- Retries failed request with new token
- Redirects to login if refresh fails

### 5. Logout
- Clears tokens from localStorage
- Resets auth state
- Redirects to login page

## 🛒 Cart Integration

### Backend Sync
```typescript
// Cart operations now sync with backend
GET    /api/cart              # Get user cart
POST   /api/cart/items        # Add to cart
PATCH  /api/cart/items/:id    # Update quantity
DELETE /api/cart/items/:id    # Remove item
DELETE /api/cart/clear        # Clear cart
```

### State Management
- Zustand store for local state
- `useCart()` hook for operations
- Fetches cart on auth
- Updates persist to backend

## 📦 Products Integration

### API Endpoints
```typescript
GET /api/products                # List with pagination
GET /api/products/:id           # Single product
GET /api/products/search        # Search products
GET /api/products/filter        # Filter by category/price
```

### Query Parameters
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search query
- `category` - Filter by category
- `minPrice` / `maxPrice` - Price range

## 🛍️ Orders Integration

### Creating Orders
```typescript
POST /api/orders
// Creates order from current cart items
// Calculates total and clears cart
Response: { order }
```

### Order History
```typescript
GET /api/orders
// Returns user's order history
Response: [ orders ]
```

### Profile Page
- Displays order count
- Shows recent orders with status
- Order statuses: PENDING, CONFIRMED, SHIPPED, DELIVERED

## 🧪 Testing the Integration

### Test Flow

**1. Start Backend**
```bash
cd backend
docker compose up -d          # Start Postgres & Redis
npx prisma migrate dev        # Run migrations
npx prisma db seed           # Seed database
npm run start:dev            # Start backend (port 4000)
```

**2. Start Frontend**
```bash
cd frontend
npm run dev                  # Start frontend (port 3000)
```

**3. Test User Flow**

a) **Register New User**
   - Navigate to http://localhost:3000/register
   - Fill form: name, email, password
   - Submit → Auto login → Redirect to /products

b) **Browse Products**
   - View products at http://localhost:3000/products
   - Use search, filters, pagination
   - Products load from backend API

c) **Add to Cart**
   - Click shopping cart icon on any product
   - Toast notification confirms addition
   - Navbar cart count updates
   - Cart syncs with backend

d) **View Cart**
   - Navigate to http://localhost:3000/cart
   - See cart items with quantities
   - Update quantities (syncs to backend)
   - Remove items
   - Cart total calculated

e) **Checkout**
   - Click "Proceed to Checkout" in cart
   - Order created from cart items
   - Cart cleared after order
   - Redirect to profile

f) **View Orders**
   - Check profile at http://localhost:3000/profile
   - See order count in stats
   - View recent orders with status
   - Order history persists

g) **Logout & Login**
   - Logout from profile
   - Login again with same credentials
   - Cart data persists (loaded from backend)
   - Order history available

h) **Token Refresh Test**
   - Stay logged in for 15+ minutes
   - Perform any action (add to cart, etc.)
   - Token automatically refreshes
   - No redirect to login

## 🔒 Protected Routes

Routes requiring authentication:
- `/profile` - User profile and orders
- `/cart` - Shopping cart (shows login prompt if not authenticated)

Protection method:
```typescript
<ProtectedRoute>
  <YourComponent />
</ProtectedRoute>
```

## 🌐 Environment Variables

**Frontend** (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

**Backend** (`.env`):
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecommerce"
REDIS_HOST="localhost"
REDIS_PORT=6379
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"
```

## 📊 Response Format

All API responses follow this format:
```typescript
{
  success: boolean;
  data: any;            // Response payload
  message: string;      // Human-readable message
}
```

Error handling:
```typescript
try {
  await api.get('/endpoint');
} catch (error: any) {
  const message = error.response?.data?.message || 'Operation failed';
  toast.error(message);
}
```

## 🎯 Key Features

✅ JWT authentication with auto-refresh
✅ Cart syncs with backend (persists across sessions)
✅ Product browsing with search/filter/pagination
✅ Order creation and history
✅ Protected routes
✅ Token management in localStorage
✅ Axios interceptors for auth
✅ Zustand for state management
✅ Toast notifications for user feedback
✅ Loading states for async operations

## 🚀 Production Checklist

Before deploying:

1. **Update Environment Variables**
   - Use production API URL
   - Strong JWT secrets
   - Secure database credentials

2. **Enable Type Checking**
   - Remove `ignoreBuildErrors` from next.config.js
   - Fix TypeScript issues

3. **Enable ESLint**
   - Remove `ignoreDuringBuilds` from next.config.js
   - Fix linting warnings

4. **Security**
   - Enable HTTPS
   - Set secure cookie flags
   - Configure CORS properly
   - Implement rate limiting

5. **Performance**
   - Enable caching
   - Optimize images
   - Add CDN for static assets

## 📝 Git Commits

All changes committed to GitHub:
- Commit: "Phase 3: Frontend API Integration complete"
- Branch: `main`
- Repository: https://github.com/nishant-gupta911/vibe-basket.git

## 🎉 Integration Status

**Status**: ✅ COMPLETE

The frontend is now fully functional with:
- Backend API integration
- Authentication flow
- Cart management
- Order creation
- Product browsing
- Protected routes

Everything is tested and pushed to GitHub!
