import { test, expect, type Locator } from "@playwright/test";

const getAppBg = (locator: Locator) =>
  locator.evaluate((el: HTMLElement) =>
    getComputedStyle(el).getPropertyValue("--app-bg").trim()
  );

test("dark mode toggle persists across navigation", async ({ page }) => {
  await page.goto("/");

  const toggle = page.getByTestId("theme-toggle");
  await toggle.click();

  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.getByRole("link", { name: /Game Score Tools/i }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("main.page")).toHaveAttribute("data-page", "games");

  await page.getByRole("link", { name: /Darts \(Cricket\)/i }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("main.page")).toHaveAttribute("data-page", "darts-cricket");
});

test("hovering game cards does not change theme", async ({ page }) => {
  await page.goto("/games");

  const toggle = page.getByTestId("theme-toggle");
  await toggle.click();

  const main = page.locator("main.page");
  const bgBefore = await getAppBg(main);

  const card = page.getByRole("link", { name: /Darts \(Cricket\)/i });
  await card.hover();
  await page.waitForTimeout(250);

  const bgAfter = await getAppBg(main);
  expect(bgAfter).toBe(bgBefore);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("dark mode toggle works on pool league page", async ({ page }) => {
  await page.goto("/games/8-ball-pool");

  const toggle = page.getByTestId("theme-toggle");
  await toggle.click();

  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("main.page")).toHaveAttribute("data-page", "pool-league");
});
