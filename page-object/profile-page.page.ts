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

  async restoreProfileViaApi() {
    const { APIClient } = await import("../core/api/api-client");
    const { API_DEMO_QA_ENDPOINTS } = await import("../constant/endpoints");

    const client = await new APIClient(API_DEMO_QA_ENDPOINTS.BASE_URL).init();
    const loginResponse = await client.post(API_DEMO_QA_ENDPOINTS.LOGIN, {
      username: "admin",
      password: "password123",
    });

    if (!loginResponse.ok()) {
      const errorText = await loginResponse.text();
      throw new Error(`Profile cleanup login failed: ${errorText}`);
    }

    const loginData = await loginResponse.json();
    const token = `Bearer ${loginData.token}`;

    client.headers = {
      Authorization: token,
      "Content-Type": "application/json",
    };

    const patchResponse = await client.patch(API_DEMO_QA_ENDPOINTS.PROFILE, {
      name: "admin",
    });

    if (!patchResponse.ok()) {
      const errorText = await patchResponse.text();
      throw new Error(`Profile cleanup failed: ${errorText}`);
    }

    return patchResponse;
  }
}
