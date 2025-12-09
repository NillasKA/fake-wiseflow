import React, { useState } from "react";
import { useExams } from "../../../hooks/useExams";
import "../../../stylesheets/components/Modal.css";

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
    const [showSuccess, setShowSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

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

        setLoading(true);

        try {
            await create({
                title,
                date: new Date(date),
                description,
                type,
                institutionId: institutionId
            });

            setShowSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Der opstod en fejl");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {showSuccess ? (
                <div className="modal-body">
                    <div className="success-container">
                        <p className="success-title">
                            ✓ Eksamen oprettet succesfuldt!
                        </p>
                        <p className="success-message">
                            Luk denne popup for at se din eksamen i listen!
                        </p>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {error && <div className="modal-error">{error}</div>}

                        <div className="form-group">
                            <label htmlFor="title">Titel *</label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                disabled={loading}
                                placeholder="Indtast eksamenens titel"
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
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Beskrivelse</label>
                            <input
                                id="description"
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={loading}
                                placeholder="Valgfri beskrivelse"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="type">Type *</label>
                            <select
                                id="type"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                required
                                disabled={loading}
                            >
                                <option value="">Vælg type</option>
                                <option value="Skriftlig">Skriftlig</option>
                                <option value="Mundtlig">Mundtlig</option>
                                <option value="Projekt">Projekt</option>
                            </select>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button
                            type="submit"
                            className="btn-submit btn-full-width"
                            disabled={loading}
                        >
                            {loading ? "Opretter..." : "Opret"}
                        </button>
                    </div>
                </form>
            )}
        </>
    );
}