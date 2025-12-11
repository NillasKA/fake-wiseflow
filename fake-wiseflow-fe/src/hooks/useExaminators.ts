import { useState } from "react";

const API_URL = "https://localhost:7130/api/Examinator";

export interface Examinator {
    id: string;
    email: string;
    userName: string;
    role: string;
    institutionId: string | null;
}

export function useExaminators() {
    const [examinators, setExaminators] = useState<Examinator[]>([]);
    const [loading, setLoading] = useState(false);

    async function getByInstitutionId(institutionId: string) {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/institution/${institutionId}`, {
                credentials: "include"
            });
            
            if (!response.ok) {
                throw new Error("Failed to fetch examinators");
            }
            
            const data = await response.json();
            setExaminators(data);
            return data;
        } catch (error) {
            console.error("Error fetching examinators:", error);
            setExaminators([]);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    async function getAll() {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/all`, {
                credentials: "include"
            });
            
            if (!response.ok) {
                throw new Error("Failed to fetch examinators");
            }
            
            const data = await response.json();
            setExaminators(data);
            return data;
        } catch (error) {
            console.error("Error fetching examinators:", error);
            setExaminators([]);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    return {
        examinators,
        loading,
        getByInstitutionId,
        getAll
    };
}