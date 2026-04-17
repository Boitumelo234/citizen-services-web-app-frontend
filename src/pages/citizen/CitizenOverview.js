import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import "../../styles/dashboard.css";
import { getMyComplaints, getOverview } from "../../services/citizenService";

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

const achievementBadges = [
    {
        label: "Eco Warrior",
        icon: "https://em-content.zobj.net/source/apple/391/deciduous-tree_1f333.png",
        background: "linear-gradient(135deg, #4ade80, #16a34a)",
    },
    {
        label: "Top Reporter Q4",
        icon: "https://em-content.zobj.net/source/apple/391/trophy_1f3c6.png",
        background: "linear-gradient(135deg, #facc15, #f59e0b)",
    },
    {
        label: "Fast Responder",
        icon: "https://em-content.zobj.net/source/apple/391/rocket_1f680.png",
        background: "linear-gradient(135deg, #60a5fa, #2563eb)",
    },
];

function getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(month, year) {
    return new Date(year, month, 1).getDay();
}

function formatMonthLabel(date) {
    return date.toLocaleString("en-US", { month: "short" }).toUpperCase();
}

function buildTrendMonthsFromComplaints(complaints) {
    const now = new Date();
    const monthFrames = Array.from({ length: 3 }, (_, index) => {
        const date = new Date(now.getFullYear(), now.getMonth() - (2 - index), 1);
        return {
            label: formatMonthLabel(date),
            month: date.getMonth(),
            year: date.getFullYear(),
            activityDays: {},
        };
    });

    complaints.forEach((complaint) => {
        if (!complaint?.createdAt) return;

        const createdDate = new Date(complaint.createdAt);
        if (Number.isNaN(createdDate.getTime())) return;

        const monthEntry = monthFrames.find((frame) =>
            frame.month === createdDate.getMonth() && frame.year === createdDate.getFullYear()
        );

        if (!monthEntry) return;

        const day = createdDate.getDate();
        if (!monthEntry.activityDays[day]) {
            monthEntry.activityDays[day] = { total: 0, unresolved: 0 };
        }

        monthEntry.activityDays[day].total += 1;
        if (String(complaint.status || "").toLowerCase() !== "resolved") {
            monthEntry.activityDays[day].unresolved += 1;
        }
    });

    return monthFrames.map((frame) => ({
        ...frame,
        count: Object.keys(frame.activityDays).length,
    }));
}

function CitizenOverview() {
    const [overview, setOverview] = useState({
        lifetimeSubmitted: 0,
        resolved: 0,
        open: 0,
        avgResolutionDays: 0,
        topCategories: [],
        monthlyTrend: [],
    });
    const [trendMonths, setTrendMonths] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadOverview = async () => {
            try {
                const [data, complaints] = await Promise.all([getOverview(), getMyComplaints()]);
                setOverview({
                    lifetimeSubmitted: data.lifetimeSubmitted || 0,
                    resolved: data.resolved || 0,
                    open: data.open || 0,
                    avgResolutionDays: data.avgResolutionDays || 0,
                    topCategories: Array.isArray(data.topCategories) ? data.topCategories : [],
                    monthlyTrend: Array.isArray(data.monthlyTrend) ? data.monthlyTrend : [],
                });
                setTrendMonths(buildTrendMonthsFromComplaints(Array.isArray(complaints) ? complaints : []));
            } catch (err) {
                setError(err.response?.data?.error || "Unable to load overview");
            }
        };

        loadOverview();
    }, []);

    const getSticker = (category) => stickerConfig[category] || stickerConfig.Other;

    const stats = [
        { label: "Lifetime Submitted", value: overview.lifetimeSubmitted },
        { label: "Resolved", value: overview.resolved },
        { label: "Still Open", value: overview.open },
        { label: "Avg Resolution", value: `${overview.avgResolutionDays} days` },
    ];

    return (
        <div className="citizen-v2-page">
            <section className="citizen-v2-header enhanced">
                <div>
                    <h1>Overview</h1>
                    <p>Your activity and impact across municipal services</p>
                </div>
                <Link to="/citizen/submit" className="citizen-v2-primary-btn my-complaints-header-btn"><Plus size={16} /> New Complaint</Link>
            </section>

            {error ? <p className="subtitle" style={{ color: "#dc2626" }}>{error}</p> : null}

            <section className="overview-stat-grid">
                {stats.map((stat) => (
                    <article key={stat.label} className="citizen-v2-card stat overview-v2-stat">
                        <p className="overview-v2-label">{stat.label}</p>
                        <h3 className="overview-v2-value">{stat.value}</h3>
                    </article>
                ))}
            </section>

            <section className="overview-panels">
                <article className="citizen-v2-card overview-v2-panel">
                    <div className="citizen-v2-card-head"><h3>Your Top Categories</h3></div>
                    <div className="overview-v2-content-block">
                        {overview.topCategories.length === 0
                            ? "No category trend data yet."
                            : (
                                <div className="overview-v2-category-list">
                                    {overview.topCategories.map((category) => {
                                        const sticker = getSticker(category.name);
                                        return (
                                            <div key={category.name} className="overview-v2-category-item">
                                                <div
                                                    className="overview-v2-category-sticker"
                                                    style={{ background: sticker.background }}
                                                >
                                                    <img
                                                        src={sticker.icon}
                                                        alt={category.name}
                                                        className="overview-v2-category-sticker-icon"
                                                    />
                                                </div>
                                                <span>{category.name}</span>
                                                <strong>{category.count}</strong>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                    </div>
                </article>

                <article className="citizen-v2-card overview-v2-panel">
                    <div className="citizen-v2-card-head"><h3>Activity Trend (Last 3 Months)</h3></div>
                    {trendMonths.length === 0 ? (
                        <div className="overview-v2-content-block">No monthly trend data yet.</div>
                    ) : (
                        <div className="overview-v2-trend-card">
                            <div className="overview-v2-trend-top">
                                <span>Total</span>
                                <strong>{trendMonths.reduce((sum, item) => sum + item.count, 0)} activities</strong>
                            </div>
                            <div className="overview-v2-mini-calendars">
                                {trendMonths.map((item) => {
                                    const daysInMonth = getDaysInMonth(item.month, item.year);
                                    const firstDay = getFirstDayOfMonth(item.month, item.year);
                                    const activityDays = item.activityDays || {};
                                    const calendarDays = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

                                    return (
                                        <div key={`${item.label}-${item.year}`} className="overview-v2-mini-calendar">
                                            <div className="overview-v2-mini-calendar-head">
                                                <span>{item.label}</span>
                                                {item.count > 0 ? <strong>{Object.keys(activityDays).length} days</strong> : null}
                                            </div>
                                            <div className="overview-v2-mini-calendar-weekdays">
                                                {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                                                    <span key={`${item.label}-${day}`}>{day}</span>
                                                ))}
                                            </div>
                                            <div className="overview-v2-mini-calendar-days">
                                                {calendarDays.map((day, idx) => (
                                                    day === null ? (
                                                        <span key={`${item.label}-empty-${idx}`} className="overview-v2-mini-day empty" />
                                                    ) : (
                                                        <span key={`${item.label}-${day}`} className="overview-v2-mini-day-wrap">
                                                            {activityDays[day]?.unresolved > 0 ? (
                                                                <span className="overview-v2-mini-day-badge">{activityDays[day].unresolved}</span>
                                                            ) : null}
                                                            <span
                                                                className={`overview-v2-mini-day ${activityDays[day] ? "active" : ""}`}
                                                            >
                                                                {day}
                                                            </span>
                                                        </span>
                                                    )
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="overview-v2-trend-legend">
                                <span><i className="activity" /> Activity day</span>
                                <span><i className="unresolved" /> Unresolved</span>
                                <span><i className="none" /> No activity</span>
                            </div>
                        </div>
                    )}
                </article>

                <article className="citizen-v2-card overview-v2-panel">
                    <div className="citizen-v2-card-head"><h3>Badges & Achievements</h3></div>
                    <div className="badge-row overview-v2-badge-row">
                        {achievementBadges.map((badge) => (
                            <span key={badge.label} className="overview-v2-achievement-badge">
                                <span
                                    className="overview-v2-achievement-sticker"
                                    style={{ background: badge.background }}
                                >
                                    <img
                                        src={badge.icon}
                                        alt={badge.label}
                                        className="overview-v2-achievement-sticker-icon"
                                    />
                                </span>
                                {badge.label}
                            </span>
                        ))}
                    </div>
                </article>
            </section>
        </div>
    );
}

export default CitizenOverview;
