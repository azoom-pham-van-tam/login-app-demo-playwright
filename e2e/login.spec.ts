import { test, expect, Page } from '@playwright/test'
import { LoginPage } from './pages/LoginPage'
import { WelcomePage } from './pages/WelcomePage'
import { TEST_DATA, AuthHelper, UIHelper } from './utils/testHelpers'

test.describe('Login Functionality', () => {
  let loginPage: LoginPage
  let welcomePage: WelcomePage
  let authHelper: AuthHelper
  let uiHelper: UIHelper

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    welcomePage = new WelcomePage(page)
    authHelper = new AuthHelper(page)
    uiHelper = new UIHelper(page)

    // Clear any existing auth state
    await authHelper.clearAuthState()
    await loginPage.goto()
  })

  test.describe('Valid Login', () => {
    test('should login successfully with valid credentials', async ({
      page
    }) => {
      const { username, password } = TEST_DATA.validCredentials

      // Fill and submit login form
      await loginPage.fillLoginForm(username, password)
      await loginPage.clickLogin()

      // Should redirect to welcome page
      await page.waitForURL('/welcome')

      // Validate welcome page content
      await welcomePage.validateWelcomeElements()
      await welcomePage.validateUserInfo(username)

      // Check localStorage state
      expect(await authHelper.isLoggedIn()).toBe(true)
    })

    test('should show login credentials info', async ({ page }) => {
      await expect(await loginPage.isCredentialsInfoVisible()).toBe(true)
    })

    test('should have proper form validation attributes', async ({ page }) => {
      await loginPage.validateFormElements()
      await loginPage.validatePlaceholders()

      // Check required attributes
      await expect(loginPage.usernameInput).toHaveAttribute('required', '')
      await expect(loginPage.passwordInput).toHaveAttribute('required', '')
    })
  })

  test.describe('Invalid Login', () => {
    test('should show error for invalid credentials', async ({ page }) => {
      await loginPage.fillLoginForm('wronguser', 'wrongpass')
      await loginPage.clickLogin()

      // Should show error message
      await expect(loginPage.errorMessage).toBeVisible()
      const errorText = await loginPage.getErrorMessage()
      expect(errorText).toBe('Username or password is incorrect!')

      // Should remain on login page
      expect(page.url()).toContain('/')
    })

    test('should show error for wrong username', async ({ page }) => {
      await loginPage.fillLoginForm('wronguser', '123')
      await loginPage.clickLogin()

      await expect(loginPage.errorMessage).toBeVisible()
      const errorText = await loginPage.getErrorMessage()
      expect(errorText).toBe('Username or password is incorrect!')
    })

    test('should show error for wrong password', async ({ page }) => {
      await loginPage.fillLoginForm('admin', 'wrong')
      await loginPage.clickLogin()

      await expect(loginPage.errorMessage).toBeVisible()
      const errorText = await loginPage.getErrorMessage()
      expect(errorText).toBe('Username or password is incorrect!')
    })

    test('should show error for both wrong username and password', async ({
      page
    }) => {
      await loginPage.fillLoginForm('wronguser', 'wrong')
      await loginPage.clickLogin()

      await expect(loginPage.errorMessage).toBeVisible()
      const errorText = await loginPage.getErrorMessage()
      expect(errorText).toBe('Username or password is incorrect!')
    })

    test('should prevent submission with empty username', async ({ page }) => {
      await loginPage.fillLoginForm('', '123')

      // Form should not submit due to HTML5 validation
      await expect(loginPage.usernameInput).toHaveAttribute('required')

      // Try to click submit - should not proceed
      await loginPage.clickLogin()

      // Should still be on login page
      expect(page.url()).toContain('/')
    })

    test('should prevent submission with empty password', async ({ page }) => {
      await loginPage.fillLoginForm('admin', '')

      // Form should not submit due to HTML5 validation
      await expect(loginPage.passwordInput).toHaveAttribute('required')

      // Try to click submit - should not proceed
      await loginPage.clickLogin()

      // Should still be on login page
      expect(page.url()).toContain('/')
    })
  })

  test.describe('Loading States', () => {
    test('should show loading state during login', async ({ page }) => {
      const { username, password } = TEST_DATA.validCredentials

      // Slow down the network to observe loading state
      await page.route('/api/login', async route => {
        // Delay the response by 1 second
        await new Promise(resolve => setTimeout(resolve, 1000))
        await route.continue()
      })

      await loginPage.fillLoginForm(username, password)

      // Start login process
      const loginPromise = loginPage.clickLogin()

      // Check loading state appears
      await expect(loginPage.loadingMessage).toBeVisible()
      await expect(loginPage.loginButton).toHaveText('Logging in...')

      // Form should be disabled during loading
      expect(await loginPage.isFormDisabled()).toBe(true)

      // Wait for login to complete
      await loginPromise
      await page.waitForURL('/welcome')
    })
  })

  test.describe('UI Responsiveness', () => {
    test('should be responsive on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      await loginPage.validateFormElements()

      // Check that elements are still visible and accessible
      await expect(loginPage.usernameInput).toBeVisible()
      await expect(loginPage.passwordInput).toBeVisible()
      await expect(loginPage.loginButton).toBeVisible()
    })

    test('should be responsive on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })

      await loginPage.validateFormElements()

      // Login should work on tablet
      const { username, password } = TEST_DATA.validCredentials
      await loginPage.login(username, password)
      await page.waitForURL('/welcome')
      await welcomePage.validateWelcomeElements()
    })
  })

  test.describe('Security', () => {
    test('password field should be masked', async ({ page }) => {
      await expect(loginPage.passwordInput).toHaveAttribute('type', 'password')
    })

    test('should not expose credentials in URL or network logs', async ({
      page
    }) => {
      const { username, password } = TEST_DATA.validCredentials

      // Monitor network requests
      const requests: any[] = []
      page.on('request', request => {
        if (request.url().includes('/api/login')) {
          requests.push({
            url: request.url(),
            method: request.method(),
            postData: request.postData()
          })
        }
      })

      await loginPage.login(username, password)
      await page.waitForURL('/welcome')

      // Verify credentials are sent via POST body, not URL
      expect(requests).toHaveLength(1)
      expect(requests[0].method).toBe('POST')
      expect(requests[0].url).not.toContain(username)
      expect(requests[0].url).not.toContain(password)

      // Verify POST data contains credentials
      const postData = JSON.parse(requests[0].postData || '{}')
      expect(postData.userName).toBe(username)
      expect(postData.password).toBe(password)
    })
  })
})
