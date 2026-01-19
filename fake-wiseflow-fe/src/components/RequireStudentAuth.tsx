import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireStudentAuth() {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user || !user.roles.includes("Student")) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return <Outlet />;
}