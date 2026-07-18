const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_BASE_URL ?? "http://localhost:8030";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  org_id: string;
  org_name: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

export class AuthApiError extends Error {}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${AUTH_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      typeof data.detail === "string"
        ? data.detail
        : `Request failed with status ${res.status}`;
    throw new AuthApiError(message);
  }
  return data as T;
}

export const authApi = {
  signup: (params: { email: string; password: string; name: string; org_name: string }) =>
    post<AuthSession>("/api/auth/signup", params),
  login: (params: { email: string; password: string }) =>
    post<AuthSession>("/api/auth/login", params),
};

const TOKEN_KEY = "myriox_token";
const USER_KEY = "myriox_user";
const TOKEN_COOKIE = "myriox_token";

export function saveSession(session: AuthSession) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, session.token);
  localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  // Non-httpOnly cookie so the Next.js middleware can gate /dashboard on presence alone —
  // the token itself is only ever sent to our own backend services as a Bearer header.
  document.cookie = `${TOKEN_COOKIE}=${session.token}; path=/; max-age=${60 * 60 * 24 * 14}; samesite=lax`;
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0`;
}

export function loadSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(TOKEN_KEY);
  const userRaw = localStorage.getItem(USER_KEY);
  if (!token || !userRaw) return null;
  try {
    return { token, user: JSON.parse(userRaw) as AuthUser };
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}
