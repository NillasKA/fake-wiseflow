import { useState } from "react";
import "../../stylesheets/components/Modal.css";

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (userData: { name: string; email: string; role: string }) => Promise<void>;
}

export default function UserModal({ isOpen, onClose, onSubmit }: UserModalProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("Student");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await onSubmit({ name, email, role });
            setName("");
            setEmail("");
            setRole("Student");
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create user");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Opret Bruger</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

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
                                <option value="Teacher">Lærer</option>
                                <option value="InstitutionAdmin">Institution Admin</option>
                            </select>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={onClose}
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
            </div>
        </div>
    );
}