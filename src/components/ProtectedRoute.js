import { Navigate } from "react-router-dom";

/**
 * Wraps a route and redirects to /login if:
 *  - No token in localStorage
 *  - Role doesn't match the required role (if specified)
 *
 * Usage:
 *   <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
 */
function ProtectedRoute({ children, role }) {
    const token = localStorage.getItem("token");

    // Not logged in at all
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Check role if required
    if (role) {
        try {
            const payload     = JSON.parse(atob(token.split(".")[1]));
            const storedRole  = payload.role;
            if (storedRole !== role) {
                // Logged in but wrong role — send to their own dashboard
                if (storedRole === "ADMIN")   return <Navigate to="/admin/overview" replace />;
                if (storedRole === "STAFF")   return <Navigate to="/staff"          replace />;
                if (storedRole === "CITIZEN") return <Navigate to="/citizen"        replace />;
                return <Navigate to="/login" replace />;
            }
        } catch {
            // Bad token — clear and redirect
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            return <Navigate to="/login" replace />;
        }
    }

    return children;
}

export default ProtectedRoute;