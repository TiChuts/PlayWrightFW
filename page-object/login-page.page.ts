import { Page } from "playwright";
import { BasePage } from "./base.page";

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private readonly usernameInput = this.page.locator("#username");
  private readonly passwordInput = this.page.locator("#password");
  private readonly loginButton = this.page.getByTestId("login-submit");

  async fillUsername(username: string) {
    await this.enterTxt(this.usernameInput, username);
  }

  async fillPassword(password: string) {
    await this.enterTxt(this.passwordInput, password);
  }

  async clickLoginButton() {
    await this.clickOnElement(this.loginButton);
  }

  async doLogin(username: string, password: string) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLoginButton();
  }

  async logout() {
    await this.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
      document.cookie.split(";").forEach((cookie) => {
        const name = cookie.split("=")[0]?.trim();
        if (name) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        }
      });
    });
    await this.openUrl("/login");
  }
}
