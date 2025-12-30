import { useState } from "react";
import type {Exam, ExamPartial} from "../models/Exam";

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

        return res.json();
    }

    async function create(examData: ExamPartial) {
        const response = await fetch(API_URL, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(examData)
        });

        if (!response.ok) {
            throw new Error("Failed to create exam");
        }

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

    async function getAllForInstitution (institutionId: string) {
        setLoading(true);
        SetExams([])
        try {
            const response = await fetch(`${API_URL}/institution/${institutionId}`, {
                credentials: "include"
            });
            if (!response.ok) {
                throw new Error("Failed to fetch exams for institution");
            }
            const data = await response.json();
            SetExams(data);
            return exams;
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return {
        exams,
        loading,
        getAll,
        getById,
        create,
        update,
        remove,
        getAllForInstitution
    };
}