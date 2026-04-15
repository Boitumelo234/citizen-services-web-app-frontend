import { useEffect, useState } from "react";
import { getNotifications, markAllNotificationsRead, markNotificationRead } from "../../services/citizenService";

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [busyId, setBusyId] = useState(null);

    const loadNotifications = async () => {
        try {
            const data = await getNotifications();
            setNotifications(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.response?.data?.error || "Unable to load notifications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const formatDate = (value) => {
        if (!value) return "";
        return new Date(value).toLocaleString("en-ZA", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleMarkRead = async (id) => {
        setBusyId(id);
        try {
            await markNotificationRead(id);
            setNotifications((current) => current.map((item) => (
                item.id === id ? { ...item, read: true } : item
            )));
        } catch (err) {
            setError(err.response?.data?.error || "Unable to mark notification as read");
        } finally {
            setBusyId(null);
        }
    };

    const handleMarkAll = async () => {
        setBusyId("all");
        try {
            await markAllNotificationsRead();
            setNotifications((current) => current.map((item) => ({ ...item, read: true })));
        } catch (err) {
            setError(err.response?.data?.error || "Unable to mark all notifications as read");
        } finally {
            setBusyId(null);
        }
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Notifications</h1>
            <p className="subtitle">Updates on your complaints and municipal alerts</p>

            {error ? <p className="subtitle" style={{ color: "#dc2626" }}>{error}</p> : null}

            <div className="card mt-8">
                <div className="p-6 pt-8">
                    {notifications.length > 0 ? (
                        <button
                            className="btn-outline text-sm px-4 py-2"
                            type="button"
                            onClick={handleMarkAll}
                            disabled={busyId === "all"}
                        >
                            {busyId === "all" ? "Updating..." : "Mark all as read"}
                        </button>
                    ) : null}
                    {loading ? (
                        <p className="text-center text-[var(--text-medium)] py-12">
                            Loading notifications...
                        </p>
                    ) : notifications.length === 0 ? (
                        <p className="text-center text-[var(--text-medium)] py-12">
                            No new notifications at the moment.
                        </p>
                    ) : (
                        <div className="space-y-5">
                            {notifications.map((notif) => (
                                <div key={notif.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                                    <div className={`notif-dot ${notif.type === "success" ? "bg-[var(--success)]" : "bg-[var(--primary)]"}`} />
                                    <div>
                                        <p className="text-sm font-semibold">{notif.title}</p>
                                        <p className="text-[var(--text-dark)]">{notif.message}</p>
                                        <p className="text-xs text-[var(--text-light)] mt-1">{formatDate(notif.createdAt)}</p>
                                        {!notif.read ? (
                                            <button
                                                className="btn-outline text-sm px-4 py-2 mt-3"
                                                type="button"
                                                onClick={() => handleMarkRead(notif.id)}
                                                disabled={busyId === notif.id}
                                            >
                                                {busyId === notif.id ? "Updating..." : "Mark as read"}
                                            </button>
                                        ) : null}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Notifications;
