import { test, expect } from "./fixtures/orangehrm.fixture";
import { Admin } from "./Pages/Admin";
import { Pim } from "./Pages/Pim";

test.describe("OrangeHrm", () => {
  test("Admin", async ({ page, login }) => {
    await page.locator("//a[contains(normalize-space(),'Admin')]").click();
    await expect(page).toHaveURL(/admin/);

    const admin = new Admin(page);
    await admin.AllSysUser();
  });

  test.only("PIM", async ({ page, login }) => {
    const pim = new Pim(page);
    await page.locator("//a[contains(normalize-space(),'PIM')]").click();
    await page
      .locator("//li[contains(normalize-space(),'Add Employee')]")
      .click();
    await pim.addEmployee("Rahul", "Mathura", "Khan");
  });
});
