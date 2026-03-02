import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import "../../styles/dashboard.css";

function CitizenOverview() {
    const stats = [
        { label: "Lifetime Submitted", value: 38 },
        { label: "Resolved", value: 31 },
        { label: "Still Open", value: 7 },
        { label: "Avg Resolution", value: "4.1 days" },
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
                    <div className="chart-placeholder">Roads 45% | Water 28% | Electricity 17% | Others 10%</div>
                </article>

                <article className="citizen-v2-card">
                    <div className="citizen-v2-card-head"><h3>Activity Trend (Last 6 Months)</h3></div>
                    <div className="chart-placeholder">Submissions vs resolved trend chart area</div>
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
