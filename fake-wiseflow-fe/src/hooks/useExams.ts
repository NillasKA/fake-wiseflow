import { useState } from "react";
import type { Exam } from "../models/Exam";

const API_URL = "https://localhost:7130/api/exams";

export function useExams() {
    const [exams, SetExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(false);

    async function getAll() {
        setLoading(true);
        const res = await fetch(API_URL, { credentials: "include" });
        const data = await res.json();
        SetExams(data);
        setLoading(false);
        return data;
    }

    async function getById(id: string) {
        const res = await fetch(`${API_URL}/${id}`, { credentials: "include" });
        if (!res.ok) return null;
        return await res.json();
    }

    async function create(exam: Exam) {
        await fetch(API_URL, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(exam)
        });
        return getAll();
    }

    async function update(id: string, exam: Exam) {
        await fetch(`${API_URL}?id=${id}`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(exam)
        });
        return getAll();
    }

    async function remove(id: string) {
        await fetch(`${API_URL}?id=${id}`, {
            method: "DELETE",
            credentials: "include"
        });
        return getAll();
    }

    return {
        exams,
        loading,
        getAll,
        getById,
        create,
        update,
        remove
    };
}