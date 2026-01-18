import { useState } from "react";
import type { Submission, SubmissionPartial } from "../models/Submission";

const API_URL = "https://localhost:7130/api/submissions";

export function useSubmissions() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(false);

    async function getByExamId(examId: string) {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/exam/${examId}`, { credentials: "include" });

            if (!res.ok) {
                throw new Error(`Failed to fetch submissions: ${res.status}`);
            }

            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const data = await res.json();
                setSubmissions(data);
                return data;
            } else {
                setSubmissions([]);
                return [];
            }
        } catch (error) {
            console.error("Error fetching submissions:", error);
            setSubmissions([]);
            throw error;
        } finally {
            setLoading(false);
        }
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
        try {
            const res = await fetch(`${API_URL}/bulk`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ examId, submissions })
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to create submissions: ${errorText}`);
            }

            // Check if response has JSON content before parsing
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return await res.json();
            }
            
            // If no JSON content, just return success
            return { success: true };
        } catch (error) {
            console.error("Error creating bulk submissions:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    return {
        submissions,
        loading,
        getByExamId,
        create,
        createBulk
    };
}