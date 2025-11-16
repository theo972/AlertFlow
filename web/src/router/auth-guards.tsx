import { Navigate, Outlet, useLocation } from "react-router-dom";

function hasToken(): boolean {
    try {
        const raw = localStorage.getItem("auth");
        if (!raw) return false;
        const parsed = JSON.parse(raw);
        return !!parsed.token;
    } catch {
        return false;
    }
}

export function RequireAuth() {
    const location = useLocation();
    const ok = hasToken();

    if (!ok) {
        return (
            <Navigate
                to="/auth/login"
                state={{ from: location }}
                replace
            />
        );
    }
    return <Outlet />;
}

export function AuthOnly() {
    const ok = hasToken();
    if (ok) {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
}
