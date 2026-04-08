import { Link, useLocation } from "react-router-dom";
import '../../styles/dashboard.css';

// Simple inline icon map – no extra library needed
const ICONS = {
    dashboard:    "⊞",
    overview:     "◉",
    complaints:   "📋",
    departments:  "🏢",
    reports:      "📊",
    users:        "👥",
    settings:     "⚙",
    logout:       "⇦",
    submit:       "✏",
    mycomplaints: "📌",
    map:          "🗺",
    notifications:"🔔",
    profile:      "👤",
};

function Sidebar({ role }) {
    const location = useLocation();
    const active = (path) => location.pathname === path ? "active" : "";

    return (
        <aside className="sidebar">

            {role === "citizen" && (
                <>
                    <h3>Citizen Portal</h3>
                    <Link to="/citizen"                className={active("/citizen")}>
                        {ICONS.dashboard} Dashboard
                    </Link>
                    <Link to="/citizen/overview"       className={active("/citizen/overview")}>
                        {ICONS.overview} Overview
                    </Link>
                    <Link to="/citizen/submit"         className={active("/citizen/submit")}>
                        {ICONS.submit} Submit Complaint
                    </Link>
                    <Link to="/citizen/my-complaints"  className={active("/citizen/my-complaints")}>
                        {ICONS.mycomplaints} My Complaints
                    </Link>
                    <Link to="/citizen/map"            className={active("/citizen/map")}>
                        {ICONS.map} Complaint Map
                    </Link>
                    <Link to="/citizen/notifications"  className={active("/citizen/notifications")}>
                        {ICONS.notifications} Notifications
                    </Link>
                    <Link to="/citizen/profile"        className={active("/citizen/profile")}>
                        {ICONS.profile} Profile
                    </Link>
                    <Link to="/">{ICONS.logout} Logout</Link>
                </>
            )}

            {role === "admin" && (
                <>
                    <h3>Admin Panel</h3>
                    <Link to="/admin"                  className={active("/admin")}>
                        {ICONS.dashboard} Dashboard
                    </Link>
                    <Link to="/admin/overview"         className={active("/admin/overview")}>
                        {ICONS.overview} Overview
                    </Link>
                    <Link to="/admin/complaints"       className={active("/admin/complaints")}>
                        {ICONS.complaints} Manage Complaints
                    </Link>
                    <Link to="/admin/departments"      className={active("/admin/departments")}>
                        {ICONS.departments} Departments
                    </Link>
                    <Link to="/admin/reports"          className={active("/admin/reports")}>
                        {ICONS.reports} Reports & Analytics
                    </Link>
                    <Link to="/admin/users"            className={active("/admin/users")}>
                        {ICONS.users} User Management
                    </Link>
                    <Link to="/admin/settings"         className={active("/admin/settings")}>
                        {ICONS.settings} System Settings
                    </Link>
                    <Link to="/">{ICONS.logout} Logout</Link>
                </>
            )}

        </aside>
    );
}

export default Sidebar;