# Public Access Features

## ✅ Features Accessible Without Login

The following features are **fully accessible without authentication**:

### 1. AI Chat Assistant (`/chat` or `/chatbot`)
- **Backend**: No authentication required on `/api/ai/chat`
- **Frontend**: Works for both logged-in and guest users
- **Access**: Open to all visitors

### 2. Mood-Based Product Finder (`/mood`)
- **Backend**: No authentication required on `/api/ai/mood`
- **Frontend**: Works for both logged-in and guest users  
- **Access**: Open to all visitors

### 3. Product Browsing (`/products`)
- Browse all products
- View product details
- Search and filter products
- **Access**: Open to all visitors

### 4. Category Browsing (`/categories`)
- Browse products by category
- **Access**: Open to all visitors

## 🔒 Features Requiring Login

The following features require authentication:

### 1. Shopping Cart (`/cart`)
- View cart items
- Add/remove items
- Update quantities
- **Auth**: Required via `JwtAuthGuard`

### 2. Orders (`/orders`)
- Place orders
- View order history
- Track order status
- **Auth**: Required via `JwtAuthGuard`

### 3. User Profile (`/profile`)
- View/edit profile
- Manage addresses
- View preferences
- **Auth**: Required via `JwtAuthGuard`

## 🔧 Implementation Details

### Backend Authentication
Protected endpoints use `@UseGuards(JwtAuthGuard)` decorator:
- ✅ `/api/auth/profile` - Protected
- ✅ `/api/cart/*` - Protected
- ✅ `/api/order/*` - Protected
- ✅ `/api/user/*` - Protected
- ❌ `/api/ai/chat` - **Public**
- ❌ `/api/ai/mood` - **Public**
- ❌ `/api/products/*` - **Public**

### Frontend Token Handling
The API client (`lib/api.ts`) automatically adds auth tokens when available:
```typescript
// Token is OPTIONAL - requests work without it
const token = tokenManager.getAccessToken();
if (token && config.headers) {
  config.headers.Authorization = `Bearer ${token}`;
}
```

## 🎯 User Experience

**Guest Users Can:**
- Use AI chat to get shopping recommendations
- Use mood-based finder to discover products
- Browse all products and categories
- View product details

**Logged-In Users Get:**
- All guest features PLUS:
- Shopping cart persistence
- Order placement and history
- Profile management
- Personalized recommendations (future)

## ✨ No Changes Needed

**The AI features (chat and mood finder) are already fully accessible without login!**

Users can enjoy the full AI-powered shopping experience as guests, and only need to create an account when they're ready to purchase.

---

Last Updated: January 30, 2026
