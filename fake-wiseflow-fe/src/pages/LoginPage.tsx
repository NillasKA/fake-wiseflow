import "../stylesheets/pages/LoginPage.css"
import { useState } from "react";
import { login, getMe } from "../api/auth";

type Props = {
    onLogin?: (user: unknown) => void;
    verifyAfterLogin?: boolean;
    redirectTo?: string;
};

export default function LoginPage({ onLogin, verifyAfterLogin = true }: Props) {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setLoading(true);

        try {
            await login({ email, password });

            let me = null;
            if (verifyAfterLogin) {
                me = await getMe();
            }

            if (onLogin) {
                onLogin(me || { email });
            }
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : "Ukendt fejl. Kunne ikke logge ind.");
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
