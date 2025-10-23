// Global setup for Playwright tests
import { chromium, FullConfig } from '@playwright/test'

// Global setup function that runs before all tests
async function globalSetup(config: FullConfig) {
  console.log('Running global setup...')

  const browser = await chromium.launch()
  const context = await browser.newContext()

  const page = await context.newPage()

  // Navigate to the base URL to establish the domain context
  await page.goto('http://localhost:3000/')

  // Wait for the page to load completely
  await page.waitForLoadState('networkidle')

  // Clear any existing localStorage to ensure clean state
  await page.evaluate(() => {
    try {
      localStorage.clear()
    } catch (e) {
      console.warn('Could not clear localStorage:', e)
    }
  })

  await browser.close()
  console.log('Global setup completed')
} // Export helper function for safe localStorage operations
export async function safeLocalStorageOperation(
  page: any,
  operation: () => any
) {
  try {
    return await page.evaluate(operation)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (
      errorMessage.includes('localStorage') ||
      errorMessage.includes('Access is denied')
    ) {
      console.warn('localStorage access denied, using fallback method')
      return null
    }
    throw error
  }
}

export default globalSetup
