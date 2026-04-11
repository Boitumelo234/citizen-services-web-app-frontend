import { Link } from "react-router-dom";

function CitizenDashboard() {
    const dashboard = {
        citizenName: "Citizen",
        totalComplaints: 5,
        resolvedThisMonth: 2,
        unreadNotifications: 0,
        categories: [
            { name: "Infrastructure & Roads", count: 2 },
            { name: "Water & Sanitation", count: 2 },
            { name: "Electricity & Energy", count: 1 },
        ],
        recentComplaints: [
            { id: "RUST-7841", title: "Large pothole near Shoprite", category: "Infrastructure & Roads", status: "In Progress", date: "20 Feb 2026" },
            { id: "RUST-7832", title: "Burst pipe in ward 12", category: "Water & Sanitation", status: "Resolved", date: "18 Feb 2026" },
            { id: "RUST-7829", title: "Streetlight outage", category: "Electricity & Energy", status: "Pending", date: "15 Feb 2026" },
        ],
    };

    return (
        <div className="citizen-page">
            <section className="citizen-page-header">
                <div>
                    <h1>Welcome back, {dashboard.citizenName}</h1>
                    <p>Rustenburg Local Municipality service dashboard</p>
                </div>
                <Link to="/citizen/submit" className="citizen-chip">
                    New Complaint
                </Link>
            </section>

            <section className="citizen-grid-two">
                <article className="citizen-panel soft citizen-hero">
                    <span className="eyebrow">Total complaints submitted</span>
                    <span className="metric">{dashboard.totalComplaints}</span>
                    <span className="citizen-muted">
                        {dashboard.resolvedThisMonth} resolved this month across {dashboard.categories.length} service areas
                    </span>
                </article>

                <article className="citizen-panel soft citizen-insight">
                    <div className="citizen-panel-head">
                        <h3>Service Snapshot</h3>
                        <span className="citizen-pill">{dashboard.unreadNotifications} alerts</span>
                    </div>
                    <p>
                        Use the dashboard to track active complaints, jump to reporting, and review where most of your submissions fall.
                    </p>
                    <div className="citizen-insight-orb" aria-hidden="true" />
                </article>
            </section>

            <section className="citizen-main-grid">
                <div className="citizen-stack">
                    <article className="citizen-panel soft">
                        <div className="citizen-panel-head">
                            <h3>Quick Actions</h3>
                        </div>
                        <div className="citizen-quick-actions">
                            <Link to="/citizen/submit">Submit Complaint</Link>
                            <Link to="/citizen/my-complaints">Track Complaints</Link>
                            <Link to="/citizen/map">Open Map</Link>
                            <Link to="/citizen/profile">View Profile</Link>
                        </div>
                    </article>

                    <article className="citizen-panel soft">
                        <div className="citizen-panel-head">
                            <h3>Department Categories</h3>
                        </div>
                        <div className="citizen-list">
                            {dashboard.categories.map((category) => (
                                <div key={category.name} className="citizen-list-item">
                                    <div>
                                        <strong>{category.name}</strong>
                                    </div>
                                    <span className="citizen-pill">{category.count}</span>
                                </div>
                            ))}
                        </div>
                    </article>
                </div>

                <article className="citizen-panel soft">
                    <div className="citizen-panel-head">
                        <h3>Recent Activity</h3>
                        <Link to="/citizen/my-complaints" className="citizen-muted">
                            See all
                        </Link>
                    </div>
                    <div className="citizen-list">
                        {dashboard.recentComplaints.map((complaint) => (
                            <div key={complaint.id} className="citizen-list-item">
                                <div>
                                    <strong>{complaint.title}</strong>
                                    <br />
                                    <small>{complaint.category} - {complaint.date}</small>
                                </div>
                                <span className={`status ${complaint.status.toLowerCase().replace(/\s+/g, "-")}`}>
                                    {complaint.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </article>
            </section>
        </div>
    );
}

export default CitizenDashboard;
