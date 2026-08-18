import { test } from "@playwright/test";
import { LoginPage } from "../page-object/login-page.page";
import { BasePage } from "../page-object/base.page";
import { ProfilePage } from "../page-object/profile-page.page";
import { HomePage } from "../page-object/home-page.page";
import { CartPage } from "../page-object/cart-page.page";
import { CheckoutPage } from "../page-object/checkout-page.page";

export type PageFixtureType = {
  loginPage: LoginPage;
  basePage: BasePage;
  profilePage: ProfilePage;
  homePage: HomePage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

type ExtendParams = Parameters<typeof test.extend<PageFixtureType>>;

export const pageFixture: ExtendParams[0] = {
  basePage: async ({ page }, use) => {
    await use(new BasePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  profilePage: async ({ page }, use) => {
    await use(new ProfilePage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
};
