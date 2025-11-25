import "../stylesheets/pages/LoginPage.css"
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login as apiLogin, getMe } from "../api/auth";

export default function LoginPage() {
    const { user, login: contextLogin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setLoading(true);

        try {
            await apiLogin({ email, password });

            const me = await getMe();

            contextLogin(me);

            const from = location.state?.from?.pathname || "/";
            navigate(from, { replace: true });

        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : "Ukendt fejl.");
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="fw-root">
            <main className="fw-main">
                <h1 className="fw-welcome">Velkommen til Fake Wiseflow</h1>

                <form className="fw-card" onSubmit={handleSubmit} aria-label="Login">
                    <div className="fw-logo">FW</div>

                    <div className="fw-field">
                        <label htmlFor="username">E-Mail</label>
                        <div className="fw-input-wrap">
                            <span className="fw-icon" aria-hidden="true">👤</span>
                            <input
                                id="email"
                                type="text"
                                placeholder="Indtast din email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="fw-field">
                        <label htmlFor="password">Kodeord</label>
                        <div className="fw-input-wrap">
                            <span className="fw-icon" aria-hidden="true">🔒</span>
                            <input
                                id="password"
                                type="password"
                                placeholder="Indtast dit kodeord"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="fw-button-area">
                        {error && <div role="alert" className="fw-error">{error}</div>}

                        <button className="fw-btn" type="submit" disabled={loading}>
                            {loading ? "Logger ind…" : "Log ind"}
                        </button>


                        <button className="fw-link" type="button">Glemt kodeord?</button>

                        <p className="fw-hint">
                            Hvis du ikke har en konto, skal du kontakte din
                            <br/>
                            institution for at blive oprettet
                        </p>
                    </div>
                </form>
            </main>
        </div>
    );
}
