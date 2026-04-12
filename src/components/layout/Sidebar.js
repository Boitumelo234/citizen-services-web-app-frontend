import { Link, NavLink, useLocation } from "react-router-dom";
import "../../styles/dashboard.css";

const ICONS = {
    dashboard: "",
    overview: "",
    settings: "",
    logout: "",
};

function Sidebar({ role }) {
    const location = useLocation();
    const active = (path) => (location.pathname === path ? "active" : "");

    if (role === "citizen") {
        const navItems = [
            { label: "Dashboard", to: "/citizen" },
            { label: "Overview", to: "/citizen/overview" },
            { label: "Submit Complaint", to: "/citizen/submit" },
            { label: "My Complaints", to: "/citizen/my-complaints" },
            { label: "Complaint Map", to: "/citizen/map" },
            { label: "Notifications", to: "/citizen/notifications" },
        ];

        return (
            <aside className="sidebar citizen-v2-sidebar">
                <div className="citizen-v2-brand">Citizen</div>
                <nav className="citizen-v2-nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) => `citizen-v2-nav-item ${isActive ? "active" : ""}`}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
                <div className="citizen-v2-side-footer">
                    <NavLink
                        to="/citizen/profile"
                        className={({ isActive }) => `citizen-v2-nav-item ${isActive ? "active" : ""}`}
                    >
                        Profile
                    </NavLink>
                    <Link to="/" className="citizen-v2-nav-item logout">
                        Logout
                    </Link>
                </div>
            </aside>
        );
    }

    return (
        <aside className="sidebar">
            <h3>Admin Panel</h3>
            <Link to="/admin" className={active("/admin")}>
                {ICONS.dashboard} Dashboard
            </Link>
            <Link to="/admin/overview" className={active("/admin/overview")}>
                {ICONS.overview} Overview
            </Link>
            {/*<Link to="/admin/complaints" className={active("/admin/complaints")}>*/}
            {/*    {ICONS.complaints} Manage Complaints*/}
            {/*</Link>*/}
            {/*<Link to="/admin/departments" className={active("/admin/departments")}>*/}
            {/*    {ICONS.departments} Departments*/}
            {/*</Link>*/}
            {/*<Link to="/admin/reports" className={active("/admin/reports")}>*/}
            {/*    {ICONS.reports} Reports & Analytics*/}
            {/*</Link>*/}
            {/*<Link to="/admin/users" className={active("/admin/users")}>*/}
            {/*    {ICONS.users} User Management*/}
            {/*</Link>*/}
            {/*<Link to="/admin/settings" className={active("/admin/settings")}>*/}
            {/*    {ICONS.settings} System Settings*/}
            {/*</Link>*/}
            <Link to="/">{ICONS.logout} logout</Link>
        </aside>
    );
}

export default Sidebar;
