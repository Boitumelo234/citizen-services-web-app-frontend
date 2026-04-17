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
import { askGroqCitizenAssist } from "../../services/groqService";

const iconMap = {
    "Infrastructure & Roads": { icon: AlertTriangle, iconClass: "cat-orange" },
    "Water & Sanitation": { icon: Droplets, iconClass: "cat-blue" },
    "Electricity & Energy": { icon: Zap, iconClass: "cat-yellow" },
};

const defaultIcon = { icon: AlertTriangle, iconClass: "cat-orange" };

const stickerConfig = {
    "Infrastructure & Roads": {
        icon: "https://em-content.zobj.net/source/apple/391/construction_1f6a7.png",
        background: "linear-gradient(135deg, #fb923c, #ef4444)",
    },
    "Power Outage": {
        icon: "https://em-content.zobj.net/source/apple/391/high-voltage_26a1.png",
        background: "linear-gradient(135deg, #facc15, #f97316)",
    },
    "Water & Sanitation": {
        icon: "https://em-content.zobj.net/source/apple/391/potable-water_1f6b0.png",
        background: "linear-gradient(135deg, #38bdf8, #2563eb)",
    },
    "Electricity & Energy": {
        icon: "https://em-content.zobj.net/source/apple/391/electric-plug_1f50c.png",
        background: "linear-gradient(135deg, #facc15, #eab308)",
    },
    "Illegal Dumping": {
        icon: "https://em-content.zobj.net/source/apple/391/wastebasket_1f5d1-fe0f.png",
        background: "linear-gradient(135deg, #14b8a6, #0f766e)",
    },
    Other: {
        icon: "https://em-content.zobj.net/source/apple/391/clipboard_1f4cb.png",
        background: "linear-gradient(135deg, #a78bfa, #6366f1)",
    },
};

function CitizenDashboard() {
    const [dashboard, setDashboard] = useState({
        citizenName: "Citizen",
        totalComplaints: 0,
        resolvedThisMonth: 0,
        unreadNotifications: 0,
        categories: [],
        recentComplaints: [],
    });
    const [error, setError] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
    const [aiModalOpen, setAiModalOpen] = useState(false);
    const [aiPrompt, setAiPrompt] = useState("");
    const [aiReply, setAiReply] = useState("");
    const [aiError, setAiError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const data = await getDashboard();
                setDashboard({
                    citizenName: data.citizenName || "Citizen",
                    totalComplaints: data.totalComplaints || 0,
                    resolvedThisMonth: data.resolvedThisMonth || 0,
                    unreadNotifications: data.unreadNotifications || 0,
                    categories: Array.isArray(data.categories) ? data.categories : [],
                    recentComplaints: Array.isArray(data.recentComplaints) ? data.recentComplaints : [],
                });
            } catch (err) {
                setError(err.response?.data?.error || "Unable to load dashboard");
            }
        };

        loadDashboard();
    }, []);

    const getSticker = (category) => stickerConfig[category] || stickerConfig.Other;

    const handleAiAssist = () => {
        setAiModalOpen(true);
        setAiError("");
        setAiReply("");
    };

    const handleAiAssistSubmit = async () => {
        if (!aiPrompt.trim()) {
            setAiError("Enter a question for AI Assist.");
            return;
        }

        try {
            setAiLoading(true);
            setAiError("");
            const reply = await askGroqCitizenAssist(aiPrompt, dashboard);
            setAiReply(reply);
        } catch (err) {
            setAiError(err.message || "AI Assist failed.");
        } finally {
            setAiLoading(false);
        }
    };

    const closeAiModal = () => {
        if (aiLoading) {
            return;
        }
        setAiModalOpen(false);
        setAiPrompt("");
        setAiReply("");
        setAiError("");
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

            {error ? <p className="subtitle" style={{ color: "#dc2626" }}>{error}</p> : null}

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
                            <button type="button" onClick={handleAiAssist} disabled={aiLoading}>
                                <Sparkles size={20} /> <span>{aiLoading ? "Thinking..." : "AI Assist"}</span>
                            </button>
                        </div>
                    </article>

                    <article className="citizen-v2-card">
                        <div className="citizen-v2-card-head">
                            <h3>Department Categories</h3>
                        </div>
                        <div className="category-list">
                            {complaintCategories.length === 0 ? <p className="subtitle">No category data yet.</p> : null}
                            {complaintCategories.map((cat) => {
                                const sticker = getSticker(cat.name);
                                return (
                                    <div key={cat.name} className="category-item">
                                        <div className="category-left">
                                            <div
                                                className="dashboard-sticker"
                                                style={{ background: sticker.background }}
                                            >
                                                <img
                                                    src={sticker.icon}
                                                    alt={cat.name}
                                                    className="dashboard-sticker-icon"
                                                />
                                            </div>
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
                            const sticker = getSticker(complaint.category);
                            return (
                                <div key={complaint.id} className="activity-item">
                                    <div className="activity-left">
                                        <div
                                            className="dashboard-sticker dashboard-sticker-small"
                                            style={{ background: sticker.background }}
                                        >
                                            <img
                                                src={sticker.icon}
                                                alt={complaint.category}
                                                className="dashboard-sticker-icon dashboard-sticker-icon-small"
                                            />
                                        </div>
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

            {aiModalOpen ? (
                <div className="citizen-ai-modal-backdrop" onClick={closeAiModal}>
                    <div className="citizen-v2-card citizen-ai-modal" onClick={(event) => event.stopPropagation()}>
                        <div className="citizen-v2-card-head">
                            <h3>AI Assist</h3>
                            <button type="button" onClick={closeAiModal} disabled={aiLoading}>Close</button>
                        </div>
                        <p className="subtitle citizen-ai-modal-subtitle">
                            Ask about your dashboard, complaints, categories, or next steps.
                        </p>
                        <label className="citizen-ai-modal-field">
                            <span>Your question</span>
                            <textarea
                                value={aiPrompt}
                                onChange={(event) => setAiPrompt(event.target.value)}
                                placeholder="Ask AI Assist anything about your citizen dashboard"
                                rows={5}
                                disabled={aiLoading}
                            />
                        </label>
                        {aiError ? <p className="citizen-ai-modal-message citizen-ai-modal-error">{aiError}</p> : null}
                        {aiReply ? (
                            <div className="citizen-ai-modal-reply">
                                <strong>Reply</strong>
                                <p>{aiReply}</p>
                            </div>
                        ) : null}
                        <div className="citizen-ai-modal-actions">
                            <button type="button" className="my-complaint-secondary-btn" onClick={closeAiModal} disabled={aiLoading}>
                                Cancel
                            </button>
                            <button type="button" className="citizen-v2-primary-btn" onClick={handleAiAssistSubmit} disabled={aiLoading}>
                                <Sparkles size={16} /> {aiLoading ? "Thinking..." : "Ask AI Assist"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default CitizenDashboard;

