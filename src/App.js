import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import PublicLayout   from "./components/layout/PublicLayout";
import CitizenLayout  from "./components/layout/CitizenLayout";
import AdminLayout    from "./components/layout/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// ================= PUBLIC =================
import Home     from "./pages/public/Home";
import About    from "./pages/public/About";
import Services from "./pages/public/Services";
import Contact  from "./pages/public/Contact";
import FAQ      from "./pages/public/FAQ";
import Notices  from "./pages/public/Notices";

// ================= AUTH =================
import Login    from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// ================= CITIZEN =================
import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import CitizenOverview  from "./pages/citizen/CitizenOverview";
import SubmitComplaint  from "./pages/citizen/SubmitComplaint";
import MyComplaints     from "./pages/citizen/MyComplaints";
import ComplaintMap     from "./pages/citizen/ComplaintMap";
import Notifications    from "./pages/citizen/Notifications";
import Profile          from "./pages/citizen/Profile";

// ================= ADMIN =================
import AdminDashboard  from "./pages/admin/AdminDashboard";
import AdminOverview   from "./pages/admin/AdminOverview";
// import ManageComplaints from "./pages/admin/ManageComplaints";
// import Departments     from "./pages/admin/Departments";
// import Reports         from "./pages/admin/Reports";
// import SystemSettings  from "./pages/admin/SystemSettings";
// import UserOverview    from "./pages/admin/UserOverview";

function App() {
  return (
      <BrowserRouter>
        <Routes>

          {/* ── PUBLIC ──────────────────────────────────── */}
          <Route path="/"         element={<PublicLayout><Home     /></PublicLayout>} />
          <Route path="/about"    element={<PublicLayout><About    /></PublicLayout>} />
          <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
          <Route path="/contact"  element={<PublicLayout><Contact  /></PublicLayout>} />
          <Route path="/faq"      element={<PublicLayout><FAQ      /></PublicLayout>} />
          <Route path="/notices"  element={<PublicLayout><Notices  /></PublicLayout>} />

          {/* ── AUTH (no layout wrapper — full-page dark) ─ */}
          <Route path="/login"    element={<Login    />} />
          <Route path="/register" element={<Register />} />

          {/* ── CITIZEN (protected) ─────────────────────── */}
          <Route path="/citizen" element={
            <ProtectedRoute role="CITIZEN">
              <CitizenLayout><CitizenDashboard /></CitizenLayout>
            </ProtectedRoute>
          } />
          <Route path="/citizen/overview" element={
            <ProtectedRoute role="CITIZEN">
              <CitizenLayout><CitizenOverview /></CitizenLayout>
            </ProtectedRoute>
          } />
          <Route path="/citizen/submit" element={
            <ProtectedRoute role="CITIZEN">
              <CitizenLayout><SubmitComplaint /></CitizenLayout>
            </ProtectedRoute>
          } />
          <Route path="/citizen/my-complaints" element={
            <ProtectedRoute role="CITIZEN">
              <CitizenLayout><MyComplaints /></CitizenLayout>
            </ProtectedRoute>
          } />
          <Route path="/citizen/map" element={
            <ProtectedRoute role="CITIZEN">
              <CitizenLayout><ComplaintMap /></CitizenLayout>
            </ProtectedRoute>
          } />
          <Route path="/citizen/notifications" element={
            <ProtectedRoute role="CITIZEN">
              <CitizenLayout><Notifications /></CitizenLayout>
            </ProtectedRoute>
          } />
          <Route path="/citizen/profile" element={
            <ProtectedRoute role="CITIZEN">
              <CitizenLayout><Profile /></CitizenLayout>
            </ProtectedRoute>
          } />

          {/* ── ADMIN (protected — ADMIN role only) ─────── */}
          <Route path="/admin" element={
            <ProtectedRoute role="ADMIN">
              <AdminLayout><AdminDashboard /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/overview" element={
            <ProtectedRoute role="ADMIN">
              <AdminLayout><AdminOverview /></AdminLayout>
            </ProtectedRoute>
          } />
          {/*<Route path="/admin/complaints" element={*/}
          {/*  <ProtectedRoute role="ADMIN">*/}
          {/*    <AdminLayout><ManageComplaints /></AdminLayout>*/}
          {/*  </ProtectedRoute>*/}
          {/*} />*/}
          {/*<Route path="/admin/departments" element={*/}
          {/*  <ProtectedRoute role="ADMIN">*/}
          {/*    <AdminLayout><Departments /></AdminLayout>*/}
          {/*  </ProtectedRoute>*/}
          {/*} />*/}
          {/*<Route path="/admin/reports" element={*/}
          {/*  <ProtectedRoute role="ADMIN">*/}
          {/*    <AdminLayout><Reports /></AdminLayout>*/}
          {/*  </ProtectedRoute>*/}
          {/*} />*/}
          {/*<Route path="/admin/users" element={*/}
          {/*  <ProtectedRoute role="ADMIN">*/}
          {/*    <AdminLayout><UserOverview /></AdminLayout>*/}
          {/*  </ProtectedRoute>*/}
          {/*} />*/}
          {/*<Route path="/admin/settings" element={*/}
          {/*  <ProtectedRoute role="ADMIN">*/}
          {/*    <AdminLayout><SystemSettings /></AdminLayout>*/}
          {/*  </ProtectedRoute>*/}
          {/*} />*/}

          {/* ── Fallback ────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
  );
}

export default App;