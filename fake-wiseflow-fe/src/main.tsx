import { createRoot } from 'react-dom/client';
import './stylesheets/Main.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import { useAuth } from './hooks/useAuth';

function App() {
    const { user, setUser } = useAuth();

    const handleLogin = (userData: unknown) => {
        setUser(userData as any);
    };

    return (
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
    );
}

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);