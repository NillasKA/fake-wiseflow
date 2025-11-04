import { useEffect, useState } from "react";

const API_BASE = "https://localhost:7130";

export interface User {
    id: string;
    email: string;
    userName: string;
    roles: string[];
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${API_BASE}/api/Auth/me`, {
                    credentials: "include",
                });
                if (!res.ok) throw new Error("unauthorized");
                const data = (await res.json()) as User;
                setUser(data);
            } catch {
                setUser(null);
            }
        })();
    }, []);

    return { user , setUser};
}
