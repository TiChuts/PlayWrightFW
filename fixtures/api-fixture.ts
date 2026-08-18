import { test } from "@playwright/test";
import { APIClient } from "../core/api/api-client";
import { BookService } from "../service/book-service";
import { API_DEMO_QA_ENDPOINTS } from "../constant/endpoints";
import { LoginService } from "../service/login-service";

export type APIFixtureType = {
  bookService: BookService;
  loginService: LoginService;
};

type ExtendParams = Parameters<typeof test.extend<APIFixtureType>>;

export const apiFixture: ExtendParams[0] = {
  loginService: [
    async ({}, use) => {
      await use(
        new LoginService(
          await new APIClient(API_DEMO_QA_ENDPOINTS.BASE_URL).init(),
        ),
      );
    },
    { scope: "test" },
  ],
  bookService: [
    async ({}, use) => {
      await use(
        new BookService(
          await new APIClient(API_DEMO_QA_ENDPOINTS.BASE_URL).init(),
        ),
      );
    },
    { scope: "test" },
  ],
};
