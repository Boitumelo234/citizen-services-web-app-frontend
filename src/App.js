// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import PublicLayout  from "./components/layout/PublicLayout";
import CitizenLayout from "./components/layout/CitizenLayout";
import AdminLayout   from "./components/layout/AdminLayout";

// Public
import Home     from "./pages/public/Home";
import About    from "./pages/public/About";
import Services from "./pages/public/Services";
import FAQ      from "./pages/public/FAQ";
import Notices  from "./pages/public/Notices";
import Login    from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Citizen
import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import CitizenOverview  from "./pages/citizen/CitizenOverview";
import SubmitComplaint  from "./pages/citizen/SubmitComplaint";
import MyComplaints     from "./pages/citizen/MyComplaints";
import ComplaintMap     from "./pages/citizen/ComplaintMap";
import Notifications    from "./pages/citizen/Notifications";
import Profile          from "./pages/citizen/Profile";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOverview  from "./pages/admin/AdminOverview";

// Staff
import StaffDashboard              from "./pages/staff/StaffDashboard";
import StaffComplaints             from "./pages/staff/StaffComplaints";
import { StaffNotifications }      from "./pages/staff/StaffNotifications";
import { StaffProfile }            from "./pages/staff/StaffProfile";

// ── Helper: extract normalised role from JWT ─────────────────────────────────
function getRoleFromToken() {
    try {
        const token = localStorage.getItem("access_token");
        if (!token) return null;

        const decoded = jwtDecode(token);

        // Handle all common JWT role shapes
        let raw = decoded.role
            || decoded.roles
            || (Array.isArray(decoded.authorities) ? decoded.authorities[0] : null)
            || "";

        if (Array.isArray(raw)) raw = raw[0];
        return raw.replace("ROLE_", "").toUpperCase();   // → "ADMIN" | "STAFF" | "CITIZEN"
    } catch {
        return null;
    }
}

// ── Role-based route guard ───────────────────────────────────────────────────
// Pass `role` as the REQUIRED role (e.g. "STAFF").
// If omitted, just checks that a valid token exists.
function PrivateRoute({ children, role }) {
    const token = localStorage.getItem("access_token");
    if (!token) return <Navigate to="/login" replace />;

    if (role) {
        const userRole = getRoleFromToken();
        if (!userRole) return <Navigate to="/login" replace />;
        if (userRole !== role.toUpperCase()) {
            // Redirect to the correct home rather than login, so the user
            // isn't silently dropped if they manually type a URL.
            if (userRole === "ADMIN")   return <Navigate to="/admin/overview"   replace />;
            if (userRole === "STAFF")   return <Navigate to="/staff/dashboard"  replace />;
            if (userRole === "CITIZEN") return <Navigate to="/citizen"          replace />;
            return <Navigate to="/login" replace />;
        }
    }
    return children;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* ── PUBLIC ── */}
                <Route path="/"          element={<PublicLayout><Home     /></PublicLayout>} />
                <Route path="/about"     element={<PublicLayout><About    /></PublicLayout>} />
                <Route path="/services"  element={<PublicLayout><Services /></PublicLayout>} />
                <Route path="/faq"       element={<PublicLayout><FAQ      /></PublicLayout>} />
                <Route path="/notices"   element={<PublicLayout><Notices  /></PublicLayout>} />
                <Route path="/login"     element={<PublicLayout><Login    /></PublicLayout>} />
                <Route path="/register"  element={<PublicLayout><Register /></PublicLayout>} />

                {/* ── CITIZEN ── */}
                <Route path="/citizen"               element={<PrivateRoute role="CITIZEN"><CitizenLayout><CitizenDashboard /></CitizenLayout></PrivateRoute>} />
                <Route path="/citizen/overview"      element={<PrivateRoute role="CITIZEN"><CitizenLayout><CitizenOverview  /></CitizenLayout></PrivateRoute>} />
                <Route path="/citizen/submit"        element={<PrivateRoute role="CITIZEN"><CitizenLayout><SubmitComplaint  /></CitizenLayout></PrivateRoute>} />
                <Route path="/citizen/my-complaints" element={<PrivateRoute role="CITIZEN"><CitizenLayout><MyComplaints     /></CitizenLayout></PrivateRoute>} />
                <Route path="/citizen/map"           element={<PrivateRoute role="CITIZEN"><CitizenLayout><ComplaintMap     /></CitizenLayout></PrivateRoute>} />
                <Route path="/citizen/notifications" element={<PrivateRoute role="CITIZEN"><CitizenLayout><Notifications    /></CitizenLayout></PrivateRoute>} />
                <Route path="/citizen/profile"       element={<PrivateRoute role="CITIZEN"><CitizenLayout><Profile          /></CitizenLayout></PrivateRoute>} />

                {/* ── ADMIN ── */}
                <Route path="/admin"          element={<PrivateRoute role="ADMIN"><AdminLayout><AdminDashboard /></AdminLayout></PrivateRoute>} />
                <Route path="/admin/overview" element={<PrivateRoute role="ADMIN"><AdminLayout><AdminOverview  /></AdminLayout></PrivateRoute>} />

                {/* ── STAFF ── (StaffLayout is self-contained inside each page) */}
                <Route path="/staff"                element={<Navigate to="/staff/dashboard" replace />} />
                <Route path="/staff/dashboard"      element={<PrivateRoute role="STAFF"><StaffDashboard     /></PrivateRoute>} />
                <Route path="/staff/complaints"     element={<PrivateRoute role="STAFF"><StaffComplaints    /></PrivateRoute>} />
                <Route path="/staff/complaints/:id" element={<PrivateRoute role="STAFF"><StaffComplaints    /></PrivateRoute>} />
                <Route path="/staff/notifications"  element={<PrivateRoute role="STAFF"><StaffNotifications /></PrivateRoute>} />
                <Route path="/staff/profile"        element={<PrivateRoute role="STAFF"><StaffProfile       /></PrivateRoute>} />

                {/* ── FALLBACK ── */}
                <Route path="*" element={<Navigate to="/login" replace />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;