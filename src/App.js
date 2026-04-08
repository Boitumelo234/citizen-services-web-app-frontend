import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicLayout from "./components/layout/PublicLayout";
import CitizenLayout from "./components/layout/CitizenLayout";
import AdminLayout from "./components/layout/AdminLayout";

// Public
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Services from "./pages/public/Services";
import Contact from "./pages/public/Contact";
import FAQ from "./pages/public/FAQ";
import Notices from "./pages/public/Notices";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Citizen
import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import CitizenOverview from "./pages/citizen/CitizenOverview";
import SubmitComplaint from "./pages/citizen/SubmitComplaint";
import MyComplaints from "./pages/citizen/MyComplaints";
import ComplaintMap from "./pages/citizen/ComplaintMap";
import Notifications from "./pages/citizen/Notifications";
import Profile from "./pages/citizen/Profile";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOverview from "./pages/admin/AdminOverview";
import ManageComplaints from "./pages/admin/ManageComplaints";
import Departments from "./pages/admin/Departments";
import Reports from "./pages/admin/Reports";
import Users from "./pages/admin/Users";
import SystemSettings from "./pages/admin/SystemSettings";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* PUBLIC */}
                <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
                <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
                <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
                <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
                <Route path="/faq" element={<PublicLayout><FAQ /></PublicLayout>} />
                <Route path="/notices" element={<PublicLayout><Notices /></PublicLayout>} />
                <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
                <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />

                {/* CITIZEN */}
                <Route path="/citizen" element={<CitizenLayout><CitizenDashboard /></CitizenLayout>} />
                <Route path="/citizen/overview" element={<CitizenLayout><CitizenOverview /></CitizenLayout>} />
                <Route path="/citizen/submit" element={<CitizenLayout><SubmitComplaint /></CitizenLayout>} />
                <Route path="/citizen/my-complaints" element={<CitizenLayout><MyComplaints /></CitizenLayout>} />
                <Route path="/citizen/map" element={<CitizenLayout><ComplaintMap /></CitizenLayout>} />
                <Route path="/citizen/notifications" element={<CitizenLayout><Notifications /></CitizenLayout>} />
                <Route path="/citizen/profile" element={<CitizenLayout><Profile /></CitizenLayout>} />

                {/* ADMIN */}
                <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
                <Route path="/admin/overview" element={<AdminLayout><AdminOverview /></AdminLayout>} />
                <Route path="/admin/complaints" element={<AdminLayout><ManageComplaints /></AdminLayout>} />
                <Route path="/admin/departments" element={<AdminLayout><Departments /></AdminLayout>} />
                <Route path="/admin/reports" element={<AdminLayout><Reports /></AdminLayout>} />
                <Route path="/admin/users" element={<AdminLayout><Users /></AdminLayout>} />
                <Route path="/admin/settings" element={<AdminLayout><SystemSettings /></AdminLayout>} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;