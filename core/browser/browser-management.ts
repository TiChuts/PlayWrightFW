
import { 
    BrowserContext, 
    Browser,
    Config, 
    expect, 
    FrameLocator, Locator, 
    Page, 
    PageScreenshotOptions
} from '@playwright/test';

export class BrowserManagement{
    static browser: Browser;
    static browserContext: BrowserContext;
    static page: Page;

    static initializeBrowser(browser: Browser, browserContext: BrowserContext, page: Page){
        BrowserManagement.browser = browser;
        BrowserManagement.browserContext = browserContext;
        BrowserManagement.page = page;
        return this;
    }

    static setCurrentContext(browserContext){
        BrowserManagement.browserContext = browserContext;
    }

    static setCurrentPage(page){
        BrowserManagement.browserContext = page;
    }
}