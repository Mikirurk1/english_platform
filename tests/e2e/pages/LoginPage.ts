import type { Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    const maxAttempts = process.env.CI ? 5 : 2;
    let lastStatus = 0;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      await this.page.getByLabel(/email/i).fill(email);
      await this.page.getByLabel(/password/i).fill(password);
      const loginResponse = this.page.waitForResponse(
        (res) =>
          res.url().includes('/api/auth/login') && res.request().method() === 'POST',
        { timeout: 30_000 },
      );
      await this.page.getByRole('button', { name: /sign in|log in|увійти/i }).click();
      const response = await loginResponse;
      lastStatus = response.status();

      if (response.ok()) {
        await this.page.waitForURL(/\/dashboard/, { timeout: 15_000 });
        return;
      }

      if (lastStatus >= 500 && attempt < maxAttempts) {
        await this.page.waitForTimeout(1500 * attempt);
        await this.goto();
        continue;
      }

      throw new Error(`Login failed with status ${lastStatus}`);
    }
  }
}
