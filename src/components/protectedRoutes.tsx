import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loader from "./loader";
import { routes } from "../lib/routes";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <Loader />;
    }

    if (!user) {
        return (
            <Navigate
                to={`${routes.index}?redirect=${encodeURIComponent(location.pathname)}`}
                replace
            />
        );
    }

    if (allowedRoles && (!user.role || !allowedRoles.includes(user.role))) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
};