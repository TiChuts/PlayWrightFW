import {
  BrowserContext,
  Config,
  expect,
  FrameLocator,
  Locator,
  Page,
  PageScreenshotOptions,
} from "@playwright/test";

import { BrowserManagement } from "../browser/browser-management";

export class PageUtils {
  static alertEvent;

  static page(): Page {
    return BrowserManagement.page;
  }

  static async goto(
    url: string,
    options?: {
      timeout?: number;
      waitUntil?: "networkidle" | "load" | "domcontentloaded" | "commit";
    },
  ) {
    await PageUtils.page().goto(url, options);
  }

  static async goBack(options?: {
    timeout?: number;
    waitUntil?: "networkidle" | "load" | "domcontentloaded" | "commit";
  }) {
    await PageUtils.page().goBack(options);
  }

  static async getTitle(): Promise<string> {
    console.log("Getting page's title");
    return await PageUtils.page().title();
  }

  static async waitForPageLoad(
    loadState?: "networkidle" | "load" | "domcontentloaded",
    options?: {
      timeout?: number;
    },
  ): Promise<PageUtils> {
    await PageUtils.page().waitForLoadState(loadState, options);
    return this;
  }

  static async waitForElement(
    locator: Locator,
    options?: {
      state?: "attached" | "detached" | "visible" | "hidden";
      timeout?: number;
    },
  ): Promise<void> {
    PageUtils.page().waitForSelector;
    await locator.waitFor(options);
  }

  static async waitForElementToBeVisible(locator: Locator): Promise<void> {
    return await this.waitForElement(locator, { state: "visible" });
  }

  static async waitForElementToBeHidden(locator: Locator) {
    return await this.waitForElement(locator, { state: "hidden" });
  }

  static async typeText(
    locator: Locator,
    text: string,
    options?: {
      delay?: number;
      noWaitAfter?: boolean;
      strict?: boolean;
      timeout?: number;
    },
  ): Promise<PageUtils> {
    await locator.type(text, options);
    return this;
  }

  static async fillText(locator: Locator, text: string): Promise<PageUtils> {
    await locator.fill(text);
    return this;
  }

  static async click(locator: Locator, index = 0): Promise<PageUtils> {
    await locator.nth(index).click();
    return this;
  }

  static async hover(
    locator: Locator,
    options?: {
      timeout?: number;
    },
  ): Promise<void> {
    await locator.hover(options);
  }

  static async getBrowserContext(): Promise<BrowserContext> {
    return await PageUtils.page().context();
  }

  static async setStorageState(storageStatePath: string) {
    await PageUtils.page().context().storageState({ path: storageStatePath });
  }

  static async getText(locator: Locator, index = 0): Promise<string> {
    const elementText = await locator.nth(index).innerText();

    return elementText;
  }

  static async getInputValue(locator: Locator, index = 0): Promise<string> {
    const elementText = await locator.nth(index).inputValue();

    return elementText;
  }

  static async getLocator(
    selector: string,
    index = 0,
    options?: {
      has?: Locator;
      hasText?: string | RegExp;
    },
  ): Promise<Locator> {
    return await PageUtils.page().locator(selector, options).nth(index);
  }

  static async getNumberOfElements(locator: Locator): Promise<number> {
    return await locator.count();
  }

  static async selectFromDropdown(dropdownLocator: Locator, value: string) {
    await dropdownLocator.selectOption(value);
  }

  static async captureScreenshot(
    options?: PageScreenshotOptions,
  ): Promise<Buffer> {
    return await PageUtils.page().screenshot(options);
  }

  static async checkScreenshot(
    screenshotBuffer: Buffer,
    fileName: string,
    options?: {
      threshold?: number;
      maxDiffPixels?: number;
      maxDiffPixelRatio?: number;
    },
  ) {
    await expect(screenshotBuffer).toMatchSnapshot(fileName, options);
  }

  static async captureAndVerifyScreenshot(
    fileName: string,
    captureScreenshotOptions?: PageScreenshotOptions,
  ) {
    const screenshotBuffer = await this.captureScreenshot(
      captureScreenshotOptions,
    );

    await this.checkScreenshot(screenshotBuffer, fileName);
  }
}
