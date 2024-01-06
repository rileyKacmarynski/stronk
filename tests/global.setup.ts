import { test as setup } from './test'

setup('do login', async ({ page, authPage }) => {
  await page.goto('/')
  await authPage.login()
})
