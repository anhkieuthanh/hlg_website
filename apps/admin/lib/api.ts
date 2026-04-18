const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

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
  if (!response.ok) throw new Error("Login failed");
  return response.json();
}

export async function apiGet<T>(path: string, token: string): Promise<T> {
  const response = await fetch(`${API_URL}/api/admin${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store"
  });
  if (!response.ok) throw new Error(`GET ${path} failed`);
  return response.json();
}

export async function apiPatch<T>(path: string, token: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_URL}/api/admin${path}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!response.ok) throw new Error(`PATCH ${path} failed`);
  return response.json();
}

export async function downloadLeadsCsv(token: string) {
  const response = await fetch(`${API_URL}/api/admin/leads/export.csv`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) throw new Error("Export failed");
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "contact-leads.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}
