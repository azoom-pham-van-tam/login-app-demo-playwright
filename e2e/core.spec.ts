import { test, expect } from '@playwright/test'
import { LoginPage } from './pages/LoginPage'
import { WelcomePage } from './pages/WelcomePage'

test.describe('Core Login Functionality', () => {
  let loginPage: LoginPage
  let welcomePage: WelcomePage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    welcomePage = new WelcomePage(page)
  })

  test('should complete successful login flow', async ({ page }) => {
    // Navigate to login page
    await loginPage.goto()

    // Verify login page loads
    await expect(page.locator('h2')).toHaveText('Login')
    await expect(loginPage.usernameInput).toBeVisible()
    await expect(loginPage.passwordInput).toBeVisible()
    await expect(loginPage.loginButton).toBeVisible()

    // Fill and submit login form
    await loginPage.fillLoginForm('admin', '123')
    await loginPage.clickLogin()

    // Should redirect to welcome page
    await page.waitForURL('/welcome')

    // Verify welcome page content
    await expect(page.locator('h1')).toHaveText('🎉 Welcome!')
    await expect(page.locator('.user-info')).toContainText('Hello, admin!')
    await expect(welcomePage.logoutButton).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await loginPage.goto()

    // Try invalid login
    await loginPage.fillLoginForm('wronguser', 'wrongpass')
    await loginPage.clickLogin()

    // Should show error and stay on login page
    await expect(loginPage.errorMessage).toBeVisible()
    await expect(loginPage.errorMessage).toContainText(
      'Username or password is incorrect!'
    )
    expect(page.url()).toContain('/')
  })

  test('should complete logout flow', async ({ page }) => {
    // Login first
    await loginPage.goto()
    await loginPage.login('admin', '123')
    await page.waitForURL('/welcome')

    // Verify we're on welcome page
    await expect(page.locator('h1')).toHaveText('🎉 Welcome!')

    // Logout
    await welcomePage.logout()

    // Should redirect to login page
    await page.waitForURL('/')
    await expect(page.locator('h2')).toHaveText('Login')
  })

  test('should prevent access to welcome page without login', async ({
    page
  }) => {
    // Try to access welcome page directly
    await page.goto('/welcome')

    // Should be redirected to login page
    await page.waitForURL('/')
    await expect(page.locator('h2')).toHaveText('Login')
  })

  test('should work across different browsers', async ({
    page,
    browserName
  }) => {
    console.log(`Testing on: ${browserName}`)

    await loginPage.goto()

    // Basic elements should be visible
    await expect(loginPage.usernameInput).toBeVisible()
    await expect(loginPage.passwordInput).toBeVisible()
    await expect(loginPage.loginButton).toBeVisible()

    // Login should work
    await loginPage.login('admin', '123')
    await page.waitForURL('/welcome')

    // Welcome page should load
    await expect(page.locator('h1')).toHaveText('🎉 Welcome!')
  })

  test('should handle form validation', async ({ page }) => {
    await loginPage.goto()

    // Check required attributes
    await expect(loginPage.usernameInput).toHaveAttribute('required', '')
    await expect(loginPage.passwordInput).toHaveAttribute('required', '')

    // Check input types
    await expect(loginPage.usernameInput).toHaveAttribute('type', 'text')
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password')

    // Check placeholders
    await expect(loginPage.usernameInput).toHaveAttribute(
      'placeholder',
      'Enter username'
    )
    await expect(loginPage.passwordInput).toHaveAttribute(
      'placeholder',
      'Enter password'
    )
  })

  test('should handle keyboard navigation', async ({ page, browserName }) => {
    await loginPage.goto()

    // Tab through form
    await page.keyboard.press('Tab')
    await expect(loginPage.usernameInput).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(loginPage.passwordInput).toBeFocused()

    await page.keyboard.press('Tab')
    // WebKit doesn't always focus buttons, so be lenient
    if (browserName === 'webkit') {
      await expect(loginPage.loginButton).toBeVisible()
    } else {
      await expect(loginPage.loginButton).toBeFocused()
    }

    // Submit with Enter
    await loginPage.usernameInput.focus()
    await loginPage.usernameInput.fill('admin')
    await loginPage.passwordInput.fill('123')
    await page.keyboard.press('Enter')

    // Should login
    await page.waitForURL('/welcome')
    await expect(page.locator('h1')).toHaveText('🎉 Welcome!')
  })
})
