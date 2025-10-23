import { Page, Locator, expect } from '@playwright/test'

export class WelcomePage {
  readonly page: Page
  readonly welcomeTitle: Locator
  readonly userInfo: Locator
  readonly welcomeMessage: Locator
  readonly logoutButton: Locator

  constructor(page: Page) {
    this.page = page
    this.welcomeTitle = page.locator('h1')
    this.userInfo = page.locator('.user-info')
    this.welcomeMessage = page
      .locator('p')
      .filter({ hasText: 'Welcome to the application homepage!' })
    this.logoutButton = page.locator('button').filter({ hasText: 'Logout' })
  }

  /**
   * Navigate directly to welcome page
   */
  async goto() {
    await this.page.goto('/welcome')
  }

  /**
   * Validate welcome page elements
   */
  async validateWelcomeElements() {
    await expect(this.welcomeTitle).toBeVisible()
    await expect(this.welcomeTitle).toHaveText('🎉 Welcome!')
    await expect(this.welcomeMessage).toBeVisible()
    await expect(this.logoutButton).toBeVisible()
  }

  /**
   * Validate user info is displayed
   */
  async validateUserInfo(username: string) {
    await expect(this.userInfo).toBeVisible()
    await expect(this.userInfo).toContainText(`Hello, ${username}!`)
    await expect(this.userInfo).toContainText(
      'You have successfully logged into the system.'
    )
  }

  /**
   * Click logout button
   */
  async logout() {
    await this.logoutButton.click()
  }

  /**
   * Wait for redirect to login page after logout
   */
  async waitForLogout() {
    await this.page.waitForURL('/')
  }

  /**
   * Get welcome title text
   */
  async getWelcomeTitle() {
    return await this.welcomeTitle.textContent()
  }

  /**
   * Get user greeting text
   */
  async getUserGreeting() {
    return await this.userInfo.textContent()
  }

  /**
   * Check if page is accessible (for authentication tests)
   */
  async isPageAccessible() {
    try {
      await this.validateWelcomeElements()
      return true
    } catch {
      return false
    }
  }
}
