import { test, expect } from '@playwright/test'

test.describe('Step-by-Step Visual Test', () => {
  test('Interactive login demo with detailed screenshots', async ({ page }) => {
    // Slow down for better visibility
    test.slow()

    console.log('🎬 Bắt đầu demo tương tác...')

    // Step 1: Navigate to login page
    console.log('📍 Bước 1: Mở trang login')
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Take screenshot of initial page
    await page.screenshot({
      path: 'test-results/step-01-initial-page.png',
      fullPage: true
    })
    console.log('✅ Screenshot: Trang login ban đầu')

    // Add some delay to see the action
    await page.waitForTimeout(2000)

    // Step 2: Focus on username field
    console.log('📍 Bước 2: Focus vào ô username')
    await page.locator('#userName').focus()
    await page.waitForTimeout(1000)

    await page.screenshot({
      path: 'test-results/step-02-username-focus.png',
      fullPage: true
    })
    console.log('✅ Screenshot: Username field được focus')

    // Step 3: Type username slowly
    console.log('📍 Bước 3: Nhập username từng ký tự')
    await page.locator('#userName').type('admin', { delay: 300 })
    await page.waitForTimeout(1000)

    await page.screenshot({
      path: 'test-results/step-03-username-typed.png',
      fullPage: true
    })
    console.log('✅ Screenshot: Đã nhập username')

    // Step 4: Focus on password field
    console.log('📍 Bước 4: Focus vào ô password')
    await page.locator('#password').focus()
    await page.waitForTimeout(1000)

    await page.screenshot({
      path: 'test-results/step-04-password-focus.png',
      fullPage: true
    })
    console.log('✅ Screenshot: Password field được focus')

    // Step 5: Type password slowly
    console.log('📍 Bước 5: Nhập password từng ký tự')
    await page.locator('#password').type('123', { delay: 300 })
    await page.waitForTimeout(1000)

    await page.screenshot({
      path: 'test-results/step-05-password-typed.png',
      fullPage: true
    })
    console.log('✅ Screenshot: Đã nhập password (ẩn)')

    // Step 6: Hover over login button
    console.log('📍 Bước 6: Hover vào nút Login')
    await page.locator('button[type="submit"]').hover()
    await page.waitForTimeout(1000)

    await page.screenshot({
      path: 'test-results/step-06-button-hover.png',
      fullPage: true
    })
    console.log('✅ Screenshot: Hover nút Login')

    // Step 7: Click login button
    console.log('📍 Bước 7: Click nút Login')
    await page.locator('button[type="submit"]').click()

    // Capture the moment of clicking
    await page.screenshot({
      path: 'test-results/step-07-button-clicked.png',
      fullPage: true
    })
    console.log('✅ Screenshot: Đã click nút Login')

    // Step 8: Wait for redirect and capture welcome page
    console.log('📍 Bước 8: Đợi chuyển hướng tới trang welcome')
    await page.waitForURL('/welcome')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    await page.screenshot({
      path: 'test-results/step-08-welcome-page.png',
      fullPage: true
    })
    console.log('✅ Screenshot: Trang welcome đã load')

    // Step 9: Highlight user info
    console.log('📍 Bước 9: Highlight thông tin user')
    await page.locator('.user-info').scrollIntoViewIfNeeded()
    await page.waitForTimeout(1000)

    await page.screenshot({
      path: 'test-results/step-09-user-info-highlighted.png',
      fullPage: true
    })
    console.log('✅ Screenshot: Thông tin user được highlight')

    // Step 10: Hover over logout button
    console.log('📍 Bước 10: Hover vào nút Logout')
    await page.locator('button').filter({ hasText: 'Logout' }).hover()
    await page.waitForTimeout(1000)

    await page.screenshot({
      path: 'test-results/step-10-logout-hover.png',
      fullPage: true
    })
    console.log('✅ Screenshot: Hover nút Logout')

    // Step 11: Click logout
    console.log('📍 Bước 11: Click nút Logout')
    await page.locator('button').filter({ hasText: 'Logout' }).click()

    // Step 12: Back to login page
    console.log('📍 Bước 12: Quay lại trang login')
    await page.waitForURL('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    await page.screenshot({
      path: 'test-results/step-12-back-to-login.png',
      fullPage: true
    })
    console.log('✅ Screenshot: Đã logout, quay lại trang login')

    // Final validation
    await expect(page.locator('h2')).toHaveText('Login')

    console.log('🎉 Demo hoàn thành! Đã tạo 12 screenshots chi tiết')
    console.log('📂 Xem các file ảnh trong thư mục test-results/')
  })

  test('Demo error handling with screenshots', async ({ page }) => {
    console.log('🚫 Demo xử lý lỗi với screenshots...')

    // Navigate to login
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Try with wrong credentials
    console.log('📍 Nhập thông tin sai')
    await page.locator('#userName').fill('wronguser')
    await page.locator('#password').fill('wrongpass')

    await page.screenshot({
      path: 'test-results/error-01-wrong-credentials.png',
      fullPage: true
    })

    // Click login
    await page.locator('button[type="submit"]').click()
    await page.waitForTimeout(2000)

    // Capture error state
    await page.screenshot({
      path: 'test-results/error-02-error-displayed.png',
      fullPage: true
    })

    // Validate error message
    await expect(page.locator('.error-message')).toBeVisible()
    console.log('✅ Error message hiển thị đúng')

    // Clear and try empty fields
    await page.locator('#userName').clear()
    await page.locator('#password').clear()

    await page.screenshot({
      path: 'test-results/error-03-empty-fields.png',
      fullPage: true
    })

    console.log('🎉 Demo error handling hoàn thành!')
  })
})
