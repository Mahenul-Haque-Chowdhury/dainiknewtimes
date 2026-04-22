import { expect, test } from "@playwright/test";

test("homepage loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/দৈনিক নিউ টাইমস|New Times/i);
});

test("health endpoints are available", async ({ request }) => {
  const health = await request.get("/api/health");
  expect(health.ok()).toBeTruthy();

  const ready = await request.get("/api/ready");
  expect([200, 503]).toContain(ready.status());
});
