import { expect, Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  readonly cartTitle = this.page.getByRole("heading", {
    name: /Giỏ hàng của bạn|Your Cart/i,
  });

  readonly proceedButton = this.page.getByRole("button", {
    name: /Proceed to Checkout|Thanh toán ngay/i,
  });

  async getCartItem(productName: string) {
    return this.page
      .locator("main")
      .locator("div")
      .filter({ has: this.page.getByRole("heading", { name: productName }) })
      .first();
  }

  async getCartItemDetails(productName: string) {
    const cartItem = await this.getCartItem(productName);
    const itemText = (await cartItem.innerText()).replace(/\s+/g, " ").trim();

    const quantityMatch = itemText.match(/(?:−|-|\u2212)\s*(\d+)\s*(?:\+|\b)/i);
    const priceMatch = itemText.match(/(\d{1,3}(?:\.\d{3})*)đ\s*\/\s*cái/i);
    const subtotalMatch = itemText.match(/(\d{1,3}(?:\.\d{3})*)đ\s*(?=✕|$)/);

    return {
      quantity: quantityMatch ? Number(quantityMatch[1]) : 0,
      unitPrice: priceMatch ? priceMatch[1] : "",
      subtotal: subtotalMatch ? subtotalMatch[1] : "",
      itemText,
    };
  }

  async verifyCartItem(
    productName: string,
    expectedQuantity: number,
    expectedUnitPrice: string,
  ) {
    await expect(this.cartTitle).toBeVisible();

    const { quantity, unitPrice, subtotal } =
      await this.getCartItemDetails(productName);

    expect(quantity).toBe(expectedQuantity);
    expect(unitPrice).toBe(expectedUnitPrice);

    const expectedSubtotal =
      Number(expectedUnitPrice.replace(/\./g, "")) * expectedQuantity;
    const expectedSubtotalText = expectedSubtotal.toLocaleString("vi-VN");
    expect(subtotal).toBe(expectedSubtotalText);

    const totalText = await this.page.locator("body").innerText();
    expect(totalText).toContain(expectedSubtotalText + "đ");
  }

  async proceedToCheckout() {
    await this.proceedButton.click();
  }
}
