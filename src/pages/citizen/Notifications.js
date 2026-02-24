// Notifications.jsx
import '../../styles/dashboard.css';

function Notifications() {
    // Mock data
    const notifications = [
        {
            id: 1,
            type: 'success',
            message: 'Your pothole report #RUST-7841 is now In Progress',
            time: '2 hours ago'
        },
        {
            id: 2,
            type: 'info',
            message: 'Water leak in Tlhabane area – technicians dispatched',
            time: 'Yesterday'
        }
    ];

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Notifications</h1>
            <p className="subtitle">Updates on your complaints and municipal alerts</p>

            <div className="card mt-8">
                <div className="p-6 pt-8">
                    {notifications.length === 0 ? (
                        <p className="text-center text-[var(--text-medium)] py-12">
                            No new notifications at the moment.
                        </p>
                    ) : (
                        <div className="space-y-5">
                            {notifications.map((notif) => (
                                <div key={notif.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                                    <div className={`notif-dot ${notif.type === 'success' ? 'bg-[var(--success)]' : 'bg-[var(--primary)]'}`} />
                                    <div>
                                        <p className="text-[var(--text-dark)]">{notif.message}</p>
                                        <p className="text-xs text-[var(--text-light)] mt-1">{notif.time}</p>
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