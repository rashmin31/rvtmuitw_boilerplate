import type { HttpRequest, HttpResponse, Interceptor } from "@shared";

class HttpClient {
  private requestInterceptors: Interceptor<HttpRequest>[] = [];
  private responseInterceptors: Interceptor<HttpResponse>[] = [];

  addRequestInterceptor(interceptor: Interceptor<HttpRequest>) {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: Interceptor<HttpResponse>) {
    this.responseInterceptors.push(interceptor);
  }

  async request<T>(request: HttpRequest): Promise<T> {
    let current = { ...request };
    for (const interceptor of this.requestInterceptors) {
      current = await interceptor(current);
    }
    const response = await fetch(current.url, {
      method: current.method,
      headers: current.headers,
      body: current.body ? JSON.stringify(current.body) : undefined
    });
    const data = await response.json();
    let httpResponse: HttpResponse = { status: response.status, data };
    for (const interceptor of this.responseInterceptors) {
      httpResponse = await interceptor(httpResponse);
    }
    return httpResponse.data as T;
  }
}

export const httpClient = new HttpClient();
