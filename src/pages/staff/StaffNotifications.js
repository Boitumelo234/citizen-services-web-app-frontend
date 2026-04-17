// pages/staff/StaffNotifications.jsx
import { useEffect, useState, useCallback } from "react";
import StaffLayout from "../../components/layout/StaffLayout";
import {
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead,
} from "../../services/staffService";
import "../../styles/staff.css";

function timeAgo(dateStr) {
    if (!dateStr) return "—";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs  = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);
    if (days > 0) return `${days}d ago`;
    if (hrs  > 0) return `${hrs}h ago`;
    if (mins > 0) return `${mins}m ago`;
    return "just now";
}

const NOTIF_ICONS = {
    ASSIGNED:   "📋",
    ESCALATED:  "🔴",
    RESOLVED:   "✅",
    OVERDUE:    "⏰",
    COMMENT:    "💬",
    SYSTEM:     "🔔",
};

export function StaffNotifications() {
    const [notifs, setNotifs]   = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter]   = useState("all");   // all | unread
    const [toast, setToast]     = useState(null);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchNotifs = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getNotifications();
            setNotifs(Array.isArray(data) ? data : []);
        } catch {
            // Fallback: show empty state gracefully
            setNotifs([]);
        }
        setLoading(false);
    }, []);

    useEffect(() => { fetchNotifs(); }, [fetchNotifs]);

    const handleMarkRead = async (id) => {
        try {
            await markNotificationRead(id);
            setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch {
            showToast("Failed to mark as read", "error");
        }
    };

    const handleMarkAll = async () => {
        try {
            await markAllNotificationsRead();
            setNotifs(prev => prev.map(n => ({ ...n, read: true })));
            showToast("All notifications marked as read");
        } catch {
            showToast("Failed to update notifications", "error");
        }
    };

    const filtered = filter === "unread" ? notifs.filter(n => !n.read) : notifs;
    const unreadCount = notifs.filter(n => !n.read).length;

    return (
        <StaffLayout>
            <div className="staff-page">
                <div className="staff-page-header">
                    <div>
                        <h2 className="staff-page-title">🔔 Notifications</h2>
                        <p className="staff-page-sub">
                            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}` : "All caught up!"}
                        </p>
                    </div>
                    <div style={{ display: "flex", gap: "0.65rem" }}>
                        <button className="staff-btn-outline"
                                onClick={() => setFilter(f => f === "unread" ? "all" : "unread")}>
                            {filter === "unread" ? "Show All" : `Unread (${unreadCount})`}
                        </button>
                        {unreadCount > 0 && (
                            <button className="staff-btn-primary" onClick={handleMarkAll}>
                                ✓ Mark All Read
                            </button>
                        )}
                    </div>
                </div>

                {toast && <div className={`staff-toast ${toast.type}`}>{toast.msg}</div>}

                {loading ? (
                    <div className="staff-loading">
                        <div className="staff-spinner" />
                        <span>Loading notifications…</span>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="staff-card" style={{ textAlign: "center", padding: "3rem" }}>
                        <div className="staff-empty">
                            <span className="staff-empty-icon">🎉</span>
                            <p className="staff-empty-text">
                                {filter === "unread" ? "No unread notifications." : "No notifications yet."}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="staff-card">
                        <div className="staff-notif-list">
                            {filtered.map(n => (
                                <div
                                    key={n.id}
                                    className={`staff-notif-item ${!n.read ? "unread" : ""}`}
                                    onClick={() => !n.read && handleMarkRead(n.id)}
                                    style={{ cursor: !n.read ? "pointer" : "default" }}
                                >
                                    <div className="staff-notif-icon">
                                        {NOTIF_ICONS[n.type] || "🔔"}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p className="staff-notif-msg">{n.message}</p>
                                        <p className="staff-notif-time">{timeAgo(n.createdAt)}</p>
                                    </div>
                                    {!n.read && <div className="staff-notif-unread-dot" />}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </StaffLayout>
    );
}
