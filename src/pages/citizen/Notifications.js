function Notifications() {
    const notifications = [];

    return (
        <div className="citizen-page">
            <section className="citizen-page-header">
                <div>
                    <h1>Notifications</h1>
                    <p>Updates on your complaints and important municipal alerts.</p>
                </div>
                <div className="citizen-chip">Inbox</div>
            </section>

            <div className="citizen-form-shell">
                {notifications.length === 0 ? (
                    <div className="citizen-empty">
                        <p>No new notifications at the moment.</p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {notifications.map((notification) => (
                            <div key={notification.id} className="citizen-notification-card">
                                <p className="text-sm font-semibold">{notification.title}</p>
                                <p className="text-[var(--text-dark)]">{notification.message}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Notifications;
