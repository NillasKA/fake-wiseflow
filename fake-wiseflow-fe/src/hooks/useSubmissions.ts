import { useState } from "react";
import type { Submission, SubmissionPartial } from "../models/Submission.ts";

const API_URL = "https://localhost:7130/api/submissions";

export function useSubmissions() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(false);

    async function getByExamId(examId: string) {
        setLoading(true);
        const res = await fetch(`${API_URL}/exam/${examId}`, { credentials: "include" });

        if (!res.ok) {
            throw new Error("Failed to fetch submissions");
        }

        const data = await res.json();
        setSubmissions(data);
        setLoading(false);
        return data;
    }

    async function create(examId: string, file: File) {
        const formData = new FormData();
        formData.append("ExamId", examId);
        formData.append("File", file);

        const res = await fetch(`${API_URL}/upload`, {
            method: "POST",
            credentials: "include",
            body: formData
        });

        if (!res.ok) {
            throw new Error("Failed to upload submission");
        }

        return res.ok;
    }

    async function createBulk(examId: string, submissions: SubmissionPartial[]) {
        setLoading(true);
        const res = await fetch(`${API_URL}/bulk`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ examId, submissions })
        });

        if (!res.ok) {
            throw new Error("Failed to create submissions");
        }

        setLoading(false);
        return await res.json();
    }

    return {
        submissions,
        loading,
        getByExamId,
        create,
        createBulk
    };
}