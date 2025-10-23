import { test, expect } from '@playwright/test';

// File test được tạo step-by-step cùng với thao tác thực tế
// Generated from live interaction with the login app

test.describe('Login App - Step by Step Test', () => {
  
  // BƯỚC 1: Mở trang web
  test('Bước 1: Mở trang login và kiểm tra giao diện', async ({ page }) => {
    console.log('🌐 BƯỚC 1: Mở trang login');
    
    // Navigate to login page
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('domcontentloaded');
    
    // Verify page title
    await expect(page).toHaveTitle('Login App');
    console.log('✅ Page title: Login App');
    
    // Verify login heading
    await expect(page.locator('h2')).toHaveText('Login');
    console.log('✅ Heading: Login');
    
    // Verify username input exists and has correct placeholder
    const usernameInput = page.locator('input[placeholder="Enter username"]');
    await expect(usernameInput).toBeVisible();
    console.log('✅ Username input field hiển thị');
    
    // Verify password input exists and has correct placeholder
    const passwordInput = page.locator('input[placeholder="Enter password"]');
    await expect(passwordInput).toBeVisible();
    console.log('✅ Password input field hiển thị');
    
    // Verify login button exists and is clickable
    const loginButton = page.locator('button', { hasText: 'Login' });
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toBeEnabled();
    console.log('✅ Login button hiển thị và có thể click');
    
    // Verify credentials guide is shown
    await expect(page.locator('strong')).toHaveText('Login Credentials:');
    await expect(page.locator('code').first()).toHaveText('admin');
    await expect(page.locator('code').last()).toHaveText('123');
    console.log('✅ Hướng dẫn credentials hiển thị: admin/123');
    
    // Take screenshot for documentation
    await page.screenshot({ 
      path: 'test-results/step-01-page-loaded.png',
      fullPage: true 
    });
    console.log('📸 Screenshot saved: step-01-page-loaded.png');
    
    console.log('🎉 BƯỚC 1 hoàn thành: Trang login đã load thành công');
  });
  
});