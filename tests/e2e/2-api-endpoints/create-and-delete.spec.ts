import { APIResponse, expect, test } from "@playwright/test";
import { execSync } from "child_process";
import { resolve } from "path";
import { sleep } from "../globals";

const devAppPath = resolve("../webstone-dev-app");

test.describe("web/api/create & web/api/delete", () => {
  test("creates and deletes CRUD API endpoints for /api/users", async ({
    request,
  }) => {
    execSync("pnpm ws web api create /api/users", {
      cwd: devAppPath,
    });

    let response: APIResponse;
    response = await request.get("/api/users");
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toEqual(200);
    expect(await response.text()).toEqual("GET /api/users => Ok.");

    response = await request.post("/api/users");
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toEqual(200);
    expect(await response.text()).toEqual("POST /api/users => Ok.");

    response = await request.delete("/api/users/123");
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toEqual(200);
    expect(await response.text()).toEqual("DELETE /api/users/123 => Ok.");

    response = await request.patch("/api/users/123");
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toEqual(200);
    expect(await response.text()).toEqual("PATCH /api/users/123 => Ok.");

    response = await request.put("/api/users/123");
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toEqual(200);
    expect(await response.text()).toEqual("PUT /api/users/123 => Ok.");

    execSync("pnpm ws web api delete /api/users", {
      cwd: devAppPath,
    });

    await sleep(300);

    response = await request.get("/api/users");
    expect(response.status()).toEqual(404);

    response = await request.post("/api/users");
    expect(response.status()).toEqual(404);

    response = await request.delete("/api/users/123");
    expect(response.status()).toEqual(404);

    response = await request.patch("/api/users/123");
    expect(response.status()).toEqual(404);

    response = await request.put("/api/users/123");
    expect(response.status()).toEqual(404);
  });
});
