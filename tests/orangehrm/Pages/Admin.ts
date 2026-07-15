import { Page, Locator, expect } from "@playwright/test";
import * as XLSX from "xlsx";

export class Admin {
  constructor(protected page: Page) {}

  async AllSysUser() {
    let sheetCol: string[] = [
      "Username",
      "User Role",
      "Employee Name",
      "Status",
    ];
    let sheet = [];
    await expect(
      this.page.locator("//span[contains(normalize-space(),'Records Found')]"),
    ).toBeVisible();

    let dataRows: Locator[] = await this.page
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
  }
}
