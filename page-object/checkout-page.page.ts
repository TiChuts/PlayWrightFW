import { expect, Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  readonly checkoutTitle = this.page.getByRole("heading", {
    name: /Thanh toán|Checkout/i,
  });

  readonly backToCartButton = this.page.getByRole("button", {
    name: /Quay lại giỏ hàng|Back to cart/i,
  });

  readonly placeOrderButton = this.page.getByRole("button", {
    name: /Đặt hàng|Place order/i,
  });

  readonly orderSummary = this.page.getByRole("heading", {
    name: /Đơn hàng của bạn|Your order/i,
  });

  readonly successTitle = this.page.getByRole("heading", {
    name: /Đặt hàng thành công|Order placed successfully/i,
  });

  readonly fullNameInput = this.page
    .locator("label")
    .filter({ hasText: /Họ và tên|Full name/i })
    .locator("xpath=following-sibling::input[1]");

  readonly phoneNumberInput = this.page
    .locator("label")
    .filter({ hasText: /Số điện thoại|Phone number/i })
    .locator("xpath=following-sibling::input[1]");

  readonly addressInput = this.page
    .locator("label")
    .filter({ hasText: /Địa chỉ nhận hàng|Delivery address/i })
    .locator("xpath=following-sibling::input[1]");

  async fillCustomerInformation(
    fullname: string,
    phoneNumber: string,
    deliveryAddress: string,
  ) {
    await this.fullNameInput.fill(fullname);
    await this.phoneNumberInput.fill(phoneNumber);
    await this.addressInput.fill(deliveryAddress);
  }

  async verifyCheckoutPage(
    productName: string,
    expectedQuantity: number,
    expectedUnitPrice: string,
  ) {
    await expect(this.checkoutTitle).toBeVisible();
    await expect(this.placeOrderButton).toBeVisible();
    await expect(this.orderSummary).toBeVisible();
    await expect(this.page.locator("body")).toContainText(productName);

    const orderText = await this.page.locator("body").innerText();
    expect(orderText).toContain(productName);
    expect(orderText).toContain(`${expectedQuantity}`);
    expect(orderText).toContain(`${expectedUnitPrice}đ`);

    const expectedSubtotal =
      Number(expectedUnitPrice.replace(/\./g, "")) * expectedQuantity;
    const expectedSubtotalText = expectedSubtotal.toLocaleString("vi-VN");
    expect(orderText).toContain(`${expectedSubtotalText}đ`);

    const buttonText = await this.placeOrderButton.textContent();
    expect(buttonText ?? "").toContain(`${expectedSubtotalText}đ`);
  }

  async verifyOrderPlacedSuccess(
    fullname: string,
    deliveryAddress: string,
    expectedPaymentMethod: string,
    expectedTotal: string,
  ) {
    await expect(this.successTitle).toBeVisible();
    await expect(this.page.locator("body")).toContainText(fullname);
    await expect(this.page.locator("body")).toContainText(deliveryAddress);
    await expect(this.page.locator("body")).toContainText(
      new RegExp(expectedPaymentMethod, "i"),
    );
    await expect(this.page.locator("body")).toContainText(expectedTotal);
  }
}
