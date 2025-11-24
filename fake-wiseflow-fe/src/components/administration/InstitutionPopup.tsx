import {useState} from "react";

export default function InstitutionPopup() {
    const API_BASE = "https://localhost:7130/api/institutions"
    const [name, setName] = useState("");
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
                body: JSON.stringify({ name })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create user");
            }
            
            setShowSuccess(true);

        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create user");
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
                        ✓ Institution oprettet succesfuldt!
                    </p>
                    <p className="success-message">
                        Luk denne popup for at se din institution i listen!
                    </p>
                </div>
            </div>
            ) : (
            <div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {error && <div className="modal-error">{error}</div>}

                        <div className="form-group">
                            <label htmlFor="name">Navn</label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Navn"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                disabled={loading}
                            />
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
