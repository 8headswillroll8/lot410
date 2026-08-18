import { expect, test } from "@playwright/test";

test("displays LOT410 heading", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "LOT410" })).toBeVisible();
});
