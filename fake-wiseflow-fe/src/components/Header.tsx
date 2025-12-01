import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../stylesheets/components/Header.css";

const API_BASE = "https://localhost:7130";

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await fetch(`${API_BASE}/api/Auth/logout`, {
                method: "POST",
                credentials: "include"
            });
        } catch (error) {
            console.error("Logout failed on server", error);
        } finally {
            logout();
            navigate("/login");
        }
    };

    return (
        <header className="app-header">
            <div className="header-inner">
                <div className="left">
                    <Link to="/" className="brand">FW</Link>

                    <nav className="nav">
                        <Link to="/exams">Eksamener</Link>
                        <span className="divider" aria-hidden="true" />
                        <Link to="/results">Resultater</Link>
                        <span className="divider" aria-hidden="true" />
                        {user?.roles.includes("SuperAdmin",) && (
                            <Link to="/admin">Admin</Link>
                        )}
                    </nav>
                </div>

                <div className="right">
                    <span className="greeting">
                        Hej {user?.userName || user?.email}!
                        Rolle: {user?.roles?.at(0)}
                    </span>

                    <button
                        onClick={handleLogout}
                        className="logout-btn"
                        type="button"
                    >
                        Log ud
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;