# 📋 Vibe Basket - Visual Verification Checklist

## 🌐 Website Access
- [ ] Open http://localhost:3000 in browser
- [ ] Website loads without errors
- [ ] No console errors in browser DevTools

## 🏠 Homepage (/)
- [ ] Hero section displays correctly
- [ ] "Shop Now" button works
- [ ] Categories section visible
- [ ] Featured products showing
- [ ] All images loading
- [ ] Footer present

## 📦 Products Page (/products)
- [ ] Products grid displays
- [ ] Search bar functional
- [ ] Filter by category works
- [ ] Product cards show price, image, title
- [ ] "Add to Cart" buttons present
- [ ] Pagination works (if >20 products)

## 🛒 Cart Page (/cart)
- [ ] Cart displays items
- [ ] Quantity controls work (+/-)
- [ ] Remove item button works
- [ ] Total price calculates correctly
- [ ] "Proceed to Checkout" button present
- [ ] Empty cart message (when no items)

## 🔐 Authentication
### Login (/login)
- [ ] Email field present
- [ ] Password field present
- [ ] "Login" button works
- [ ] "Register" link works
- [ ] Form validation working
- [ ] Error messages display

### Register (/register)
- [ ] Name field present
- [ ] Email field present
- [ ] Password field present
- [ ] "Register" button works
- [ ] "Login" link works
- [ ] Success redirects to dashboard

## 👤 Profile Page (/profile)
- [ ] User info displays (after login)
- [ ] Order history visible
- [ ] Logout button works
- [ ] Protected route (requires auth)

## 🤖 AI Features

### Chatbot (/chatbot)
- [ ] Chat interface loads
- [ ] Message input field present
- [ ] Send button works
- [ ] Loading indicator shows
- [ ] Error message for quota (expected)
- [ ] Message history displays
- [ ] UI is responsive

### Mood Finder (/mood)
- [ ] Form displays with fields:
  - [ ] Occasion dropdown
  - [ ] Mood selector
  - [ ] Budget input
- [ ] "Get Suggestions" button works
- [ ] Loading indicator shows
- [ ] Error message for quota (expected)
- [ ] UI is responsive

## 🧭 Navigation

### Desktop Menu
- [ ] Logo/Brand name visible
- [ ] "Products" link works
- [ ] "Cart" link works  
- [ ] "AI Assistant" link works
- [ ] "Mood Finder" link works
- [ ] Login/Profile button works

### Mobile Menu
- [ ] Hamburger menu icon present
- [ ] Menu opens on click
- [ ] All links accessible
- [ ] Menu closes properly

## 🎨 UI/UX Checks
- [ ] Consistent color scheme
- [ ] Readable fonts
- [ ] Buttons have hover effects
- [ ] Links change on hover
- [ ] Loading states present
- [ ] Error messages clear
- [ ] Success messages visible

## 📱 Responsive Design
- [ ] Desktop (>1024px) looks good
- [ ] Tablet (768-1024px) looks good
- [ ] Mobile (<768px) looks good
- [ ] No horizontal scroll
- [ ] Touch targets adequate on mobile

## 🔧 Backend API (via browser DevTools Network tab)
- [ ] API calls to http://localhost:4000/api
- [ ] Successful responses (200/201)
- [ ] JWT tokens in headers (authenticated routes)
- [ ] Error responses handled gracefully

## ⚡ Performance
- [ ] Pages load quickly (<2 seconds)
- [ ] No excessive network requests
- [ ] Images optimized
- [ ] No memory leaks (check DevTools)

## 🐛 Common Issues to Check
- [ ] No 404 errors on any page
- [ ] No broken images
- [ ] No CORS errors
- [ ] No authentication loops
- [ ] Cart persists across pages
- [ ] Login state persists

---

## ✅ Final Verification Steps

1. **Fresh User Journey:**
   - [ ] Register new account
   - [ ] Browse products
   - [ ] Add 3 items to cart
   - [ ] View cart
   - [ ] Create order
   - [ ] View order in profile
   - [ ] Logout
   - [ ] Login again

2. **AI Features Journey:**
   - [ ] Open chatbot
   - [ ] Send message "Hello"
   - [ ] Verify error message is clear
   - [ ] Open mood finder
   - [ ] Fill form and submit
   - [ ] Verify error message is clear

3. **Edge Cases:**
   - [ ] Try accessing /profile without login (should redirect)
   - [ ] Try empty cart checkout
   - [ ] Try invalid email format
   - [ ] Try weak password

---

## 📊 Expected Results

### ✅ Should Work Perfectly:
- All page navigation
- User authentication
- Product browsing
- Cart operations
- Order creation
- UI/UX experience

### ⚠️ Expected Limitations:
- AI Chatbot: Shows quota error (needs OpenAI credits)
- AI Mood: Shows quota error (needs OpenAI credits)

---

**Note:** Check browser console (F12) for any errors during testing.
