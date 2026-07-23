import { Page, Locator, expect } from "@playwright/test";

export class Pim {
  constructor(protected page: Page) {}

  async pimNavigate() {
    await this.page.locator("//a[contains(normalize-space(),'PIM')]").click();
    await this.page
      .locator("//a[contains(normalize-space(),'Add Employee')]")
      .click();

    await expect(this.page).toHaveURL(/addEmployee/);
  }

  async addEmployee(fName: string, mName: string, lName: string) {
    let firstName = this.page.getByPlaceholder("First Name");
    let middlesName = this.page.getByPlaceholder("Middle Name");
    let lastName = this.page.getByPlaceholder("Last Name");

    await firstName.fill(fName);
    await middlesName.fill(mName);
    await lastName.fill(lName);

    //   await this.page.waitForTimeout(2000);

    await this.page.waitForTimeout(2000);
    await this.page
      .locator("//div[@class='orangehrm-background-container']")
      .screenshot({ path: "Employee.jpg" });
  }
}
