import { test, expect, Page, BrowserContext } from "@playwright/test";

const credential = [["Admin", "admin123"]];

test.describe("OrangeHRM", async () => {
  let page: Page;
  let context: BrowserContext;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
    );
  });

  test("Admin login", async () => {
    let username = page.getByPlaceholder("Username");
    let password = page.getByPlaceholder("Password");

    for (let user of credential) {
      let name = user.at(0);
      let pass = user.at(1);
      await username.fill(typeof name === "string" ? name : "Admin");
      await password.fill(typeof pass === "string" ? pass : "admin12");
    }

    await page.getByRole("button", { name: "Login" }).click();
    await expect(page).toHaveTitle("OrangeHRM");
  });

  test("Admin", async () => {
    await page.locator("//li[1]").click();
  });

  test.afterAll(async ({ browser }) => {
    await page.close();
    await context.close();
    await browser.close();
  });
});
