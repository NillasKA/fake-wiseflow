import { useState } from "react";

export type Institution = {
    id?: number;
    name: string;
};

const API_URL = "https://localhost:7130/api/institutions";

export function useInstitutions() {
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [loading, setLoading] = useState(false);

    async function getAll() {
        setLoading(true);
        const res = await fetch(API_URL, { credentials: "include" });
        const data = await res.json();
        setInstitutions(data);
        setLoading(false);
        return data;
    }

    async function getById(id: number) {
        const res = await fetch(`${API_URL}/${id}`, { credentials: "include" });
        if (!res.ok) return null;
        return await res.json();
    }

    async function create(institution: Institution) {
        await fetch(API_URL, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(institution)
        });
        return getAll();
    }

    async function update(id: number, institution: Institution) {
        await fetch(`${API_URL}?id=${id}`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(institution)
        });
        return getAll();
    }

    async function remove(id: number) {
        await fetch(`${API_URL}?id=${id}`, {
            method: "DELETE",
            credentials: "include"
        });
        return getAll();
    }

    return {
        institutions,
        loading,
        getAll,
        getById,
        create,
        update,
        remove
    };
}
