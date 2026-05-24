import { test as setup, expect } from '@playwright/test';

/** API origin (not the Next proxy) — matches E2E workflow `API_PROXY_TARGET`. */
const apiOrigin = (process.env.API_PROXY_TARGET ?? 'http://127.0.0.1:3000').replace(
  /\/$/,
  '',
);

setup('API responds on /api', async ({ request }) => {
  await expect
    .poll(async () => (await request.get(`${apiOrigin}/api`)).status(), {
      timeout: 120_000,
    })
    .toBe(200);
});

setup('seeded student password login succeeds', async ({ request }) => {
  const email = process.env.PLAYWRIGHT_TEST_EMAIL ?? 'jest-student@soenglish.test';
  const password = process.env.PLAYWRIGHT_TEST_PASSWORD ?? 'TestPass123!';

  await expect
    .poll(
      async () =>
        (
          await request.post(`${apiOrigin}/api/auth/login`, {
            data: { email, password },
          })
        ).status(),
      { timeout: 60_000 },
    )
    .toBe(201);
});
