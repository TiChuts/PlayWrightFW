import { expect, Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class ProfilePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  readonly profileHeader = this.page.getByRole("heading", {
    name: /Hồ sơ cá nhân|Profile/i,
  });

  readonly usernameInput = this.page.getByRole("textbox").nth(0);

  readonly fullNameInput = this.page.getByRole("textbox").nth(1);

  readonly saveChangesButton = this.page.getByRole("button", {
    name: /Lưu thay đổi|Save Changes/i,
  });

  readonly homeButton = this.page.getByRole("button", {
    name: /Trang chủ|Home/i,
  });

  readonly successMessage = this.page.getByText(
    /Profile updated successfully|Cập nhật.*thành công|updated successfully|Update.*successful/i,
  );

  async openProfile() {
    await this.page.locator('a[href="/profile"]').click();
    await this.page.waitForURL(/\/profile/, { timeout: 20000 });
  }

  async updateFullName(fullName: string) {
    await this.fullNameInput.fill(fullName);
  }

  async saveChanges() {
    await this.saveChangesButton.click();
  }

  async goHome() {
    await this.homeButton.click();
    await this.page.waitForURL(/\/home/, { timeout: 20000 });
  }

  async verifyProfileUpdated(fullName: string) {
    await expect(this.profileHeader).toBeVisible();
    await expect(this.fullNameInput).toHaveValue(fullName);
    await expect(this.page.locator("body")).toContainText(fullName);
  }

  async verifyUpdatedNameOnHomePage(fullName: string) {
    await expect(this.page.locator('a[href="/profile"]')).toContainText(
      fullName,
    );
  }

  async restoreProfileViaApi(fullName: string) {
    const result = await this.page.evaluate(async (name) => {
      const response = await fetch(
        "https://testing.platformforge.dev/profile",
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fullName: name }),
        },
      );

      return {
        ok: response.ok,
        status: response.status,
        text: await response.text(),
      };
    }, fullName);

    expect(result.ok).toBeTruthy();
  }
}
