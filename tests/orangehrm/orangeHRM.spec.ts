import { test, expect, Page, BrowserContext, Locator } from "@playwright/test";
import * as XLSX from "xlsx";

const credential = [["Admin", "admin123"]];

//This group of tests on different features of the website OrangeHRM
test.describe("OrangeHRM", async () => {
  let page: Page;
  let context: BrowserContext;
  let sheetCol: string[] = ["Username", "User Role", "Employee Name", "Status"];
  let sheet = [];

  test.beforeAll(async ({ browser }) => {
    //This is the first step to open browser and login to the website

    context = await browser.newContext();
    page = await context.newPage();
    await page.goto(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
    );

    let username = page.getByPlaceholder("Username");
    let password = page.getByPlaceholder("Password");

    for (let user of credential) {
      let name = user.at(0);
      let pass = user.at(1);
      await username.fill(typeof name === "string" ? name : "Admin");
      await password.fill(typeof pass === "string" ? pass : "admin123");
    }

    await page.getByRole("button", { name: "Login" }).click();
    await expect(page).toHaveTitle("OrangeHRM");
  });

  test("Admin tab", async () => {
    //This test interacts with admin tab to find all the jobs listed on the portal
    await page.locator("//a[contains(normalize-space(),'Admin')]").click();

    await page
      .locator(
        "//nav[@role='navigation' and @aria-label='Topbar Menu']//li[normalize-space()='Job']",
      )
      .click();
  });

  test("All admins", async () => {
    await expect(
      page.locator("//span[contains(normalize-space(),'Records Found')]"),
    ).toBeVisible();

    let dataRows: Locator[] = await page
      .locator("//div[@class='oxd-table-card']")
      .all();

    for (let row of dataRows) {
      let dataCells: Locator[] = await row.locator("//div[@role='cell']").all();
      let rowObj: Record<string, string> = {};
      for (let i = 1; i < dataCells.length - 1; i++) {
        let cell = await dataCells[i].textContent();
        if (cell) {
          rowObj[sheetCol[i - 1]] = cell;
        }
      }
      sheet.push(rowObj);
    }

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(sheet);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "Orangehrm.xlsx");
  });

  test("All jobs", async () => {
    //This test verifies that among all the jobs listed the job starting with QA is available

    await page
      .locator("//a[@role='menuitem' and normalize-space()='Job Titles']")
      .click();

    await expect(
      page.locator("//span[contains(normalize-space(),'Records Found')]"),
    ).toBeVisible();

    let allJobs = await page
      .locator(
        "//div[@class='oxd-table-card'][normalize-space()='QA Engineer']",
      )
      .all();

    let job: Locator | undefined;
    for (let currJob of allJobs) {
      if ((await currJob.textContent()) === "QA Engineer") {
        job = currJob;
        break;
      }
    }
    expect(job).toBeDefined();

    await expect(job!).toContainText("QA");

    await page.pause();
  });

  test.afterAll(async ({ browser }) => {
    //It terminates the browser, and webpage after all the operations
    await page.close();
    await context.close();
    await browser.close();
  });
});
