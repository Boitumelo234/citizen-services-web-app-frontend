import { useState } from "react";
import { Link } from "react-router-dom";
import '../../styles/dashboard.css';

function CitizenDashboard() {
    const [notifications] = useState([
        { id: 1, message: "Your pothole report #RUST-7841 is now In Progress", time: "2h ago", type: "success" },
        { id: 2, message: "Roads department assigned technician to your water leak", time: "Yesterday", type: "info" },
    ]);

    const myComplaints = [
        { id: "RUST-7841", date: "2026-02-20", category: "Infrastructure & Roads", desc: "Large pothole on Nelson Mandela Drive", status: "In Progress" },
        { id: "RUST-7832", date: "2026-02-18", category: "Water & Sanitation", desc: "Burst pipe outside house", status: "Resolved" },
        { id: "RUST-7829", date: "2026-02-15", category: "Electricity & Energy", desc: "Streetlight not working", status: "Pending" },
    ];

    const quickCategories = [
        "Pothole", "Water Leak", "Power Outage", "Illegal Dumping",
        "Streetlight Fault", "Sewer Overflow", "Missed Refuse"
    ];

    return (
        <div className="dashboard-root">
            <div className="dashboard-container">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="dashboard-title">Welcome back, Citizen 👋</h1>
                        <p className="subtitle">Rustenburg Local Municipality Citizen Services Platform</p>
                    </div>
                    <Link to="/citizen/submit" className="btn-primary flex items-center gap-2">
                        + New Complaint
                    </Link>
                </div>
<br />
                {/* KPI Stats */}
                <div className="overview-cards">
                    <div className="card stat-card">
                        <p className="stat-label">Total Submitted</p>
                        <p className="stat-value" style={{ color: "var(--primary)" }}>15</p>
                    </div>
                    <div className="card stat-card">
                        <p className="stat-label">Pending</p>
                        <p className="stat-value" style={{ color: "var(--warning)" }}>4</p>
                    </div>
                    <div className="card stat-card">
                        <p className="stat-label">Resolved</p>
                        <p className="stat-value" style={{ color: "var(--success)" }}>11</p>
                    </div>
                    <div className="card stat-card">
                        <p className="stat-label">Avg Response</p>
                        <p className="stat-value" style={{ color: "var(--info)" }}>2.8 days</p>
                    </div>
                </div>
<br />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* My Recent Complaints */}
                    <div className="card lg:col-span-2">
                        <div className="p-6">
                            <br />
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="section-title">My Recent Complaints</h2>
                                <Link to="/citizen/my-complaints" className="text-[var(--primary)] hover:underline">View all →</Link>
                            </div>
                            <div className="space-y-4">
                                {myComplaints.map(comp => (
                                    <div
                                        key={comp.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                                    >
                                        <div>
                                            <div className="font-medium">{comp.id} — {comp.category}</div>
                                            <div className="text-sm text-[var(--text-medium)] line-clamp-1">{comp.desc}</div>
                                            <div className="text-xs text-[var(--text-light)] mt-1">{comp.date}</div>
                                        </div>
                                        <span className={`status-badge status-${comp.status.toLowerCase().replace(' ', '')}`}>
                      {comp.status}
                    </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <br />
                    </div>
<br />
                    {/* Notifications + Quick Categories */}
                    <div className="space-y-6">
                        {/* Notifications */}
                        <div className="card">
                            <br />
                            <div className="p-6">
                                <h3 className="card-title">🛎️ Notifications</h3>
                                <div className="space-y-3 text-sm mt-4">
                                    {notifications.map(notif => (
                                        <div key={notif.id} className="flex gap-3">
                                            <div
                                                className={`notif-dot ${notif.type === "success" ? "bg-[var(--success)]" : "bg-[var(--primary)]"}`}
                                            />
                                            <div>
                                                <p className="text-[var(--text-dark)]">{notif.message}</p>
                                                <p className="text-xs text-[var(--text-light)] mt-1">{notif.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Link
                                    to="/citizen/notifications"
                                    className="text-[var(--primary)] text-sm mt-4 block hover:underline"
                                >
                                    All notifications →
                                </Link>
                            </div>
                            <br />
                        </div>
<br />
                        {/* Quick Submit Categories */}
                        <div className="card">
                            <div className="p-6">
                                <br />
                                <h3 className="card-title">Quick Report</h3>
                                <div className="grid grid-cols-2 gap-3 mt-4">
                                    {quickCategories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => alert(`Opening submit form for: ${cat}`)}
                                            className="quick-btn"
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                                <br />
                            </div>
                        </div>
                    </div>
                </div>
<br />
                {/* Map Preview */}
                <div className="card mt-8">
                    <div className="p-6">
                        <br />
                        <div className="flex justify-between mb-4">
                            <h3 className="card-title">Live Complaints Near You</h3>
                            <Link to="/citizen/map" className="text-[var(--primary)] hover:underline">
                                Open Full Map →
                            </Link>
                        </div>
                        <div className="map-placeholder">
                            📍 Interactive Leaflet/Google Map with pins (GPS tagged complaints)
                        </div>
                        <br />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CitizenDashboard;