import { test, expect } from "@playwright/test";

test.describe("hike poll", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("vote for dates and see results", async ({ page }) => {
    let votes = [{ name: "Sam", dates: ["2026-10-10"], updated: "" }];
    await page.route("https://*.lambda-url.us-west-2.on.aws/**", async (route) => {
      const request = route.request();
      if (request.method() === "POST") {
        const body = JSON.parse(request.postData() ?? "{}");
        votes = [...votes.filter((vote) => vote.name !== body.name), { ...body, updated: "" }];
      }
      await route.fulfill({ json: { ok: true, votes } });
    });

    await page.goto("/hike");
    await expect(page.getByRole("heading", { name: "When should the hike be?" })).toBeVisible();

    const sat10 = page.getByRole("button", { name: /Sat 10\/10/ });
    await expect(sat10).toContainText("Sam");

    await page.getByPlaceholder("Your name").fill("Phil");
    await sat10.click();
    await page.getByRole("button", { name: /Sun 10\/18/ }).click();
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(page.getByRole("button", { name: "Saved ✓" })).toBeVisible();
    await expect(sat10).toContainText("Sam, Phil");
    await expect(page.locator(".voted")).toContainText("Sam, Phil");
  });
});
