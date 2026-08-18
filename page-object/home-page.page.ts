import { Page } from "playwright";
import { BasePage } from "./base.page";

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  readonly cartButton = this.page.locator(".cart-btn");
  readonly productCards = this.page.locator("div.product-card");

  private getProductCardByName(productName: string) {
    return this.page
      .locator("div.product-card")
      .filter({ hasText: productName })
      .first();
  }

  async clickOnHeaderUsername() {
    const headerUsername = this.page.locator('a[href="/profile"]');
    await this.clickOnElement(headerUsername);
  }

  async getProductCardsCount(): Promise<number> {
    return await this.countElements(this.productCards);
  }

  async getCartCount(): Promise<number> {
    const text = await this.cartButton.textContent();
    const match = text?.match(/\d+/);
    return match ? Number(match[0]) : 0;
  }

  async addProductToCart(productName: string) {
    const productCard = this.getProductCardByName(productName);
    const addToCartButton = productCard
      .locator("button")
      .filter({ hasText: /Thêm vào giỏ|Add to cart/i })
      .first();

    await addToCartButton.click();
  }
}
