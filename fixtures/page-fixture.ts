import { test } from "@playwright/test";
import { LoginPage } from "../page-object/login-page";
import { BasePage } from "../page-object/base-page";
import { BookPage } from "../page-object/book-page";
import { ProfilePage } from "../page-object/profile-page";

export type PageFixtureType = {
  loginPage: LoginPage;
  basePage: BasePage;
  bookPage: BookPage;
  profilePage: ProfilePage;
};

type ExtendParams = Parameters<typeof test.extend<PageFixtureType>>;

export const pageFixture: ExtendParams[0] = {
  basePage: async ({}, use) => {
    await use(new BasePage());
  },
  loginPage: async ({}, use) => {
    await use(new LoginPage());
  },
  bookPage: async ({}, use) => {
    await use(new BookPage());
  },
  profilePage: async ({}, use) => {
    await use(new ProfilePage());
  },
};
