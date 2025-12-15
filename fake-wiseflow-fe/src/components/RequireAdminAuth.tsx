import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAdminAuth(){
    const { user } = useAuth();
    const location = useLocation();

    const isAdmin = user?.roles?.includes("InstitutionAdmin") || user?.roles?.includes("SuperAdmin");

    return (isAdmin
            ? <Outlet />
            : <Navigate to="/" state={{ from: location }} replace />
    );
}