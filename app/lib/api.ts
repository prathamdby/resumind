const API_BASE_URL = process.env.API_URL || "http://localhost:8000";

const resolveHeaders = (init?: RequestInit): Headers => {
  return new Headers(init?.headers ?? {});
};

const appendDefaultCookies = (headers: Headers) => {
  if (!headers.has("Cookie")) {
    const cookies =
      typeof document !== "undefined" ? document.cookie : undefined;
    if (cookies) {
      headers.set("Cookie", cookies);
    }
  }
};

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = resolveHeaders(options);

  if (
    !headers.has("Content-Type") &&
    options.body !== undefined &&
    !(options.body instanceof FormData)
  ) {
    headers.set("Content-Type", "application/json");
  }

  appendDefaultCookies(headers);

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || `API request failed: ${response.status}`);
  }

  return response;
}

export async function apiGet<T>(
  endpoint: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await apiRequest(endpoint, { method: "GET", ...init });
  return response.json();
}

export async function apiPost<T>(
  endpoint: string,
  data?: unknown,
  init: RequestInit = {},
): Promise<T> {
  const response = await apiRequest(endpoint, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
    ...init,
  });
  return response.json();
}

export async function apiDelete<T>(
  endpoint: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await apiRequest(endpoint, { method: "DELETE", ...init });
  return response.json();
}

export async function apiPostFormData<T>(
  endpoint: string,
  formData: FormData,
  init: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = resolveHeaders(init);
  appendDefaultCookies(headers);

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: formData,
    credentials: "include",
    ...init,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || `API request failed: ${response.status}`);
  }

  return response.json();
}
