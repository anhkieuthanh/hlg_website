const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
  }
}

export type Session = {
  accessToken: string;
  user: {
    sub: string;
    email: string;
    role: string;
    name: string;
  };
};

export async function login(input: { email: string; password: string; totpCode?: string }): Promise<Session> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });
  if (!response.ok) throw new ApiError("Login failed", response.status);
  return response.json();
}

export async function apiGet<T>(path: string, token: string): Promise<T> {
  const response = await fetch(`${API_URL}/api/admin${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store"
  });
  if (!response.ok) throw new ApiError(`GET ${path} failed`, response.status);
  return response.json();
}

export async function apiPatch<T>(path: string, token: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_URL}/api/admin${path}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!response.ok) throw new ApiError(`PATCH ${path} failed`, response.status);
  return response.json();
}

export async function apiPost<T>(path: string, token: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_URL}/api/admin${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!response.ok) throw new ApiError(`POST ${path} failed`, response.status);
  return response.json();
}

export async function apiDelete<T>(path: string, token: string): Promise<T> {
  const response = await fetch(`${API_URL}/api/admin${path}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) throw new ApiError(`DELETE ${path} failed`, response.status);
  return response.json();
}

export async function getSetting<T>(key: string, token: string): Promise<T> {
  const setting = await apiGet<{ value: T }>(`/settings/${key}`, token);
  return setting.value;
}

export async function saveSetting<T>(key: string, token: string, value: T): Promise<T> {
  const setting = await apiPatch<{ value: T }>(`/settings/${key}`, token, { value });
  return setting.value;
}

export async function downloadLeadsCsv(token: string) {
  const response = await fetch(`${API_URL}/api/admin/leads/export.csv`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) throw new ApiError("Export failed", response.status);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "contact-leads.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}
