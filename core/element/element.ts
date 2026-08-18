import { BrowserManagement } from "../browser/browser-management";
import { PageUtils } from "../utils/page-utils";
import { BrowserContext, Locator } from "@playwright/test";

export enum LocatorType {
  ROLE,
  TEXT,
  LABEL,
  PLACEHOLDER,
  ALT_TEXT,
  TITLE,
  TEST_ID,
}

export class Element {
  locator: Locator;
  locatorType: LocatorType | undefined;
  selector;
  timeout: number;
  options;

  constructor(
    selector,
    locatorType?: LocatorType,
    options?,
    timeout: number = 60000,
  ) {
    this.selector = selector;
    this.timeout = timeout;
    this.locatorType = locatorType;
    this.options = options;
  }

  setTimeout(timeout: number): Element {
    this.timeout = timeout;
    return this;
  }

  getCurrentLocatorByType(): Locator {
    switch (this.locatorType) {
      case LocatorType.ROLE:
        return BrowserManagement.page.getByRole(this.selector, this.options);
      case LocatorType.TEXT:
        return BrowserManagement.page.getByText(this.selector, this.options);
      case LocatorType.LABEL:
        return BrowserManagement.page.getByLabel(this.selector, this.options);
      case LocatorType.PLACEHOLDER:
        return BrowserManagement.page.getByPlaceholder(
          this.selector,
          this.options,
        );
      case LocatorType.ALT_TEXT:
        return BrowserManagement.page.getByAltText(this.selector, this.options);
      case LocatorType.TITLE:
        return BrowserManagement.page.getByTitle(this.selector, this.options);
      case LocatorType.TEST_ID:
        return BrowserManagement.page.getByTestId(this.selector);
      default:
        return BrowserManagement.page.locator(this.selector);
    }
  }

  getCurrentLocator(): Locator {
    BrowserManagement.page.setDefaultTimeout(this.timeout);
    return this.getCurrentLocatorByType();
  }

  async getListCurrentLocators(): Promise<Array<Locator>> {
    return await this.getCurrentLocator().all();
  }

  getChildLocator(childSelector: string, index = 0, options): Locator {
    BrowserManagement.page.setDefaultTimeout(this.timeout);
    return this.locator.locator(childSelector, options).nth(index);
  }

  async getElementCount(): Promise<number> {
    return await this.getCurrentLocator().count();
  }

  async getVisibleElementCount(): Promise<number> {
    const handles = await this.getCurrentLocator().elementHandles();
    const visibilityChecks = await Promise.all(
      handles.map((el) => el.isVisible()),
    );
    return visibilityChecks.filter(Boolean).length;
  }

  async click(index = 0): Promise<Element> {
    await PageUtils.click(this.getCurrentLocator(), index);
    return this;
  }

  async type(text): Promise<Element> {
    await PageUtils.fillText(this.getCurrentLocator(), text);
    return this;
  }

  async hover(options?: { timeout?: number }): Promise<Element> {
    await PageUtils.hover(this.getCurrentLocator(), options);
    return this;
  }

  getBrowserContext(): BrowserContext {
    return BrowserManagement.browserContext;
  }

  async getText(): Promise<string> {
    return await this.getCurrentLocator().innerText();
  }

  async setStorageState(storageStatePath: string) {
    await PageUtils.setStorageState(storageStatePath);
    return this;
  }

  async isDisplay(timeout = 5000): Promise<boolean> {
    try {
      BrowserManagement.page.setDefaultTimeout(timeout);
      await PageUtils.waitForElement(this.getCurrentLocatorByType().first(), {
        state: "visible",
      });
      console.log("Element found!");
      return true;
    } catch (error) {
      console.error("Element not found within " + timeout + " milisecond.");
      this.setTimeout(this.timeout);
    }

    return false;
  }

  async waitForAllElement(): Promise<Element> {
    await PageUtils.page().waitForSelector(this.selector);
    return this;
  }

  async waitForElement(options?: {
    state?: "attached" | "detached" | "visible" | "hidden";
    timeout?: number;
  }): Promise<Element> {
    await PageUtils.waitForElement(this.getCurrentLocator().first(), options);
    return this;
  }

  async waitForElementToBeVisible(): Promise<Element> {
    await this.waitForElement({ state: "visible" });
    return this;
  }

  async scrollIntoView(): Promise<Element> {
    await this.getCurrentLocator().scrollIntoViewIfNeeded();
    return this;
  }
}
