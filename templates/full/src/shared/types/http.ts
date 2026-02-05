export type HttpRequest = {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
};

export type HttpResponse<T = unknown> = {
  status: number;
  data: T;
};

export type Interceptor<T> = (value: T) => Promise<T> | T;
