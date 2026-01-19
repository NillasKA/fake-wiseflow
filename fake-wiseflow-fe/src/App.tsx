import { createRoot } from 'react-dom/client';
import './stylesheets/Main.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import ExaminatorDashboard from "./pages/ExaminatorDashboard";
import ResultsPage from "./pages/ResultsPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import RequireAuth from "./components/RequireAuth";
import MainLayout from "./layouts/MainLayout";
import RequireAdminAuth from './components/RequireAdminAuth';
import RequireStudentAuth from './components/RequireStudentAuth';


function SmartDashboard() {
    const { user } = useAuth();
    
    if (user?.roles.includes("SuperAdmin")) {
        return <AdminPage />;
    }
    
    if (user?.roles.includes("Examinator")) {
        return <ExaminatorDashboard />;
    }
    
    return <StudentDashboard />;
}

function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route element={<RequireAuth />}>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<SmartDashboard />} />
                    <Route path="/exams" element={<SmartDashboard />} />
                    <Route element={<RequireStudentAuth />}>
                        <Route path="/results" element={<ResultsPage />} />
                    </Route>
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