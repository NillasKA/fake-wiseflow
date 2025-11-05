import React from "react";
import "../stylesheets/components/Header.css";
import {useAuth} from "../hooks/useAuth.ts";

const Header: React.FC = () => {
    const { user } = useAuth();

    return (
        <header className="app-header">
            <div className="header-inner">
                <div className="left">
                    <a href="/" className="brand">FW</a>

                    <nav className="nav">
                        <a href="/eksamener">Eksamener</a>
                        <span className="divider" aria-hidden="true" />
                        <a href="/resultater">Resultater</a>
                        <span className="divider" aria-hidden="true" />
                        <a href="/admin">Admin</a>
                    </nav>
                </div>

                <div className="right">
                    <span className="greeting">Hej {user?.userName}!</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
