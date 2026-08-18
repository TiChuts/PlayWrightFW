import { test, expect } from "@playwright/test";
import { PageFixtureType, pageFixture } from "../../fixtures/page-fixture";
import { BrowserFixtureType, browserFixture } from "../fixture/browser-fixture";
import { APIFixtureType, apiFixture } from "../../fixtures/api-fixture";

export const testCase = test.extend<
  BrowserFixtureType & APIFixtureType & PageFixtureType
>({
  ...browserFixture,
  ...apiFixture,
  ...pageFixture,
});

export default testCase;
export { expect };
