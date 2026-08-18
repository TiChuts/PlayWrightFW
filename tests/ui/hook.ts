import { DataStorage } from "../../core/utils/data-storage";
import { testMain, requestMain, expectMain } from "../../fixtures/main-fixture";

export const test = testMain;
export const request = requestMain;
export const expect = expectMain;

test.beforeAll(async () => {
  console.log("Before tests");
  test.setTimeout(60000);
});

test.beforeEach("Open start URL", async ({ page, basePage, loginService }) => {
  console.log(`Running ${test.info().title}`);

  await basePage.goToBookPage();
  DataStorage.initData();
});

test.afterEach("After test - Clean Storage", async ({ page }) => {
  console.log(
    `Finished ${test.info().title} with status ${test.info().status}`,
  );

  DataStorage.clearData();
});

test.afterAll(async () => {
  console.log("After All tests");
});
