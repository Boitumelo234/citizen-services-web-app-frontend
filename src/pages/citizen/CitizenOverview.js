import { Link } from 'react-router-dom';
import '../../styles/dashboard.css';

function CitizenOverview() {
    // Mock – real data from API
    const personalStats = {
        lifetimeSubmitted: 38,
        lifetimeResolved: 31,
        lifetimePending: 7,
        favoriteCategory: 'Roads & Infrastructure',
        avgDaysToResolve: 4.1,
        badges: ['Eco Warrior', 'Top Reporter Q4', 'Fast Responder']
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Your Overview</h1>
            <p className="subtitle">Your contribution to a better Rustenburg</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                <div className="card stat-card">
                    <p className="stat-label">Lifetime Submitted</p>
                    <p className="stat-value" style={{ color: 'var(--primary)' }}>
                        {personalStats.lifetimeSubmitted}
                    </p>
                </div>
                <br />
                <div className="card stat-card">
                    <p className="stat-label">Resolved</p>
                    <p className="stat-value" style={{ color: 'var(--success)' }}>
                        {personalStats.lifetimeResolved}
                    </p>
                </div>
                <br />
                <div className="card stat-card">
                    <p className="stat-label">Still Open</p>
                    <p className="stat-value" style={{ color: 'var(--warning)' }}>
                        {personalStats.lifetimePending}
                    </p>
                </div>
                <br />
                <div className="card stat-card">
                    <p className="stat-label">Avg Resolution</p>
                    <p className="stat-value" style={{ color: 'var(--info)' }}>
                        {personalStats.avgDaysToResolve} days
                    </p>
                </div>
            </div>
<br />
            <div className="card mt-10">
                <div className="p-6 pt-8">
                    <h3 className="section-title">Your Top Categories</h3>
                    <div className="h-64 bg-gray-50 rounded-xl mt-6 flex items-center justify-center border border-dashed">
                        <p className="text-[var(--text-light)]">
                            Pie / Bar chart: Roads 45% • Water 28% • Electricity 17% • Others 10%
                        </p>
                    </div>
                </div>
            </div>
<br />
            <div className="card mt-8">
                <div className="p-6 pt-8">
                    <h3 className="section-title">Activity Trend (Last 6 Months)</h3>
                    <div className="h-64 bg-gray-50 rounded-xl mt-6 flex items-center justify-center border border-dashed">
                        <p className="text-[var(--text-light)]">
                            Line chart placeholder: submissions vs resolved over time
                        </p>
                    </div>
                </div>
            </div>
<br />
            <div className="card mt-8">
                <div className="p-6 pt-8">
                    <h3 className="section-title">Your Badges & Achievements</h3>
                    <div className="flex flex-wrap gap-3 mt-6">
                        {personalStats.badges.map((badge, i) => (
                            <div
                                key={i}
                                className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium border border-amber-200"
                            >
                                🏆 {badge}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
<br />
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <Link to="/citizen/my-complaints" className="btn-primary flex-1 text-center">
                    View All My Complaints
                </Link>
                <Link to="/citizen/submit" className="btn-outline flex-1 text-center">
                    Submit New Issue
                </Link>
            </div>
        </div>
    );
}

export default CitizenOverview;