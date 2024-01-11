import { type Page, type Locator, expect } from '@playwright/test'
import { STORAGE_STATE } from '../../playwright.config'

export class AuthPage {
  private readonly emailInput: Locator
  private readonly passwordInput: Locator
  private readonly submitButton: Locator

  constructor(public readonly page: Page) {
    this.emailInput = this.page.getByLabel(/email/i)
    this.passwordInput = this.page.getByLabel(/password/i)
    this.submitButton = this.page.getByRole('button', { name: /log in/i })
  }

  async login() {
    console.log('logging in...')
    if (!process?.env?.VITE_PLAYWRIGHT_USER) {
      throw new Error('env missing VITE_PLAYWRIGHT_USER')
    }
    if (!process?.env?.VITE_PLAYWRIGHT_PASS) {
      throw new Error('env missing VITE_PLAYWRIGHT_PASS')
    }

    await this.emailInput.fill(process.env.VITE_PLAYWRIGHT_USER)
    await this.passwordInput.fill(process.env.VITE_PLAYWRIGHT_PASS)
    await this.submitButton.click()

    // wait for redirect to save context
    await expect(this.page.getByText('layout', { exact: true })).toBeVisible()

    await this.page.context().storageState({ path: STORAGE_STATE })
  }

  async logout() {
    await this.page.goto('/logout')
  }
}
