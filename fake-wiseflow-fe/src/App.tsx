// src/App.tsx
import { createRoot } from 'react-dom/client';
import './stylesheets/Main.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import { useAuth } from './hooks/useAuth';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
    const { user, setUser } = useAuth();

    const handleLogin = (userData: unknown) => {
        setUser(userData as any);
    };

    return (
        <div className="app-container">
            <main className="main-content">
                {user && <Header />}

                <Routes>
                    <Route
                        path="/"
                        element={user ? <HomePage /> : <Navigate to="/login" />}
                    />

                    <Route
                        path="/login"
                        element={
                            !user
                                ? <LoginPage
                                    onLogin={handleLogin}
                                    verifyAfterLogin={false}
                                />
                                : <Navigate to="/" />
                        }
                    />

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
            {user && <Footer />}
        </div>
    );
}

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);