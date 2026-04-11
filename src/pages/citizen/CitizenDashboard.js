import { Link } from "react-router-dom";
import {
    AlertTriangle,
    Bell,
    Droplets,
    Eye,
    Map as MapIcon,
    Navigation,
    Plus,
    Search,
    Sparkles,
    Zap,
} from "lucide-react";
import "../../styles/dashboard.css";

const iconMap = {
    "Infrastructure & Roads": { icon: AlertTriangle, iconClass: "cat-orange" },
    "Water & Sanitation": { icon: Droplets, iconClass: "cat-blue" },
    "Electricity & Energy": { icon: Zap, iconClass: "cat-yellow" },
};

const defaultIcon = { icon: AlertTriangle, iconClass: "cat-orange" };

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

    const complaintCategories = dashboard.categories.map((category) => ({
        ...category,
        ...(iconMap[category.name] || defaultIcon),
    }));

    const recentComplaints = dashboard.recentComplaints.map((complaint) => ({
        ...complaint,
        ...(iconMap[complaint.category] || defaultIcon),
    }));

    return (
        <div className="citizen-v2-page">
            <section className="citizen-v2-header enhanced">
                <div className="welcome-block">
                    <div className="avatar-shell">
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=e2e8f0"
                            alt="Avatar"
                        />
                    </div>
                    <div>
                        <h1>Welcome back, {dashboard.citizenName}</h1>
                        <p>Rustenburg Local Municipality Service Platform</p>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="notif-btn" aria-label="Notifications" type="button">
                        <Bell size={18} />
                        {dashboard.unreadNotifications > 0 ? <span /> : null}
                    </button>
                    <Link to="/citizen/submit" className="citizen-v2-primary-btn">
                        <Plus size={16} /> New Complaint
                    </Link>
                </div>
            </section>

            <section className="citizen-v2-grid-two">
                <article className="citizen-v2-card hero-card">
                    <p className="muted">Total Complaints <Eye size={14} /></p>
                    <h2>{dashboard.totalComplaints}</h2>
                    <small>Across {complaintCategories.length || 0} departments</small>
                </article>
                <article className="citizen-v2-card insight-card">
                    <p className="muted badge"><Sparkles size={16} /> Smart Insights</p>
                    <p className="insight-copy">
                        {dashboard.resolvedThisMonth} complaints have been resolved this month.
                    </p>
                    <div className="insight-globe" aria-hidden="true">🌍</div>
                </article>
            </section>

            <section className="citizen-v2-main-grid">
                <div className="left-col">
                    <article className="citizen-v2-card">
                        <div className="citizen-v2-card-head">
                            <h3>Quick actions</h3>
                            <button type="button">See more</button>
                        </div>
                        <div className="quick-actions rich">
                            <Link to="/citizen/my-complaints"><Search size={20} /> <span>Track</span></Link>
                            <Link to="/citizen/submit"><Plus size={20} /> <span>New Fault</span></Link>
                            <Link to="/citizen/map"><Navigation size={20} /> <span>Map</span></Link>
                            <button type="button"><Sparkles size={20} /> <span>AI Assist</span></button>
                        </div>
                    </article>

                    <article className="citizen-v2-card">
                        <div className="citizen-v2-card-head">
                            <h3>Department Categories</h3>
                        </div>
                        <div className="category-list">
                            {complaintCategories.length === 0 ? <p className="subtitle">No category data yet.</p> : null}
                            {complaintCategories.map((cat) => {
                                const Icon = cat.icon;
                                return (
                                    <div key={cat.name} className="category-item">
                                        <div className="category-left">
                                            <div className={`cat-icon ${cat.iconClass}`}><Icon size={18} /></div>
                                            <span>{cat.name}</span>
                                        </div>
                                        <strong>{cat.count}</strong>
                                    </div>
                                );
                            })}
                        </div>
                    </article>
                </div>

                <article className="citizen-v2-card right-col">
                    <div className="citizen-v2-card-head">
                        <h3>Recent Activity</h3>
                        <Link to="/citizen/my-complaints">See all</Link>
                    </div>
                    <div className="activity-list">
                        {recentComplaints.length === 0 ? <p className="subtitle">No recent complaint activity yet.</p> : null}
                        {recentComplaints.map((complaint) => {
                            const Icon = complaint.icon;
                            return (
                                <div key={complaint.id} className="activity-item">
                                    <div className="activity-left">
                                        <div className={`cat-icon ${complaint.iconClass}`}><Icon size={18} /></div>
                                        <div>
                                            <h4>{complaint.title || complaint.id}</h4>
                                            <p>{complaint.category}</p>
                                            <small>{complaint.date}</small>
                                        </div>
                                    </div>
                                    <span className={`status ${String(complaint.status || "").toLowerCase().replace(" ", "-")}`}>
                                        {complaint.status}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </article>
            </section>

            <div className="citizen-mobile-nav">
                <button className="active" type="button"><MapIcon size={18} /><span>Home</span></button>
                <button type="button"><Search size={18} /><span>Records</span></button>
                <Link to="/citizen/submit" className="primary"><Plus size={20} /></Link>
                <button type="button"><Navigation size={18} /><span>Map</span></button>
                <button type="button"><Bell size={18} /><span>Alerts</span></button>
            </div>
        </div>
    );
}

export default CitizenDashboard;
