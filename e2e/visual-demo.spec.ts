import { test, expect } from '@playwright/test'
import { LoginPage } from './pages/LoginPage'
import { WelcomePage } from './pages/WelcomePage'

test.describe('Visual Test Demo - Chrome Browser', () => {
  let loginPage: LoginPage
  let welcomePage: WelcomePage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    welcomePage = new WelcomePage(page)
  })

  test('Demo: Complete login flow with screenshots', async ({ page }) => {
    // Bước 1: Mở trang login
    console.log('🚀 Mở trang login...')
    await loginPage.goto()

    // Chụp ảnh trang login
    await page.screenshot({
      path: 'test-results/demo-01-login-page.png',
      fullPage: true
    })
    console.log('📸 Đã chụp ảnh trang login')

    // Validate form elements
    await expect(page.locator('h2')).toHaveText('Login')
    await expect(loginPage.usernameInput).toBeVisible()
    await expect(loginPage.passwordInput).toBeVisible()

    // Bước 2: Điền thông tin đăng nhập
    console.log('✍️ Điền thông tin đăng nhập...')
    await page.waitForTimeout(1000) // Pause để có thể thấy

    await loginPage.usernameInput.fill('admin')
    await page.waitForTimeout(500)

    await loginPage.passwordInput.fill('123')
    await page.waitForTimeout(500)

    // Chụp ảnh sau khi điền thông tin
    await page.screenshot({
      path: 'test-results/demo-02-form-filled.png',
      fullPage: true
    })
    console.log('📸 Đã chụp ảnh form đã điền')

    // Bước 3: Click login
    console.log('🔐 Đang đăng nhập...')
    await loginPage.clickLogin()

    // Chụp ảnh loading state (nếu có)
    try {
      if (await loginPage.loadingMessage.isVisible()) {
        await page.screenshot({
          path: 'test-results/demo-03-loading.png',
          fullPage: true
        })
        console.log('📸 Đã chụp ảnh loading state')
      }
    } catch {
      // Loading state có thể quá nhanh
    }

    // Đợi chuyển trang
    await page.waitForURL('/welcome')
    await page.waitForTimeout(1000)

    // Bước 4: Trang welcome
    console.log('🎉 Đăng nhập thành công! Vào trang welcome...')

    // Validate welcome page
    await expect(page.locator('h1')).toHaveText('🎉 Welcome!')
    await expect(page.locator('.user-info')).toContainText('Hello, admin!')

    // Chụp ảnh trang welcome
    await page.screenshot({
      path: 'test-results/demo-04-welcome-page.png',
      fullPage: true
    })
    console.log('📸 Đã chụp ảnh trang welcome')

    // Bước 5: Test logout
    console.log('🚪 Thực hiện logout...')
    await page.waitForTimeout(1000)

    await welcomePage.logout()
    await page.waitForURL('/')
    await page.waitForTimeout(1000)

    // Chụp ảnh sau logout
    await page.screenshot({
      path: 'test-results/demo-05-after-logout.png',
      fullPage: true
    })
    console.log('📸 Đã chụp ảnh sau logout')

    // Validate về lại trang login
    await expect(page.locator('h2')).toHaveText('Login')

    console.log(
      '✅ Demo hoàn thành! Kiểm tra thư mục test-results/ để xem ảnh chụp'
    )
  })

  test('Demo: Test invalid login with screenshots', async ({ page }) => {
    console.log('🚀 Demo test login sai thông tin...')

    await loginPage.goto()

    // Chụp ảnh ban đầu
    await page.screenshot({
      path: 'test-results/demo-invalid-01-login-page.png',
      fullPage: true
    })

    // Điền thông tin sai
    console.log('❌ Điền thông tin sai...')
    await loginPage.usernameInput.fill('wronguser')
    await page.waitForTimeout(500)
    await loginPage.passwordInput.fill('wrongpass')
    await page.waitForTimeout(500)

    // Chụp ảnh form với thông tin sai
    await page.screenshot({
      path: 'test-results/demo-invalid-02-wrong-credentials.png',
      fullPage: true
    })

    // Click login
    await loginPage.clickLogin()
    await page.waitForTimeout(1000)

    // Đợi error message
    await expect(loginPage.errorMessage).toBeVisible()

    // Chụp ảnh error
    await page.screenshot({
      path: 'test-results/demo-invalid-03-error-message.png',
      fullPage: true
    })
    console.log('📸 Đã chụp ảnh lỗi đăng nhập')

    // Validate error message
    const errorText = await loginPage.getErrorMessage()
    expect(errorText).toBe('Username or password is incorrect!')

    console.log('✅ Demo invalid login hoàn thành!')
  })

  test('Demo: Mobile responsive test', async ({ page }) => {
    console.log('📱 Demo test responsive mobile...')

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await loginPage.goto()

    // Chụp ảnh mobile view
    await page.screenshot({
      path: 'test-results/demo-mobile-01-login.png',
      fullPage: true
    })
    console.log('📸 Đã chụp ảnh mobile login')

    // Test login on mobile
    await loginPage.login('admin', '123')
    await page.waitForURL('/welcome')

    // Chụp ảnh mobile welcome
    await page.screenshot({
      path: 'test-results/demo-mobile-02-welcome.png',
      fullPage: true
    })
    console.log('📸 Đã chụp ảnh mobile welcome')

    console.log('✅ Demo mobile responsive hoàn thành!')
  })
})
