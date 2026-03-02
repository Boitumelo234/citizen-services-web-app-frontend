import { Link, NavLink } from "react-router-dom";

function Sidebar({ role }) {
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
                    <NavLink to="/citizen/profile" className={({ isActive }) => `citizen-v2-nav-item ${isActive ? "active" : ""}`}>
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
            <h3>Admin</h3>
            <Link to="/admin">Dashboard</Link>
            <Link to="/admin/overview">Overview</Link>
            <Link to="/admin/complaints">Manage Complaints</Link>
            <Link to="/admin/departments">Departments</Link>
            <Link to="/admin/reports">Reports</Link>
            <Link to="/admin/users">Users</Link>
            <Link to="/admin/settings">System Settings</Link>
            <Link to="/">Logout</Link>
        </aside>
    );
}

export default Sidebar;
