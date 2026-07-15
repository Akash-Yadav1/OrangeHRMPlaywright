import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../Pages/Login";

type myType = {
  login: LoginPage;
};

export const test = base.extend<myType>({
  login: async ({ page }, use) => {
    let log = new LoginPage(page);
    await log.navigate();
    await log.login("Admin", "admin123");

    await expect(page).toHaveTitle(/OrangeHRM/);
    await use(log);
  },
});

export { expect };
