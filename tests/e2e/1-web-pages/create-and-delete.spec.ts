import { expect, test } from "@playwright/test";
import { execSync } from "child_process";
import { resolve } from "path";
import { sleep } from "../globals";

const devAppPath = resolve("./_dev-app");

test.describe("web/page/create & web/page/delete", () => {
  test("creates and deletes an About Us page", async ({ page }) => {
    execSync("pnpm ws web route create 'About Us' --types '+page.svelte'", {
      cwd: devAppPath,
    });
    await page.goto("/about-us");
    await expect(page.locator("h1")).toContainText("About Us");
    await page.goto("/");
    execSync("pnpm ws web route delete 'About Us'", {
      cwd: devAppPath,
    });

    // The previous `execSync` call to delete /about-us results in a dev server restart.
    // Let's wait a tiny bit for the restart to complete.
    await sleep(300);

    await page.goto("/about-us");
    await expect(page.locator("h1")).toContainText("404");
  });
});
