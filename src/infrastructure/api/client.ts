// Base HTTP client — wraps fetch with auth headers and error handling

// NEXT_PUBLIC_API_URL should be the bare origin, e.g. https://moverspadi.onrender.com
// All routes are served under /api on the backend, so we append that prefix here
// rather than repeating it in every API module.
const ORIGIN = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
const BASE_URL = ORIGIN ? `${ORIGIN}/api` : "";

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
