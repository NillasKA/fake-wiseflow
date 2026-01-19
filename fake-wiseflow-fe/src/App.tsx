import { createRoot } from 'react-dom/client';
import './stylesheets/Main.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./components/RequireAuth";
import MainLayout from "./layouts/MainLayout";
import RequireAdminAuth from './components/RequireAdminAuth';

function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route element={<RequireAuth />}>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<StudentDashboard />} />
                    <Route path="/exams" element={<StudentDashboard />} />
                    <Route path="/results" element={<StudentDashboard />} />

                    <Route element={<RequireAdminAuth />}>
                        <Route path="/admin" element={<AdminPage />} />
                    </Route>

                </Route>
            </Route>
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
}

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);