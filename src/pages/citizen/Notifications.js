// pages/citizen/Notifications.jsx
import { useEffect, useState, useCallback } from "react";
import { getNotifications, markAllNotificationsRead, markNotificationRead } from "../../services/citizenService";
import "../../styles/dashboard.css";

function timeAgo(dateStr) {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs  = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);
    if (days > 0) return `${days}d ago`;
    if (hrs  > 0) return `${hrs}h ago`;
    if (mins > 0) return `${mins}m ago`;
    return "just now";
}

const NOTIF_META = {
    ASSIGNED:   { icon: "📋", color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
    ESCALATED:  { icon: "🔴", color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
    RESOLVED:   { icon: "✅", color: "#16a34a", bg: "#dcfce7", border: "#bbf7d0" },
    OVERDUE:    { icon: "⏰", color: "#d97706", bg: "#fff7ed", border: "#fed7aa" },
    COMMENT:    { icon: "💬", color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
    SYSTEM:     { icon: "🔔", color: "#0284c7", bg: "#f0f9ff", border: "#bae6fd" },
    success:    { icon: "✅", color: "#16a34a", bg: "#dcfce7", border: "#bbf7d0" },
    info:       { icon: "ℹ️",  color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
    warning:    { icon: "⚠️", color: "#d97706", bg: "#fff7ed", border: "#fed7aa" },
};

const DEFAULT_META = { icon: "🔔", color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" };

function getMeta(notif) {
    return NOTIF_META[notif.type] || DEFAULT_META;
}

function NotifItem({ notif, onMarkRead, busy }) {
    const meta = getMeta(notif);
    return (
        <div style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "1rem",
            padding: "1rem 1.1rem",
            borderRadius: "1rem",
            background: notif.read ? "#f9fafb" : meta.bg,
            border: `1px solid ${notif.read ? "#e5e7eb" : meta.border}`,
            transition: "all 0.2s",
            position: "relative",
        }}>
            {/* Unread dot */}
            {!notif.read && (
                <div style={{
                    position: "absolute",
                    top: "1rem", right: "1rem",
                    width: 8, height: 8,
                    borderRadius: "50%",
                    background: meta.color,
                }} />
            )}

            {/* Icon */}
            <div style={{
                width: 38, height: 38,
                borderRadius: "50%",
                background: meta.bg,
                border: `1px solid ${meta.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.1rem",
                flexShrink: 0,
            }}>
                {meta.icon}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
                {notif.title && (
                    <p style={{
                        margin: "0 0 0.2rem",
                        fontSize: "0.875rem",
                        fontWeight: notif.read ? 600 : 700,
                        color: "#0f172a",
                    }}>
                        {notif.title}
                    </p>
                )}
                <p style={{
                    margin: "0 0 0.3rem",
                    fontSize: "0.845rem",
                    color: notif.read ? "#4b5563" : "#1e293b",
                    fontWeight: notif.read ? 400 : 500,
                    lineHeight: 1.5,
                }}>
                    {notif.message}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                        🕐 {timeAgo(notif.createdAt)}
                    </span>
                    {notif.type && (
                        <span style={{
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            padding: "0.1rem 0.5rem",
                            borderRadius: "999px",
                            background: meta.bg,
                            color: meta.color,
                            border: `1px solid ${meta.border}`,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                        }}>
                            {notif.type}
                        </span>
                    )}
                    {notif.read && (
                        <span style={{ fontSize: "0.68rem", color: "#22c55e", fontWeight: 600 }}>✓ Read</span>
                    )}
                </div>
                {!notif.read && (
                    <button
                        onClick={() => onMarkRead(notif.id)}
                        disabled={busy}
                        style={{
                            marginTop: "0.6rem",
                            background: "white",
                            border: `1px solid ${meta.border}`,
                            borderRadius: "0.6rem",
                            padding: "0.3rem 0.8rem",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            color: meta.color,
                            cursor: busy ? "not-allowed" : "pointer",
                            opacity: busy ? 0.6 : 1,
                            transition: "all 0.15s",
                        }}
                    >
                        {busy ? "Updating…" : "Mark as read"}
                    </button>
                )}
            </div>
        </div>
    );
}

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState("");
    const [busyId, setBusyId]     = useState(null);   // notif id | "all" | null
    const [filter, setFilter]     = useState("all");  // all | unread | read
    const [toast, setToast]       = useState(null);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const data = await getNotifications();
            setNotifications(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.response?.data?.error || "Unable to load notifications");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleMarkRead = async (id) => {
        setBusyId(id);
        try {
            await markNotificationRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
            showToast("Marked as read");
        } catch (err) {
            showToast(err.response?.data?.error || "Failed to mark as read", "error");
        } finally {
            setBusyId(null);
        }
    };

    const handleMarkAll = async () => {
        setBusyId("all");
        try {
            await markAllNotificationsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            showToast("All notifications marked as read");
        } catch (err) {
            showToast(err.response?.data?.error || "Failed to update notifications", "error");
        } finally {
            setBusyId(null);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const filtered = notifications.filter(n => {
        if (filter === "unread") return !n.read;
        if (filter === "read")   return n.read;
        return true;
    });

    return (
        <div className="citizen-v2-page">

            {/* ── PAGE HEADER ── */}
            <section className="citizen-v2-header enhanced">
                <div>
                    <h1>🔔 Notifications</h1>
                    <p>
                        {unreadCount > 0
                            ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                            : "You're all caught up!"}
                    </p>
                </div>
                <div style={{ display: "flex", gap: "0.65rem", alignItems: "center", flexWrap: "wrap" }}>
                    {unreadCount > 0 && (
                        <button
                            className="citizen-v2-primary-btn"
                            onClick={handleMarkAll}
                            disabled={busyId === "all"}
                            style={{ opacity: busyId === "all" ? 0.65 : 1 }}
                        >
                            {busyId === "all" ? "Updating…" : "✓ Mark All Read"}
                        </button>
                    )}
                    <button
                        style={{
                            background: "white", border: "1px solid #e2e8f0",
                            borderRadius: "999px", padding: "0.6rem 1rem",
                            fontSize: "0.85rem", fontWeight: 600, color: "#475569",
                            cursor: "pointer",
                        }}
                        onClick={load}
                    >
                        ↻ Refresh
                    </button>
                </div>
            </section>

            {/* ── TOAST ── */}
            {toast && (
                <div style={{
                    position: "fixed", top: "1.25rem", right: "1.5rem", zIndex: 99999,
                    padding: "0.75rem 1.25rem", borderRadius: "0.75rem",
                    background: toast.type === "success" ? "#dcfce7" : toast.type === "error" ? "#fee2e2" : "#eff6ff",
                    border: `1px solid ${toast.type === "success" ? "#bbf7d0" : toast.type === "error" ? "#fecaca" : "#bfdbfe"}`,
                    color: toast.type === "success" ? "#166534" : toast.type === "error" ? "#b91c1c" : "#1e40af",
                    fontWeight: 600, fontSize: "0.875rem",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    display: "flex", alignItems: "center", gap: "0.5rem",
                    animation: "fadeInDown 0.2s ease",
                }}>
                    {toast.type === "success" ? "✓" : "✕"} {toast.msg}
                </div>
            )}

            {error && (
                <p style={{ color: "#dc2626", fontWeight: 500, marginBottom: "1rem" }}>{error}</p>
            )}

            {/* ── SUMMARY CHIPS ── */}
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                {[
                    { key: "all",    label: `All (${notifications.length})` },
                    { key: "unread", label: `Unread (${unreadCount})` },
                    { key: "read",   label: `Read (${notifications.length - unreadCount})` },
                ].map(chip => (
                    <button key={chip.key} onClick={() => setFilter(chip.key)} style={{
                        padding: "0.4rem 1rem",
                        borderRadius: "999px",
                        border: filter === chip.key ? "1px solid #2563eb" : "1px solid #e2e8f0",
                        background: filter === chip.key ? "#eff6ff" : "white",
                        color: filter === chip.key ? "#2563eb" : "#64748b",
                        fontWeight: 600, fontSize: "0.8rem", cursor: "pointer",
                        transition: "all 0.15s",
                    }}>
                        {chip.label}
                    </button>
                ))}
            </div>

            {/* ── LIST ── */}
            <div className="citizen-v2-card" style={{ padding: "1.25rem" }}>
                {loading ? (
                    <div style={{ textAlign: "center", padding: "2.5rem", color: "#64748b" }}>
                        <div style={{
                            width: 32, height: 32, margin: "0 auto 0.75rem",
                            border: "3px solid #e2e8f0", borderTopColor: "#2563eb",
                            borderRadius: "50%", animation: "spin 0.8s linear infinite",
                        }} />
                        Loading notifications…
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#94a3b8" }}>
                        <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>
                            {filter === "unread" ? "🎉" : "📭"}
                        </div>
                        <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                            {filter === "unread" ? "No unread notifications!" : "No notifications yet."}
                        </p>
                        {filter !== "all" && (
                            <button onClick={() => setFilter("all")} style={{
                                marginTop: "0.75rem", background: "none", border: "none",
                                color: "#2563eb", fontWeight: 600, cursor: "pointer", fontSize: "0.85rem",
                            }}>
                                Show all →
                            </button>
                        )}
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                        {filtered.map(notif => (
                            <NotifItem
                                key={notif.id}
                                notif={notif}
                                onMarkRead={handleMarkRead}
                                busy={busyId === notif.id}
                            />
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeInDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
}