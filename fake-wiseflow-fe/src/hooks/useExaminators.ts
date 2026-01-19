import { useState } from "react";
import type { User } from "../models/User.ts";

const API_URL = "https://localhost:7130/api/Examinator";

export function useExaminators() {
    const [examinators, setExaminators] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    async function getAllByInstitutionId(id: string) {
        setLoading(true);
        try {
            const fetchUrl = `${API_URL}/institution/${id}`;
            const res = await fetch(fetchUrl, { credentials: "include" });

            if (!res.ok) {
                throw new Error("Failed to fetch examinators");
            }

            const data = await res.json();
            
            setExaminators(data);
            return data;
        } catch (error) {
            console.error(error);
            setExaminators([]);
        } finally {
            setLoading(false);
        }
    }

    return {
        examinators,
        loading,
        getAllByInstitutionId
    };
}
