export interface LoginRequest {
    email: string;
    password: string;
}

const API_BASE = "https://localhost:7130";

export async function login(req: LoginRequest): Promise<void> {
    const res = await fetch(`${API_BASE}/api/Auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
        credentials: "include"
    });

    // Try to grab server error text if any
    if (!res.ok) {
        let message = `Login failed (${res.status})`;
        try {
            const data = await res.json();
            message =
                (data?.message as string) ||
                (data?.error as string) ||
                message;
        } catch {
            /* ignore parsing errors */
        }
        throw new Error(message);
    }
}

/**
 * Example of an authenticated GET using the cookie.
 * Point this to any endpoint that requires auth on your API.
 */
export async function getMe<T = unknown>(): Promise<T> {
    const res = await fetch(`${API_BASE}/api/Auth/me`, {
        method: "GET",
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Auth check failed (${res.status})`);
    return (await res.json()) as T;
}
