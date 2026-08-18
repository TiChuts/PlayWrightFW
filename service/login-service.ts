import { API_DEMO_QA_ENDPOINTS } from "../constant/endpoints";
import { APIClient } from "../core/api/api-client";

export class LoginService {
  _client: APIClient;

  constructor(apiClient: APIClient) {
    this._client = apiClient;
  }

  async login(username: string, password: string): Promise<string> {
    const response = await this._client.post(
      API_DEMO_QA_ENDPOINTS.GENERATE_TOKEN,
      {
        username,
        password,
      },
    );

    if (response.ok()) {
      const body = await response.json();
      return `Bearer ${body.token}`;
    }

    const errorBody = await response.text();
    throw new Error(`Generate token failed: ${errorBody}`);
  }

  async generateToken(userName?: string, password?: string) {
    const user = userName || "admin";
    const pass = password || "password123";

    return await this._client.post(API_DEMO_QA_ENDPOINTS.GENERATE_TOKEN, {
      username: user,
      password: pass,
    });
  }

  async getAccessToken(userName?: string, password?: string): Promise<string> {
    const response = await this.generateToken(userName, password);

    if (response.ok()) {
      const body = await response.json();
      return `Bearer ${body.token}`;
    }

    const errorBody = await response.text();
    throw new Error(`Generate token failed: ${errorBody}`);
  }
}
