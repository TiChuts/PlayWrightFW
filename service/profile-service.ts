import { API_DEMO_QA_ENDPOINTS } from "../constant/endpoints";
import { APIClient } from "../core/api/api-client";
import { LoginService } from "./login-service";

export class ProfileService {
  _client: APIClient;
  _loginService: LoginService;

  constructor(apiClient: APIClient) {
    this._client = apiClient;
    this._loginService = new LoginService(apiClient);
  }

  async updateProfile(fullName: string, username?: string, password?: string) {
    const token = await this._loginService.login(
      username || "admin",
      password || "password123",
    );

    this._client.headers = {
      Authorization: token,
      "Content-Type": "application/json",
    };

    return await this._client.patch(API_DEMO_QA_ENDPOINTS.PROFILE, {
      name: fullName,
    });
  }
}
