import { useEffect, useState } from "react";

const API_BASE = "https://localhost:7130";

export interface User {
    id: string;
    email: string;
    userName: string;
    roles: string[];
    institutionId?: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE}/api/Auth/me`, {
                    credentials: "include",
                });

                if (!response.ok)
                {
                    throw new Error("unauthorized");
                }

                const data = (await response.json()) as User;
                setUser(data);

            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return { user, setUser, loading };
}
