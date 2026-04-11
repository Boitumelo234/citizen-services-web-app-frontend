function Notifications() {
    const notifications = [];

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Notifications</h1>
            <p className="subtitle">Updates on your complaints and municipal alerts</p>

            <div className="card mt-8">
                <div className="p-6 pt-8">
                    {notifications.length > 0 ? (
                        <button className="btn-outline text-sm px-4 py-2" type="button">
                            Mark all as read
                        </button>
                    ) : null}
                    {notifications.length === 0 ? (
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
                                        <p className="text-xs text-[var(--text-light)] mt-1">{notif.createdAt}</p>
                                        {!notif.read ? (
                                            <button className="btn-outline text-sm px-4 py-2 mt-3" type="button">
                                                Mark as read
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
