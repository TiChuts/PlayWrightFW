import { test, expect } from "./hook";
import accounts from "../../test-data/accounts.json";
import customerInfo from "../../test-data/information.json";

const account = accounts[0];

test("Add product to cart and continue to checkout", async ({
  page,
  loginPage,
  homePage,
  cartPage,
  checkoutPage,
}) => {
  const productName = "Đồng hồ thời trang";
  const expectedQuantity = 1;
  const expectedUnitPrice = "899.000";
  const expectedPaymentMethod = "Tiền mặt khi nhận hàng";
  const expectedTotalPrice = "899.000đ";

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

  await cartPage.proceedToCheckout();
  await expect(page).toHaveURL(/\/checkout/);

  await checkoutPage.verifyCheckoutPage(
    productName,
    expectedQuantity,
    expectedUnitPrice,
  );

  await checkoutPage.fillCustomerInformation(
    customerInfo.fullname,
    customerInfo.phoneNumber,
    customerInfo.deliveryAddress,
  );

  await expect(checkoutPage.fullNameInput).toHaveValue(customerInfo.fullname);
  await expect(checkoutPage.phoneNumberInput).toHaveValue(
    customerInfo.phoneNumber,
  );
  await expect(checkoutPage.addressInput).toHaveValue(
    customerInfo.deliveryAddress,
  );

  const placeOrderButton = checkoutPage.placeOrderButton;
  await expect(placeOrderButton).toContainText(expectedTotalPrice);

  await placeOrderButton.click();
  await expect(page).toHaveURL(/\/checkout/);

  await checkoutPage.verifyOrderPlacedSuccess(
    customerInfo.fullname,
    customerInfo.deliveryAddress,
    expectedPaymentMethod,
    expectedTotalPrice,
  );
});
