import { test, expect } from '@playwright/test';

test.describe('Mood Detective E2E', () => {
  test('complete 5-round game and see summary', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Game/i }).click();
    for (let i = 0; i < 5; i++) {
      // Click any choice; game logic handles scoring
      await page
        .getByRole('button', { name: /Happy|Sad|Angry/i })
        .first()
        .click();
      // small wait to allow next sentence or summary
      await page.waitForTimeout(150);
    }
    await expect(page.getByText(/Summary/)).toBeVisible();
    await expect(page.getByLabel(/Stars earned/)).toBeVisible();
  });

  test('certificate renders and can prepare download UI', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Certificate/i }).click();
    await page.getByLabel('Name').fill('Ava');
    await page.getByLabel('Stars').fill('4');
    const btn = page.getByRole('button', { name: /Download PNG|Preparing/i });
    await expect(btn).toBeVisible();
  });

  test.use({ viewport: { width: 390, height: 844 } });
  test('mobile viewport navigation', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('link', { name: /Mood Detective/i })
    ).toBeVisible();
    await page.getByRole('link', { name: /Characters/i }).click();
    await expect(page.getByText(/Meet the Characters/)).toBeVisible();
  });
});
