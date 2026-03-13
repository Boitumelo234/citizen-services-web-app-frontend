import { useEffect, useState } from "react";
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
import { getDashboard } from "../../services/citizenService";

const iconMap = {
    "Infrastructure & Roads": { icon: AlertTriangle, iconClass: "cat-orange" },
    "Water & Sanitation": { icon: Droplets, iconClass: "cat-blue" },
    "Electricity & Energy": { icon: Zap, iconClass: "cat-yellow" },
};

const defaultIcon = { icon: AlertTriangle, iconClass: "cat-orange" };

function CitizenDashboard() {
    const [dashboard, setDashboard] = useState({
        citizenName: "Citizen",
        totalComplaints: 0,
        resolvedThisMonth: 0,
        unreadNotifications: 0,
        categories: [],
        recentComplaints: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const data = await getDashboard();
                setDashboard({
                    citizenName: data.citizenName || "Citizen",
                    totalComplaints: data.totalComplaints || 0,
                    resolvedThisMonth: data.resolvedThisMonth || 0,
                    unreadNotifications: data.unreadNotifications || 0,
                    categories: data.categories || [],
                    recentComplaints: data.recentComplaints || [],
                });
            } catch (err) {
                setError(err.response?.data?.error || "Unable to load dashboard");
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

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
                    <button className="notif-btn" aria-label="Notifications">
                        <Bell size={18} />
                        {dashboard.unreadNotifications > 0 ? <span></span> : null}
                    </button>
                    <Link to="/citizen/submit" className="citizen-v2-primary-btn">
                        <Plus size={16} /> New Complaint
                    </Link>
                </div>
            </section>

            {error ? <p className="subtitle">{error}</p> : null}

            <section className="citizen-v2-grid-two">
                <article className="citizen-v2-card hero-card">
                    <p className="muted">Total Complaints <Eye size={14} /></p>
                    <h2>{loading ? "..." : dashboard.totalComplaints}</h2>
                    <small>Across {complaintCategories.length || 0} departments</small>
                </article>
                <article className="citizen-v2-card insight-card">
                    <p className="muted badge"><Sparkles size={16} /> Smart Insights</p>
                    <p className="insight-copy">
                        {loading
                            ? "Loading your latest stats."
                            : `${dashboard.resolvedThisMonth} complaints have been resolved this month.`}
                    </p>
                    <div className="insight-globe" aria-hidden="true">Globe</div>
                </article>
            </section>

            <section className="citizen-v2-main-grid">
                <div className="left-col">
                    <article className="citizen-v2-card">
                        <div className="citizen-v2-card-head">
                            <h3>Quick actions</h3>
                            <button>See more</button>
                        </div>
                        <div className="quick-actions rich">
                            <button><Search size={20} /> <span>Track</span></button>
                            <button><Plus size={20} /> <span>New Fault</span></button>
                            <button><Navigation size={20} /> <span>Map</span></button>
                            <button><Sparkles size={20} /> <span>AI Assist</span></button>
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
                <button className="active"><MapIcon size={18} /><span>Home</span></button>
                <button><Search size={18} /><span>Records</span></button>
                <button className="primary"><Plus size={20} /></button>
                <button><Navigation size={18} /><span>Map</span></button>
                <button><Bell size={18} /><span>Alerts</span></button>
            </div>
        </div>
    );
}

export default CitizenDashboard;
