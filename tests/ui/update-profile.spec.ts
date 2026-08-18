import test, { expect } from "@core/fixtures/all.fixture";
import accounts from "../resources/accounts.json";

const account = accounts[0];
const updatedFullName = "Real John Doe";

test("Update profile data and restore original data via API", async ({
  page,
  loginPage,
  homePage,
  profilePage,
}) => {
  await loginPage.openUrl("/login");
  await loginPage.doLogin(account.username, account.password);
  await expect(page).toHaveURL(/\/home/);

  await homePage.clickOnHeaderUsername();
  await expect(page).toHaveURL(/\/profile/);

  await expect(profilePage.profileHeader).toBeVisible();
  const originalFullName = await profilePage.fullNameInput.inputValue();

  await profilePage.updateFullName(updatedFullName);
  await profilePage.saveChanges();

  await expect(page.locator("body")).toContainText(
    /Cập nhật thành công|Profile updated successfully|updated successfully|Update.*successful/i,
  );

  await profilePage.goHome();
  await expect(page).toHaveURL(/\/home/);
  await profilePage.verifyUpdatedNameOnHomePage(updatedFullName);

  await profilePage.restoreProfileViaApi(originalFullName);
  await page.goto("/profile");
  await expect(profilePage.fullNameInput).toHaveValue(originalFullName);
});
