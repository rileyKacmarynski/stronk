import { test, expect } from '../test'

test('logged in', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByTestId('layout')).toBeVisible()
})
