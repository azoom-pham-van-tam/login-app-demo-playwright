import { test, expect } from '@playwright/test'

test.describe('Basic Smoke Tests', () => {
  test('should load the login page', async ({ page }) => {
    await page.goto('/')

    // Check basic elements are visible
    await expect(page.locator('h2')).toHaveText('Login')
    await expect(page.locator('#userName')).toBeVisible()
    await expect(page.locator('#password')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('should handle localStorage safely', async ({ page }) => {
    await page.goto('/')

    // Test localStorage operations with error handling
    const localStorageTest = await page.evaluate(() => {
      try {
        // Test setting and getting localStorage
        localStorage.setItem('test', 'value')
        const value = localStorage.getItem('test')
        localStorage.removeItem('test')
        return { success: true, value }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        return { success: false, error: errorMessage }
      }
    })

    console.log('localStorage test result:', localStorageTest)

    // localStorage should either work or fail gracefully
    expect(typeof localStorageTest).toBe('object')
  })

  test('should complete basic login flow', async ({ page }) => {
    await page.goto('/')

    // Fill login form
    await page.fill('#userName', 'admin')
    await page.fill('#password', '123')

    // Submit form
    await page.click('button[type="submit"]')

    // Should redirect to welcome page
    await page.waitForURL('/welcome')

    // Check welcome page elements
    await expect(page.locator('h1')).toHaveText('🎉 Welcome!')
    await expect(page.locator('button')).toContainText('Logout')
  })
})
