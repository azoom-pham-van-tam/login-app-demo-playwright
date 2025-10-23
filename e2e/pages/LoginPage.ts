import { Page, Locator, expect } from '@playwright/test'

export class LoginPage {
  readonly page: Page
  readonly usernameInput: Locator
  readonly passwordInput: Locator
  readonly loginButton: Locator
  readonly errorMessage: Locator
  readonly loadingMessage: Locator
  readonly loginCredentials: Locator

  constructor(page: Page) {
    this.page = page
    this.usernameInput = page.locator('#userName')
    this.passwordInput = page.locator('#password')
    this.loginButton = page.locator('button[type="submit"]')
    this.errorMessage = page.locator('.error-message')
    this.loadingMessage = page.locator('.loading')
    this.loginCredentials = page.getByText('Login Credentials:').locator('..')
  }

  /**
   * Navigate to the login page
   */
  async goto() {
    await this.page.goto('/')
  }

  /**
   * Fill in the login form with provided credentials
   */
  async fillLoginForm(username: string, password: string) {
    await this.usernameInput.fill(username)
    await this.passwordInput.fill(password)
  }

  /**
   * Click the login button
   */
  async clickLogin() {
    await this.loginButton.click()
  }

  /**
   * Perform complete login process
   */
  async login(username: string, password: string) {
    await this.fillLoginForm(username, password)
    await this.clickLogin()
  }

  /**
   * Wait for login to complete (either success or error)
   */
  async waitForLoginResult() {
    // Wait for either redirect to welcome page or error message
    await Promise.race([
      this.page.waitForURL('/welcome'),
      this.errorMessage.waitFor({ state: 'visible' })
    ])
  }

  /**
   * Check if login credentials info box is visible
   */
  async isCredentialsInfoVisible() {
    return await this.loginCredentials.isVisible()
  }

  /**
   * Get error message text
   */
  async getErrorMessage() {
    return await this.errorMessage.textContent()
  }

  /**
   * Check if loading state is visible
   */
  async isLoadingVisible() {
    return await this.loadingMessage.isVisible()
  }

  /**
   * Validate login form elements are present
   */
  async validateFormElements() {
    await expect(this.usernameInput).toBeVisible()
    await expect(this.passwordInput).toBeVisible()
    await expect(this.loginButton).toBeVisible()
    await expect(this.loginButton).toHaveText('Login')
  }

  /**
   * Validate placeholders
   */
  async validatePlaceholders() {
    await expect(this.usernameInput).toHaveAttribute(
      'placeholder',
      'Enter username'
    )
    await expect(this.passwordInput).toHaveAttribute(
      'placeholder',
      'Enter password'
    )
  }

  /**
   * Check if form is disabled (during loading)
   */
  async isFormDisabled() {
    const usernameDisabled = await this.usernameInput.isDisabled()
    const passwordDisabled = await this.passwordInput.isDisabled()
    const buttonDisabled = await this.loginButton.isDisabled()

    return usernameDisabled && passwordDisabled && buttonDisabled
  }
}
