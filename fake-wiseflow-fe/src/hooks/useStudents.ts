// In hooks/useStudents.ts
import { useState } from "react";
import type { User } from "../models/User.ts";

const API_URL = "https://localhost:7130/api/student";

export function useStudents() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    async function getAllByInstitutionId(id: string) {
        setLoading(true);

        const fetchUrl = `${API_URL}/institution/${id}`;
        const res = await fetch(fetchUrl, { credentials: "include" });

        if (!res.ok) {
            throw new Error("Failed to fetch students");
        }

        const data = await res.json();
        setUsers(data);
        setLoading(false);
        return data;
    }

    return {
        users,
        loading,
        getAllByInstitutionId
    };
}