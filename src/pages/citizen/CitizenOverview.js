import { Link } from "react-router-dom";

function CitizenOverview() {
    const overview = {
        lifetimeSubmitted: 5,
        resolved: 2,
        open: 3,
        avgResolutionDays: 4,
        topCategories: [
            { name: "Infrastructure & Roads", count: 2 },
            { name: "Water & Sanitation", count: 2 },
            { name: "Electricity & Energy", count: 1 },
        ],
        monthlyTrend: [
            { month: "Sep", count: 1 },
            { month: "Oct", count: 0 },
            { month: "Nov", count: 1 },
            { month: "Dec", count: 1 },
            { month: "Jan", count: 1 },
            { month: "Feb", count: 1 },
        ],
    };

    const stats = [
        { label: "Lifetime Submitted", value: overview.lifetimeSubmitted },
        { label: "Resolved", value: overview.resolved },
        { label: "Still Open", value: overview.open },
        { label: "Avg Resolution", value: `${overview.avgResolutionDays} days` },
    ];

    return (
        <div className="citizen-page">
            <section className="citizen-page-header">
                <div>
                    <h1>Overview</h1>
                    <p>Your activity and service impact across municipal departments</p>
                </div>
                <Link to="/citizen/submit" className="citizen-chip">
                    New Complaint
                </Link>
            </section>

            <section className="citizen-overview-grid">
                {stats.map((stat) => (
                    <article key={stat.label} className="citizen-stat-card">
                        <p>{stat.label}</p>
                        <h3>{stat.value}</h3>
                    </article>
                ))}
            </section>

            <section className="citizen-two-column">
                <article className="citizen-panel soft">
                    <div className="citizen-panel-head">
                        <h3>Top Categories</h3>
                    </div>
                    <div className="citizen-list">
                        {overview.topCategories.map((category) => (
                            <div key={category.name} className="citizen-list-item">
                                <strong>{category.name}</strong>
                                <span className="citizen-pill">{category.count}</span>
                            </div>
                        ))}
                    </div>
                </article>

                <article className="citizen-panel soft">
                    <div className="citizen-panel-head">
                        <h3>Monthly Trend</h3>
                    </div>
                    <div className="citizen-list">
                        {overview.monthlyTrend.map((item) => (
                            <div key={item.month} className="citizen-list-item">
                                <strong>{item.month}</strong>
                                <span className="citizen-pill">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </article>
            </section>

            <section className="citizen-panel soft" style={{ marginTop: "1rem" }}>
                <div className="citizen-panel-head">
                    <h3>Badges and Achievements</h3>
                </div>
                <div className="citizen-badge-row">
                    <span>Consistent Reporter</span>
                    <span>Ward Watch</span>
                    <span>Service Champion</span>
                </div>
            </section>
        </div>
    );
}

export default CitizenOverview;
