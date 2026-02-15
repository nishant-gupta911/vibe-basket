# Authentication Fix - Testing Guide

## ✅ What Was Fixed

### Issues Identified:
1. Missing error handling and logging in authentication flow
2. Potential response parsing issues
3. Lack of debugging information when errors occur

### Changes Made:

#### 1. **Enhanced Error Handling** ([authService.ts](frontend/src/features/auth/authService.ts))
- Added try-catch blocks with console logging
- Better error propagation
- Validated response structure before processing

#### 2. **Improved useAuth Hook** ([useAuth.ts](frontend/src/features/auth/useAuth.ts))
- Added detailed console logging for debugging
- Improved error messages
- Validated response data structure
- Better error extraction from API responses

#### 3. **Enhanced Login/Register Pages**
- Added console logging for debugging
- Improved error message display
- Better user feedback

#### 4. **API Client Debugging** ([api.ts](frontend/src/lib/api.ts))
- Added API error logging interceptor
- Shows base URL on load
- Detailed error information in console

## 🧪 How to Test Authentication

### Step 1: Open Browser Console
1. Open your application at http://localhost:3000
2. Open browser Developer Tools (F12 or Cmd+Option+I on Mac)
3. Go to the Console tab

### Step 2: Test Registration
1. Navigate to http://localhost:3000/register
2. Fill in the form:
   - **Name**: Test User
   - **Email**: testuser@example.com
   - **Password**: Test123456 (meets all requirements)
   - **Confirm Password**: Test123456
3. Check the "I agree to terms" checkbox
4. Click "Create Account"

**Expected Behavior:**
- Console should show: "API Base URL: http://localhost:4000/api"
- Console should show: "Registration attempt: { name: 'Test User', email: 'testuser@example.com' }"
- If successful: Redirects to /profile with success toast
- If error: Error message appears in toast and console

### Step 3: Test Login
1. Navigate to http://localhost:3000/login
2. Fill in the form:
   - **Email**: testuser@example.com (use the account you just created)
   - **Password**: Test123456
3. Click "Sign In"

**Expected Behavior:**
- Console should show: "Login attempt: { email: 'testuser@example.com' }"
- If successful: Redirects to /profile with success toast
- If error: Error message appears in toast and console

### Step 4: Test Profile Access
1. After logging in, you should be on http://localhost:3000/profile
2. You should see your user information
3. Try navigating to protected routes (cart, orders)

## 🔍 Debugging Common Issues

### Issue 1: "Network Error" or API not reachable
**Symptoms:**
- Console shows: "API Error: ... message: 'Network Error'"
- Toast shows: "Registration failed. Please try again."

**Solution:**
```bash
# Check if backend is running
curl http://localhost:4000/api/auth/login

# If not, start it:
cd backend
npm run dev
```

### Issue 2: "Invalid credentials"
**Symptoms:**
- Login shows "Invalid credentials" error
- Backend returns 401 status

**Solutions:**
- Make sure you're using the correct email/password
- Try registering a new account first
- Check backend logs for errors

### Issue 3: CORS Errors
**Symptoms:**
- Console shows CORS policy errors
- Requests are blocked

**Solution:**
- Backend CORS is configured for http://localhost:3000
- Make sure you're accessing the app from that URL
- If using a different port, update [backend/src/main.ts](backend/src/main.ts)

### Issue 4: "Invalid response format"
**Symptoms:**
- Console shows: "Invalid response format"
- Response structure doesn't match expected format

**Check Console:**
- Look for "Register response:" or "Login response:" logs
- Verify the response has this structure:
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "email": "...", "name": "..." },
    "accessToken": "...",
    "refreshToken": "..."
  },
  "message": "..."
}
```

## 📋 Manual API Testing

Test the backend directly to isolate issues:

### Register User
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123"
  }'
```

### Login User
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123"
  }'
```

### Expected Response
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "test@example.com",
      "name": "Test User"
    },
    "accessToken": "jwt-token-here",
    "refreshToken": "refresh-token-here"
  },
  "message": "Login successful"
}
```

## 🎯 What to Check in Console

When testing, you should see these logs:

### On Page Load:
```
API Base URL: http://localhost:4000/api
```

### On Registration:
```
Registration attempt: { name: '...', email: '...' }
Registering user: { email: '...', name: '...' }
Register response: { success: true, data: {...} }
```

### On Login:
```
Login attempt: { email: '...' }
Logging in user: { email: '...' }
Login response: { success: true, data: {...} }
```

### On API Error:
```
API Error: {
  url: '/auth/login',
  method: 'post',
  status: 401,
  data: { message: 'Invalid credentials' },
  message: 'Request failed with status code 401'
}
Login error in component: Error: Invalid credentials
```

## ✨ Features Now Available After Login

Once authentication works, you can:

1. **Browse Products** - View all products and categories
2. **Add to Cart** - Add items to your shopping cart
3. **Place Orders** - Create orders from cart items
4. **View Profile** - See your user information
5. **View Order History** - See past orders
6. **Use AI Features** (if OpenAI key configured):
   - AI Chatbot for product recommendations
   - Mood-based product suggestions
   - Semantic product search

## 🚨 Still Having Issues?

If authentication still doesn't work:

1. **Check Browser Console** - Look for any error messages
2. **Check Backend Logs** - Look at terminal running `npm run dev`
3. **Clear Browser Data**:
   - Open DevTools > Application > Storage
   - Clear all local storage
   - Refresh page
4. **Verify Database**:
   ```bash
   docker ps | grep vibe-basket-db
   # Should show container is running
   ```
5. **Reset Database** (if needed):
   ```bash
   cd backend
   npm run db:reset
   npm run prisma:seed
   ```

## 📝 Testing Checklist

- [ ] Backend server is running (http://localhost:4000/api)
- [ ] Frontend server is running (http://localhost:3000)
- [ ] PostgreSQL container is running
- [ ] Redis container is running
- [ ] Browser console is open
- [ ] Can see "API Base URL" log
- [ ] Registration works and shows success
- [ ] Login works with registered account
- [ ] Redirects to /profile after login
- [ ] Can access protected routes (cart, orders)
- [ ] Logout works (clears tokens)

---

**Note**: All debugging logs will appear in the browser console. Keep it open while testing to see what's happening at each step.
