import { expect, test } from "@playwright/test";
import { execSync } from "child_process";
import { resolve } from "path";

const devAppPath = resolve("./_dev-app");

test.describe("web/page/create & web/page/delete", () => {
  test("creates and deletes an About Us page", async ({ page }) => {
    execSync("pnpm ws web route create 'About Us'", {
      cwd: devAppPath,
    });
    await page.goto("/about-us");
    await expect(page.locator("h1")).toContainText("About Us");
    await page.goto("/");
    execSync("pnpm ws web route delete 'About Us'", {
      cwd: devAppPath,
    });
    await page.goto("/about-us");
    await expect(page.locator("pre").nth(0)).toContainText(
      "Not found: /about-us"
    );
  });
});
