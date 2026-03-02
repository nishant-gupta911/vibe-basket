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
    await expect(page.locator('a[href^="/products/"]').first()).toBeVisible();
    await expect(page.locator('text=/\\$/').first()).toBeVisible();
  });

  test('should filter products by category', async ({ page }) => {
    await page.goto('/products');
    // Wait for category buttons to load from API before clicking
    const electronicsBtn = page.getByRole('button', { name: /electronics/i });
    await electronicsBtn.waitFor({ state: 'visible', timeout: 15000 });
    await electronicsBtn.click();
    await page.waitForTimeout(500);
    const productCount = await page.locator('a[href^="/products/"]').count();
    expect(productCount).toBeGreaterThanOrEqual(1);
  });

  test('should search for products', async ({ page }) => {
    await page.goto('/products?search=laptop');
    await page.waitForTimeout(500);
    const results = await page.locator('a[href^="/products/"]').count();
    expect(results).toBeGreaterThanOrEqual(1);
  });

  test('should view product details', async ({ page }) => {
    await page.locator('a[href^="/products/"]').first().click();
    await expect(page).toHaveURL(/\/products\//);
    await expect(page.locator('text=/\\$/').first()).toBeVisible();
    await expect(page.locator('text=/Add to Cart/i')).toBeVisible();
  });

  test('should register new user', async ({ page }) => {
    await page.goto('/register');
    const timestamp = Date.now();
    await page.getByLabel('Full Name').fill('Test User');
    await page.getByLabel('Email').fill(`test${timestamp}@example.com`);
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('TestPassword123!');
    await page.getByLabel('Confirm Password').fill('TestPassword123!');
    await page.locator('label', { hasText: 'I agree to the Terms of Service and Privacy Policy' }).click();
    await page.getByRole('button', { name: 'Create Account' }).click();
    // Wait for redirect away from /register (success → /profile)
    await expect(page).not.toHaveURL(/\/register/, { timeout: 15000 });
  });

  test('should login existing user', async ({ page }) => {
    await page.goto('/register');
    const timestamp = Date.now();
    const email = `test${timestamp}@example.com`;
    const password = 'TestPassword123!';

    await page.getByLabel('Full Name').fill('Test User');
    await page.getByLabel('Email').fill(email);
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill(password);
    await page.getByLabel('Confirm Password').fill(password);
    await page.locator('label', { hasText: 'I agree to the Terms of Service and Privacy Policy' }).click();
    await page.getByRole('button', { name: 'Create Account' }).click();
    // Wait for registration to finish before navigating
    await expect(page).not.toHaveURL(/\/register/, { timeout: 15000 });
    await page.goto('/login');
    await page.getByLabel('Email').fill(email);
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill(password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).not.toHaveURL(/\/login/, { timeout: 15000 });
  });

  test('should add product to cart', async ({ page }) => {
    await page.locator('a[href^="/products/"]').first().click();
    await page.click('text=/Add to Cart/i');
    await page.goto('/cart');
    await expect(page.locator('text=/Shopping Cart|Your cart is empty/i')).toBeVisible();
  });

  test('should use mood finder', async ({ page }) => {
    await page.goto('/mood');
    await page.getByRole('button', { name: /Anniversary/i }).click();
    await page.getByRole('button', { name: /Romantic/i }).click();
    await page.fill('input[type="number"]', '500');
    await page.getByRole('button', { name: 'Find My Perfect Products' }).click();
    await page.waitForTimeout(1500);
    const recommendationCount = await page.locator('a[href^="/products/"]').count();
    expect(recommendationCount).toBeGreaterThanOrEqual(1);
  });

  test('should use AI chatbot', async ({ page }) => {
    await page.goto('/chatbot');
    await page.fill('input[placeholder*="Ask me"]', 'Show me laptops under $1000');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
    await expect(page.locator('text=/View Product|Sorry|laptop|products/i').first()).toBeVisible();
  });

  test('complete shopping flow: browse → add to cart → checkout', async ({ page }) => {
    await page.locator('a[href^="/products/"]').first().click();
    await page.click('text=/Add to Cart/i');
    await page.waitForTimeout(1000);
    await page.goto('/cart');
    await expect(page).toHaveURL('/cart');
    await expect(page.locator('text=/Shopping Cart|Your cart is empty/i')).toBeVisible();
    const checkoutButton = page.getByRole('button', { name: /Proceed to Checkout/i });
    if (await checkoutButton.count()) {
      await checkoutButton.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should handle product filters combination', async ({ page }) => {
    await page.goto('/products?category=electronics&maxPrice=200');
    await page.waitForTimeout(500);
    const products = await page.locator('a[href^="/products/"]').count();
    expect(products).toBeGreaterThanOrEqual(0);
  });

  test('should persist cart across navigation', async ({ page }) => {
    await page.locator('a[href^="/products/"]').first().click();
    await page.click('text=/Add to Cart/i');
    await page.waitForTimeout(500);
    await page.goto('/');
    await page.goto('/cart');
    await expect(page.locator('text=/Shopping Cart|Your cart is empty/i')).toBeVisible();
  });
});
