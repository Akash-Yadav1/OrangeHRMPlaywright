import { Page } from "@playwright/test";

export class LoginPage {
  constructor(private page: Page) {}

  async navigate(): Promise<void> {
    await this.page.goto(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
    );
  }

  async login(name: string, pass: string): Promise<void> {
    let username = this.page.getByPlaceholder("Username");
    let password = this.page.getByPlaceholder("Password");

    await username.fill(name);
    await password.fill(pass);

    await this.page.getByRole("button", { name: "Login" }).click();
  }
}
