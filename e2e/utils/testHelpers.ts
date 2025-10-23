import { Page } from '@playwright/test'

/**
 * Test data constants
 */
export const TEST_DATA = {
  validCredentials: {
    username: 'admin',
    password: '123'
  },
  invalidCredentials: [
    {
      username: 'admin',
      password: 'wrong',
      expectedError: 'Username or password is incorrect!'
    },
    {
      username: 'wronguser',
      password: '123',
      expectedError: 'Username or password is incorrect!'
    },
    {
      username: 'wronguser',
      password: 'wrong',
      expectedError: 'Username or password is incorrect!'
    },
    { username: '', password: '123', expectedError: null }, // Should not submit due to required validation
    { username: 'admin', password: '', expectedError: null } // Should not submit due to required validation
  ]
}

/**
 * Authentication helpers
 */
export class AuthHelper {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  /**
   * Login with valid credentials and wait for success
   */
  async loginAsValidUser() {
    const { username, password } = TEST_DATA.validCredentials

    await this.page.goto('/')
    await this.page.fill('#userName', username)
    await this.page.fill('#password', password)
    await this.page.click('button[type="submit"]')
    await this.page.waitForURL('/welcome')
  }

  /**
   * Check if user is logged in by checking localStorage
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      const isLoggedIn = await this.page.evaluate(() => {
        try {
          return localStorage.getItem('isLoggedIn') === 'true'
        } catch (e) {
          console.warn('localStorage not available:', e)
          return false
        }
      })
      return isLoggedIn
    } catch (error) {
      console.warn('Failed to check localStorage:', error)
      return false
    }
  }

  /**
   * Clear authentication state
   */
  async clearAuthState() {
    try {
      await this.page.evaluate(() => {
        try {
          localStorage.removeItem('user')
          localStorage.removeItem('isLoggedIn')
        } catch (e) {
          console.warn('Failed to clear localStorage:', e)
        }
      })
    } catch (error) {
      console.warn('Failed to clear auth state:', error)
    }
  }

  /**
   * Set authentication state manually (for testing protected routes)
   */
  async setAuthState(username: string = 'admin') {
    try {
      await this.page.evaluate(
        ({ username }) => {
          try {
            localStorage.setItem('isLoggedIn', 'true')
            localStorage.setItem('user', JSON.stringify({ userName: username }))
          } catch (e) {
            console.warn('Failed to set localStorage:', e)
          }
        },
        { username }
      )
    } catch (error) {
      console.warn('Failed to set auth state:', error)
    }
  }
}

/**
 * Network helpers
 */
export class NetworkHelper {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  /**
   * Mock login API response
   */
  async mockLoginResponse(success: boolean, message: string = '') {
    await this.page.route('/api/login', async route => {
      const response = success
        ? {
            success: true,
            message: 'Login successful!',
            user: { userName: 'admin' }
          }
        : {
            success: false,
            message: message || 'Username or password is incorrect!'
          }

      await route.fulfill({
        status: success ? 200 : 401,
        contentType: 'application/json',
        body: JSON.stringify(response)
      })
    })
  }

  /**
   * Mock network failure
   */
  async mockNetworkFailure() {
    await this.page.route('/api/login', async route => {
      await route.abort('failed')
    })
  }

  /**
   * Intercept and capture login requests
   */
  async interceptLoginRequests(): Promise<any[]> {
    const requests: any[] = []

    await this.page.route('/api/login', async route => {
      const request = route.request()
      requests.push({
        method: request.method(),
        url: request.url(),
        postData: request.postData()
      })
      await route.continue()
    })

    return requests
  }
}

/**
 * UI helpers
 */
export class UIHelper {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  /**
   * Wait for loading state to disappear
   */
  async waitForLoadingToComplete() {
    await this.page.locator('.loading').waitFor({ state: 'hidden' })
  }

  /**
   * Take screenshot with timestamp
   */
  async takeScreenshot(name: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    await this.page.screenshot({
      path: `test-results/screenshots/${name}-${timestamp}.png`,
      fullPage: true
    })
  }

  /**
   * Check console for errors
   */
  async getConsoleErrors(): Promise<string[]> {
    const errors: string[] = []

    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    return errors
  }

  /**
   * Check for JavaScript errors
   */
  async hasJavaScriptErrors(): Promise<boolean> {
    const errors = await this.getConsoleErrors()
    return errors.length > 0
  }
}

/**
 * Viewport helpers for responsive testing
 */
export class ViewportHelper {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  static readonly VIEWPORTS = {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1280, height: 720 },
    largeDesktop: { width: 1920, height: 1080 }
  }

  /**
   * Set viewport size
   */
  async setViewport(viewport: keyof typeof ViewportHelper.VIEWPORTS) {
    await this.page.setViewportSize(ViewportHelper.VIEWPORTS[viewport])
  }

  /**
   * Test responsive behavior across multiple viewports
   */
  async testAcrossViewports(testFn: () => Promise<void>) {
    for (const [name, size] of Object.entries(ViewportHelper.VIEWPORTS)) {
      await this.page.setViewportSize(size)
      await testFn()
    }
  }
}
