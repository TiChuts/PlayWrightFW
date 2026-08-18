import test, { expect } from "@core/fixtures/all.fixture";
import accounts from "../resources/accounts.json";

const account = accounts[0];

test("Add product to cart and verify quantity and price on cart page", async ({
  page,
  loginPage,
  homePage,
  cartPage,
}) => {
  const productName = "Đồng hồ thời trang";
  const expectedQuantity = 1;
  const expectedUnitPrice = "899.000";

  await loginPage.openUrl("/login");
  await loginPage.doLogin(account.username, account.password);

  await expect(page).toHaveURL(/\/home/);

  await homePage.addProductToCart(productName);
  await expect(homePage.cartButton).toContainText("1");

  await homePage.cartButton.click();
  await expect(page).toHaveURL(/\/cart/);

  await cartPage.verifyCartItem(
    productName,
    expectedQuantity,
    expectedUnitPrice,
  );
});
