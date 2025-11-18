import { useState } from "react";
import "../../stylesheets/components/Modal.css";

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (userData: { name: string; email: string; role: string }) => Promise<{ temporaryPassword?: string }>;
}

export default function UserModal({ isOpen, onClose, onSubmit }: UserModalProps) {
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
            const result = await onSubmit({ name, email, role });
            
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
                            <div style={{ 
                                padding: "15px", 
                                background: "#e8f5e9", 
                                borderRadius: "4px",
                                marginBottom: "15px" 
                            }}>
                                <p style={{ margin: "0 0 10px 0", fontWeight: "600", color: "#2e7d32" }}>
                                    ✓ Bruger oprettet succesfuldt!
                                </p>
                                <p style={{ margin: "0", fontSize: "14px", color: "#555" }}>
                                    Del denne midlertidige adgangskode sikkert med brugeren:
                                </p>
                            </div>

                            <div style={{
                                display: "flex",
                                gap: "10px",
                                alignItems: "center",
                                padding: "12px",
                                background: "#f5f5f5",
                                borderRadius: "4px",
                                border: "2px solid #5a8fb0"
                            }}>
                                <code style={{ 
                                    flex: 1, 
                                    fontSize: "16px", 
                                    fontWeight: "600",
                                    letterSpacing: "1px"
                                }}>
                                    {generatedPassword}
                                </code>
                                <button
                                    onClick={copyToClipboard}
                                    style={{
                                        padding: "8px 12px",
                                        background: "#5a8fb0",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        fontSize: "14px"
                                    }}
                                >
                                    📋 Kopier
                                </button>
                            </div>

                            <p style={{ 
                                marginTop: "15px", 
                                fontSize: "12px", 
                                color: "#666",
                                fontStyle: "italic" 
                            }}>
                                ⚠️ Denne adgangskode vises kun én gang. 
                                Sørg for at gemme den før du lukker denne dialogboks.
                            </p>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn-submit"
                                onClick={handleClose}
                                style={{ width: "100%" }}
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
                                    <option value="Examinator">Lærer</option>
                                    <option value="InstitutionAdmin">Institution Admin</option>
                                </select>
                            </div>

                            <p style={{ 
                                fontSize: "12px", 
                                color: "#666", 
                                marginTop: "10px",
                                fontStyle: "italic" 
                            }}>
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