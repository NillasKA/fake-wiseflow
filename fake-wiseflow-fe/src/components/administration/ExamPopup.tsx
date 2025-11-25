import {useState} from "react";

export default function ExamPopup() {
    const API_BASE = "https://localhost:7130/api/exams"
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(API_BASE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ title, date, description, type })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create exam");
            }
            
            setShowSuccess(true);

        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create exam");
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
            <div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {error && <div className="modal-error">{error}</div>}

                        <div className="form-group">
                            <label htmlFor="name">Titel</label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Titel"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="date">Dato</label>
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
                                placeholder="Beskrivelse"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                     <div className="form-group">
                      <label htmlFor="type">Type</label>
                       <select
                         id="type"
                         value={type}
                         onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                         setType(e.target.value)
                      }
                          required
                       disabled={loading}
        >
                    <option value="">-- Vælg eksamens type --</option>
                  <option value="Mundtlig">Mundtlig</option>
                 <option value="Skriftlig">Skriftlig</option>
    </select>
                         
</div>


                    </div>
                    <div className="modal-footer">
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={loading}>
                            {loading ? "Opretter..." : "Opret"}
                        </button>
                    </div>
                </form>
            </div>
            )}
        </>
    );
}