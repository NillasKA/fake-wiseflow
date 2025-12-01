import React, { useState } from "react";
import { useExams } from "../../../hooks/useExams";

interface ExamPopupProps {
    institutionId?: string | null;
}

export default function ExamPopup({ institutionId }: ExamPopupProps) {
    const { create } = useExams();
    const [title, setTitle] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [description, setDescription] = useState("");
    const [type, setType] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (!institutionId) {
            setError("Der skal vælges en institution");
            return;
        }

        if (!title || !date || !type) {
            setError("Udfyld venligst alle obligatoriske felter");
            return;
        }

        try {
            await create({
                title,
                date: new Date(date),
                description,
                type,
                institutionId: institutionId
            });

            // Reset form
            setTitle("");
            setDate(new Date().toISOString().split("T")[0]);
            setDescription("");
            setType("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Der opstod en fejl");
        }
    }

    return (
        <form onSubmit={handleSubmit} className="popup-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
                <label htmlFor="title">Titel *</label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="date">Dato *</label>
                <input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="description">Beskrivelse</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                />
            </div>

            <div className="form-group">
                <label htmlFor="type">Type *</label>
                <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                >
                    <option value="">Vælg type</option>
                    <option value="Skriftlig">Skriftlig</option>
                    <option value="Mundtlig">Mundtlig</option>
                    <option value="Projekt">Projekt</option>
                </select>
            </div>

            <div className="form-actions">
                <button type="submit" className="submit-btn">Gem</button>
            </div>
        </form>
    );
}