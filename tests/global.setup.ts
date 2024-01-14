import { test as setup } from './test'

setup('do login', async ({ page, authPage }) => {
  await page.goto('/', { timeout: 0 })
  await authPage.login()
})
