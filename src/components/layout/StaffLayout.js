// components/layout/StaffLayout.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/staff.css";

const NAV_ITEMS = [
    { key: "dashboard",     label: "Dashboard",    icon: "🏠", path: "/staff/dashboard" },
    { key: "complaints",    label: "My Complaints", icon: "📋", path: "/staff/complaints" },
    { key: "notifications", label: "Notifications", icon: "🔔", path: "/staff/notifications" },
    { key: "profile",       label: "Profile",       icon: "👤", path: "/staff/profile" },
];

export default function StaffLayout({ children }) {
    const navigate  = useNavigate();
    const location  = useLocation();
    const [user, setUser]     = useState({ name: "Staff", dept: "Department", initials: "S" });
    const [unread, setUnread] = useState(0);

    useEffect(() => {
        try {
            const stored = localStorage.getItem("user");
            if (stored) {
                const u = JSON.parse(stored);
                const displayName = u.fullName || u.email || "Staff";
                setUser({
                    name:     displayName,
                    dept:     u.departmentName || u.department || "Department",
                    initials: displayName[0].toUpperCase(),
                });
            }
        } catch { /* keep defaults */ }
    }, []);

    useEffect(() => {
        let cancelled = false;
        const fetchUnread = async () => {
            try {
                const { getNotifications } = await import("../../services/staffService");
                const data = await getNotifications();
                if (!cancelled) {
                    const arr = Array.isArray(data) ? data : [];
                    setUnread(arr.filter(n => !n.read).length);
                }
            } catch { /* non-critical */ }
        };
        fetchUnread();
        const interval = setInterval(fetchUnread, 30000);
        return () => { cancelled = true; clearInterval(interval); };
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        navigate("/");
    };

    const activeKey = NAV_ITEMS.find(n =>
        location.pathname === n.path ||
        (n.key === "complaints" && location.pathname.startsWith("/staff/complaints"))
    )?.key ?? "dashboard";

    const pageTitle = NAV_ITEMS.find(n => n.key === activeKey)?.label ?? "Staff Portal";

    return (
        <div className="staff-layout">
            <aside className="staff-sidebar">
                <div className="staff-brand">
                    <span className="staff-brand-name">🏛 RLM Staff</span>
                    <span className="staff-brand-sub">Rustenburg Municipality</span>
                </div>
                <nav className="staff-nav">
                    {NAV_ITEMS.map(item => (
                        <button
                            key={item.key}
                            className={`staff-nav-item ${activeKey === item.key ? "active" : ""}`}
                            onClick={() => navigate(item.path)}
                        >
                            <span className="staff-nav-icon">{item.icon}</span>
                            {item.label}
                            {item.key === "notifications" && unread > 0 && (
                                <span className="staff-nav-badge">{unread}</span>
                            )}
                        </button>
                    ))}
                </nav>
                <div className="staff-sidebar-footer">
                    <div className="staff-user-card">
                        <div className="staff-user-avatar">{user.initials}</div>
                        <div>
                            <span className="staff-user-name">{user.name}</span>
                            <span className="staff-user-dept">{user.dept}</span>
                        </div>
                    </div>
                    <button className="staff-logout-btn" onClick={handleLogout}>🚪 Logout</button>
                </div>
            </aside>

            <main className="staff-main">
                <header className="staff-topbar">
                    <div className="staff-topbar-left">
                        <h1>{pageTitle}</h1>
                        <p>Rustenburg Local Municipality — Staff Portal</p>
                    </div>
                    <div className="staff-topbar-right">
                        <button className="staff-notif-btn" onClick={() => navigate("/staff/notifications")} title="Notifications">
                            🔔
                            {unread > 0 && <span className="staff-notif-dot" />}
                        </button>
                        <div className="staff-user-avatar" style={{ cursor: "pointer" }} onClick={() => navigate("/staff/profile")} title="Profile">
                            {user.initials}
                        </div>
                    </div>
                </header>
                {children}
            </main>
        </div>
    );
}
