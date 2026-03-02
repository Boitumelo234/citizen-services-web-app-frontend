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

function CitizenDashboard() {
    const complaintCategories = [
        { name: "Infrastructure & Roads", count: 8, icon: AlertTriangle, iconClass: "cat-orange" },
        { name: "Water & Sanitation", count: 4, icon: Droplets, iconClass: "cat-blue" },
        { name: "Electricity & Energy", count: 3, icon: Zap, iconClass: "cat-yellow" },
    ];

    const recentComplaints = [
        { id: "RUST-7841", title: "Large pothole on Nelson Mandela Dr", category: "Infrastructure", date: "Feb 20", status: "In Progress", icon: AlertTriangle, iconClass: "cat-orange" },
        { id: "RUST-7832", title: "Burst pipe outside house", category: "Water", date: "Feb 18", status: "Resolved", icon: Droplets, iconClass: "cat-blue" },
        { id: "RUST-7829", title: "Streetlight completely off", category: "Electricity", date: "Feb 15", status: "Pending", icon: Zap, iconClass: "cat-yellow" },
        { id: "RUST-7825", title: "Traffic light out of order", category: "Infrastructure", date: "Feb 12", status: "Resolved", icon: AlertTriangle, iconClass: "cat-orange" },
    ];

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
                        <h1>Welcome back, Citizen</h1>
                        <p>Rustenburg Local Municipality Service Platform</p>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="notif-btn" aria-label="Notifications">
                        <Bell size={18} />
                        <span></span>
                    </button>
                    <Link to="/citizen/submit" className="citizen-v2-primary-btn">
                        <Plus size={16} /> New Complaint
                    </Link>
                </div>
            </section>

            <section className="citizen-v2-grid-two">
                <article className="citizen-v2-card hero-card">
                    <p className="muted">Total Complaints <Eye size={14} /></p>
                    <h2>15</h2>
                    <small>Across 4 departments</small>
                </article>
                <article className="citizen-v2-card insight-card">
                    <p className="muted badge"><Sparkles size={16} /> Smart Insights</p>
                    <p className="insight-copy">
                        11 complaints have been resolved this month. You're helping make Rustenburg a better place!
                    </p>
                    <div className="insight-globe" aria-hidden="true">🌍</div>
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
                        {recentComplaints.map((complaint) => {
                            const Icon = complaint.icon;
                            return (
                                <div key={complaint.id} className="activity-item">
                                    <div className="activity-left">
                                        <div className={`cat-icon ${complaint.iconClass}`}><Icon size={18} /></div>
                                        <div>
                                            <h4>{complaint.title}</h4>
                                            <p>{complaint.category}</p>
                                            <small>{complaint.date}</small>
                                        </div>
                                    </div>
                                    <span className={`status ${complaint.status.toLowerCase().replace(" ", "-")}`}>
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
