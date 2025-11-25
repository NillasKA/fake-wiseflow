import { useState } from "react";
import "../../stylesheets/components/Modal.css";
import "../../stylesheets/components/UserModal.css";

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    institutionId?: string | null;
}

export default function UserModal({ isOpen, onClose, institutionId }: UserModalProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("Student");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [generatedPassword, setGeneratedPassword] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);
        setGeneratedPassword("");

        try {
            // Call the appropriate API endpoint based on role
            const API_BASE = "https://localhost:7130/api";
            let endpoint = "";
            
            if (role === "Student") {
                endpoint = `${API_BASE}/Student/create`;
            } else if (role === "Examinator") {
                endpoint = `${API_BASE}/Examinator/create`;
            } else {
                throw new Error("Unsupported role selected");
            }

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, institutionId})
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create user");
            }

            const result = await response.json();
            
            if (result?.temporaryPassword) {
                setGeneratedPassword(result.temporaryPassword);
                setShowSuccess(true);
                setName("");
                setEmail("");
                setRole("Student");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create user");
        } finally {
            setLoading(false);
        }
    }

    function handleClose() {
        setShowSuccess(false);
        setGeneratedPassword("");
        setError("");
        setName("");
        setEmail("");
        setRole("Student");
        onClose();
    }

    function copyToClipboard() {
        navigator.clipboard.writeText(generatedPassword);
        alert("Adgangskode kopieret til udklipsholder!");
    }

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        {showSuccess ? "Bruger Oprettet" : "Opret Bruger"}
                    </h2>
                    <button className="modal-close" onClick={handleClose}>×</button>
                </div>

                {showSuccess ? (
                    <>
                        <div className="modal-body">
                            <div className="success-container">
                                <p className="success-title">
                                    ✓ Bruger oprettet succesfuldt!
                                </p>
                                <p className="success-message">
                                    Del denne midlertidige adgangskode sikkert med brugeren:
                                </p>
                            </div>

                            <div className="password-container">
                                <code className="password-code">
                                    {generatedPassword}
                                </code>
                                <button onClick={copyToClipboard} className="copy-button">
                                    📋 Kopier
                                </button>
                            </div>

                            <p className="password-warning">
                                ⚠️ Denne adgangskode vises kun én gang. 
                                Sørg for at gemme den før du lukker denne dialogboks.
                            </p>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn-submit btn-full-width"
                                onClick={handleClose}
                            >
                                Færdig
                            </button>
                        </div>
                    </>
                ) : (
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

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="role">Rolle</label>
                                <select
                                    id="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    disabled={loading}
                                >
                                    <option value="Student">Student</option>
                                    <option value="Examinator">Eksaminator</option>
                                </select>
                            </div>

                            <p className="password-hint">
                                💡 En sikker adgangskode vil blive genereret automatisk
                            </p>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn-cancel"
                                onClick={handleClose}
                                disabled={loading}
                            >
                                Annuller
                            </button>
                            <button
                                type="submit"
                                className="btn-submit"
                                disabled={loading}
                            >
                                {loading ? "Opretter..." : "Opret"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}