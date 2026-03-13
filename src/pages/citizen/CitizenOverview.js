import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import "../../styles/dashboard.css";
import { getOverview } from "../../services/citizenService";

function CitizenOverview() {
    const [overview, setOverview] = useState({
        lifetimeSubmitted: 0,
        resolved: 0,
        open: 0,
        avgResolutionDays: 0,
        topCategories: [],
        monthlyTrend: [],
    });
    const [error, setError] = useState("");

    useEffect(() => {
        const loadOverview = async () => {
            try {
                const data = await getOverview();
                setOverview({
                    lifetimeSubmitted: data.lifetimeSubmitted || 0,
                    resolved: data.resolved || 0,
                    open: data.open || 0,
                    avgResolutionDays: data.avgResolutionDays || 0,
                    topCategories: data.topCategories || [],
                    monthlyTrend: data.monthlyTrend || [],
                });
            } catch (err) {
                setError(err.response?.data?.error || "Unable to load overview");
            }
        };

        loadOverview();
    }, []);

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
                <Link to="/citizen/submit" className="citizen-v2-primary-btn"><Plus size={16} /> New Complaint</Link>
            </section>

            {error ? <p className="subtitle">{error}</p> : null}

            <section className="overview-stat-grid">
                {stats.map((stat) => (
                    <article key={stat.label} className="citizen-v2-card stat">
                        <p>{stat.label}</p>
                        <h3>{stat.value}</h3>
                    </article>
                ))}
            </section>

            <section className="overview-panels">
                <article className="citizen-v2-card">
                    <div className="citizen-v2-card-head"><h3>Your Top Categories</h3></div>
                    <div className="chart-placeholder">
                        {overview.topCategories.length === 0
                            ? "No category trend data yet."
                            : overview.topCategories.map((category) => `${category.name} ${category.count}`).join(" | ")}
                    </div>
                </article>

                <article className="citizen-v2-card">
                    <div className="citizen-v2-card-head"><h3>Activity Trend (Last 6 Months)</h3></div>
                    <div className="chart-placeholder">
                        {overview.monthlyTrend.length === 0
                            ? "No monthly trend data yet."
                            : overview.monthlyTrend.map((item) => `${item.month} ${item.count}`).join(" | ")}
                    </div>
                </article>

                <article className="citizen-v2-card">
                    <div className="citizen-v2-card-head"><h3>Badges & Achievements</h3></div>
                    <div className="badge-row">
                        <span>Eco Warrior</span>
                        <span>Top Reporter Q4</span>
                        <span>Fast Responder</span>
                    </div>
                </article>
            </section>
        </div>
    );
}

export default CitizenOverview;
