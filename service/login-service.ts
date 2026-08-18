import { API_DEMO_QA_ENDPOINTS } from "../constant/endpoints";
import { APIClient } from "../core/api/api-client";
import { LOGIN_DATA } from "../test-data/login-data";

export class LoginService {
  _client: APIClient;

  constructor(apiClient: APIClient) {
    this._client = apiClient;
  }

  //Bearer Token
  async generateToken() {
    const account = LOGIN_DATA["test_account_01"];
    return await this._client.post(API_DEMO_QA_ENDPOINTS.GENERATE_TOKEN, {
      userName: account.userName,
      password: account.password,
    });
  }

  async getAccessToken(): Promise<string> {
    const response = await this.generateToken();

    if (response.ok()) {
      const body = await response.json();
      return `Bearer ${body.token}`;
    }

    throw new Error("Generate token failed");
  }
}
