import { test, expect } from "./fixtures/orangehrm.fixture";
import { Admin } from "./Pages/Admin";
import { Pim } from "./Pages/Pim";

test.slow();
test.describe("OrangeHrm", () => {
  test("Admin", async ({ page, login }) => {
    await page.locator("//a[contains(normalize-space(),'Admin')]").click();
    await expect(page).toHaveURL(/admin/);

    const admin = new Admin(page);
    await admin.AllSysUser();
  });

  test("PIM", async ({ page, login }) => {
    const pim = new Pim(page);
    await pim.pimNavigate();
    await pim.addEmployee("Rahul", "Mathura", "Khan");
  });
});
