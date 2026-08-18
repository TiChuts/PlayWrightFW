import { APIRequestContext, request } from "@playwright/test";

class APIClient {
  baseURL: string;
  context: APIRequestContext;
  headers: { [key: string]: string };

  constructor(baseURL) {
    this.baseURL = baseURL;
    this.headers = {};
  }

  async init() {
    this.context = await request.newContext({
      baseURL: this.baseURL,
    });
    return this;
  }

  setHeaders(headers) {
    this.headers = headers;
    return this;
  }

  setDefaultHeaders() {
    this.headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    return this;
  }

  getAPIContext() {
    return this.context;
  }

  addHeader(name, value) {
    this.headers[name] = value;
    return this;
  }

  clearHeader() {
    this.headers = {};
    return this;
  }

  addAuthorizationHeader(value) {
    this.headers["Authorization"] = value;
    return this;
  }

  async get(endPoint, params = {}, body = {}) {
    const res = await this.context.get(endPoint, {
      headers: this.headers,
      params: params,
      data: body,
    });

    return res;
  }

  async post(endPoint, body) {
    return await this.context.post(endPoint, {
      headers: this.headers,
      data: body,
    });
  }

  async put(endPoint, body) {
    return await this.context.put(endPoint, {
      headers: this.headers,
      data: body,
    });
  }

  async delete(endPoint, params = {}, body = {}) {
    return await this.context.delete(endPoint, {
      headers: this.headers,
      params: params,
      data: body,
    });
  }

  async dispose() {
    await this.context.dispose();
  }
}

export { APIClient };
