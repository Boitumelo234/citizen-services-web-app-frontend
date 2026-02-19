import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicLayout from "./components/layout/PublicLayout";
import CitizenLayout from "./components/layout/CitizenLayout";
import AdminLayout from "./components/layout/AdminLayout";

import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import SubmitComplaint from "./pages/citizen/SubmitComplaint";
import MyComplaints from "./pages/citizen/MyComplaints";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageComplaints from "./pages/admin/ManageComplaints";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public */}
                <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
                <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
                <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
                <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
                <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />

                {/* Citizen */}
                <Route path="/citizen" element={<CitizenLayout><CitizenDashboard /></CitizenLayout>} />
                <Route path="/citizen/submit" element={<CitizenLayout><SubmitComplaint /></CitizenLayout>} />
                <Route path="/citizen/my-complaints" element={<CitizenLayout><MyComplaints /></CitizenLayout>} />

                {/* Admin */}
                <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
                <Route path="/admin/complaints" element={<AdminLayout><ManageComplaints /></AdminLayout>} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;