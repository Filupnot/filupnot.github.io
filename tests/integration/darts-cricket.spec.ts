import { test, expect } from "@playwright/test";

test("navigate to darts cricket scoreboard and mark hits", async ({ page }) => {
  await page.goto("/games");

  await expect(
    page.getByRole("link", { name: /Darts \(Cricket\)/ })
  ).toBeVisible();

  await page.getByRole("link", { name: /Darts \(Cricket\)/ }).click();

  await expect(page.getByLabel("HOME marks for 20")).toBeVisible();

  const cell = page.getByLabel("HOME marks for 20");
  await expect(cell.locator(".mark-icon")).toHaveCount(0);

  await cell.click();
  await expect(cell.locator(".mark-icon")).toHaveCount(1);
});
