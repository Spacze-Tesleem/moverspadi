// Base HTTP client — wraps fetch with auth headers and error handling
//
// All API calls are routed through Next.js rewrites (/backend → backend/api)
// so requests are same-origin from the browser's perspective, eliminating
// any CORS issues regardless of which domain the app is served from.

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ? "/backend" : "";

interface RequestOptions extends RequestInit {
  token?: string;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, ...init } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init.headers ?? {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }

  return res.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string, opts?: RequestOptions) =>
    request<T>(path, { method: "GET", ...opts }),

  post: <T>(path: string, body: unknown, opts?: RequestOptions) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body), ...opts }),

  put: <T>(path: string, body: unknown, opts?: RequestOptions) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body), ...opts }),

  delete: <T>(path: string, opts?: RequestOptions) =>
    request<T>(path, { method: "DELETE", ...opts }),
};
