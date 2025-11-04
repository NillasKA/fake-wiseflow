export interface LoginRequest {
    email: string;
    password: string;
}

const API_BASE = "https://localhost:7130";

export async function login(loginRequest : LoginRequest) {
    const response = await fetch(`${API_BASE}/api/Auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginRequest),
        credentials: "include"
    });

    if (!response.ok) {
        let message = `Login failed (${response.status})`;
  
        const data = await response.json();
        message = (data?.message as string) || (data?.error as string) || message;
    
        throw new Error(message);
    }
}

export async function getMe() {
    const response = await fetch(`${API_BASE}/api/Auth/me`, {
        method: "GET",
        credentials: "include",
    });
    
    if (!response.ok) throw new Error(`Auth check failed (${response.status})`);
    
    return await response.json();
}
