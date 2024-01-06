import type { Page, Locator } from '@playwright/test'
import { STORAGE_STATE } from '../../playwright.config'

export class AuthPage {
  private readonly emailInput: Locator
  private readonly passwordInput: Locator
  private readonly submitButton: Locator

  constructor(public readonly page: Page) {
    this.emailInput = this.page.getByLabel(/email address/i)
    this.passwordInput = this.page.getByLabel(/your password/i)
    this.submitButton = this.page.getByRole('button', { name: /sign in/i })
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

    // it should redirect, but the supabase auth ui isn't redirecting
    await this.page.waitForTimeout(500)
    await this.page.goto('/')

    await this.page.context().storageState({ path: STORAGE_STATE })
  }

  async logout() {
    await this.page.goto('/logout')
  }
}
