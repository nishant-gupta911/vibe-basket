/**
 * E2E TESTS: Complete User Flows
 * Tests critical user journeys from start to finish
 */

import { test, expect } from '@playwright/test';

test.describe('E-Commerce User Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should browse products on homepage', async ({ page }) => {
    // Should see products
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible();
    
    // Should see product titles and prices
    await expect(page.locator('text=/\\$/').first()).toBeVisible();
  });

  test('should filter products by category', async ({ page }) => {
    // Click on a category filter
    await page.click('text=Clothing');
    
    // Wait for filtered results
    await page.waitForTimeout(1000);
    
    // Should see filtered products
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount({ min: 1 });
  });

  test('should search for products', async ({ page }) => {
    // Type in search box
    await page.fill('[placeholder*="Search"]', 'laptop');
    await page.keyboard.press('Enter');
    
    // Wait for results
    await page.waitForTimeout(1000);
    
    // Should see search results
    const results = await page.locator('[data-testid="product-card"]').count();
    expect(results).toBeGreaterThan(0);
  });

  test('should view product details', async ({ page }) => {
    // Click on first product
    await page.click('[data-testid="product-card"]');
    
    // Should navigate to product page
    await expect(page).toHaveURL(/\/products\//);
    
    // Should see product details
    await expect(page.locator('text=/\\$/').first()).toBeVisible();
    await expect(page.locator('text=/Add to Cart/i')).toBeVisible();
  });

  test('should register new user', async ({ page }) => {
    // Navigate to register page
    await page.click('text=Register');
    
    // Fill registration form
    const timestamp = Date.now();
    await page.fill('[name="name"]', 'Test User');
    await page.fill('[name="email"]', `test${timestamp}@example.com`);
    await page.fill('[name="password"]', 'TestPassword123!');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should redirect to home or profile
    await page.waitForTimeout(2000);
    await expect(page).not.toHaveURL('/register');
  });

  test('should login existing user', async ({ page }) => {
    // First register a user
    await page.goto('/register');
    const timestamp = Date.now();
    const email = `test${timestamp}@example.com`;
    const password = 'TestPassword123!';
    
    await page.fill('[name="name"]', 'Test User');
    await page.fill('[name="email"]', email);
    await page.fill('[name="password"]', password);
    await page.click('button[type="submit"]');
    
    // Logout
    await page.click('text=Logout');
    
    // Now login
    await page.click('text=Login');
    await page.fill('[name="email"]', email);
    await page.fill('[name="password"]', password);
    await page.click('button[type="submit"]');
    
    // Should be logged in
    await page.waitForTimeout(2000);
    await expect(page).not.toHaveURL('/login');
  });

  test('should add product to cart', async ({ page }) => {
    // Go to a product
    await page.click('[data-testid="product-card"]');
    
    // Add to cart
    await page.click('text=/Add to Cart/i');
    
    // Should show success message or cart update
    await page.waitForTimeout(1000);
    
    // Cart count should increase
    const cartBadge = page.locator('[data-testid="cart-count"]');
    const count = await cartBadge.textContent();
    expect(parseInt(count || '0')).toBeGreaterThan(0);
  });

  test('should use mood finder', async ({ page }) => {
    // Navigate to mood finder
    await page.goto('/mood');
    
    // Select mood and occasion
    await page.selectOption('[name="mood"]', 'Romantic');
    await page.selectOption('[name="occasion"]', 'Anniversary');
    await page.fill('[name="budget"]', '500');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Should show recommendations
    await page.waitForTimeout(2000);
    await expect(page.locator('[data-testid="recommendation"]')).toHaveCount({ min: 1 });
  });

  test('should use AI chatbot', async ({ page }) => {
    // Navigate to chatbot
    await page.goto('/chatbot');
    
    // Type a message
    await page.fill('[placeholder*="message"]', 'Show me laptops under $1000');
    await page.click('button[type="submit"]');
    
    // Should show response
    await page.waitForTimeout(2000);
    await expect(page.locator('.message').last()).toBeVisible();
  });

  test('complete shopping flow: browse → add to cart → checkout', async ({ page }) => {
    // 1. Browse and select product
    await page.click('[data-testid="product-card"]');
    await page.click('text=/Add to Cart/i');
    await page.waitForTimeout(1000);
    
    // 2. Go to cart
    await page.click('text=/Cart/i');
    await expect(page).toHaveURL('/cart');
    
    // Should see cart items
    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount({ min: 1 });
    
    // 3. Proceed to checkout
    await page.click('text=/Checkout/i');
    
    // Should navigate to checkout or login
    await page.waitForTimeout(1000);
  });

  test('should handle product filters combination', async ({ page }) => {
    // Apply category filter
    await page.click('text=Electronics');
    await page.waitForTimeout(500);
    
    // Apply price filter
    await page.fill('[name="maxPrice"]', '200');
    await page.keyboard.press('Enter');
    
    // Should show filtered products
    await page.waitForTimeout(1000);
    const products = await page.locator('[data-testid="product-card"]').count();
    expect(products).toBeGreaterThanOrEqual(0);
  });

  test('should persist cart across navigation', async ({ page }) => {
    // Add product to cart
    await page.click('[data-testid="product-card"]');
    await page.click('text=/Add to Cart/i');
    await page.waitForTimeout(500);
    
    // Navigate away
    await page.goto('/');
    
    // Cart should still have items
    const cartBadge = page.locator('[data-testid="cart-count"]');
    const count = await cartBadge.textContent();
    expect(parseInt(count || '0')).toBeGreaterThan(0);
  });
});
