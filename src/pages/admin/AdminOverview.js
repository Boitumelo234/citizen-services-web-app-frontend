import { Link } from 'react-router-dom';
import '../../styles/dashboard.css';

function AdminOverview() {
    // Mock – real data from backend
    const performance = {
        resolutionRateTrend: '↑ 4% this month',
        topCategory: 'Roads & Infrastructure (41%)',
        busiestDepartment: 'Water & Sanitation',
        avgResolutionImprovement: '12% faster than last quarter'
    };

    const departments = [
        { name: 'Roads', resolved: 52, pending: 18, rate: '74%' },
        { name: 'Water', resolved: 38, pending: 11, rate: '78%' },
        { name: 'Electricity', resolved: 29, pending: 9, rate: '76%' },
        { name: 'Waste', resolved: 21, pending: 7, rate: '75%' },
    ];

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Municipal Performance Overview</h1>
            <p className="subtitle">Longer-term trends & department insights • {new Date().toLocaleDateString('en-ZA')}</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
                {/* Trends */}
                <div className="card">
                    <div className="p-6 pt-8">
                        <h3 className="section-title">Resolution Performance Trend</h3>
                        <div className="h-72 bg-gray-50 rounded-xl mt-6 flex items-center justify-center border border-dashed">
                            <p className="text-[var(--text-light)] text-center px-8">
                                Line chart: Resolution rate % over last 12 months<br />
                                Current: 76% {performance.resolutionRateTrend}
                            </p>
                        </div>
                    </div>
                </div>
<br />
                {/* Top issues */}
                <div className="card">
                    <div className="p-6 pt-8">
                        <h3 className="section-title">Top Problem Areas</h3>
                        <div className="h-72 bg-gray-50 rounded-xl mt-6 flex items-center justify-center border border-dashed">
                            <p className="text-[var(--text-light)] text-center px-8">
                                Heatmap / Bar chart placeholder<br />
                                #1: Roads & Infrastructure ({performance.topCategory})
                            </p>
                        </div>
                    </div>
                </div>
            </div>
<br />
            <div className="card mt-10">
                <div className="p-6 pt-8">
                    <h3 className="section-title">Department Leaderboard</h3>
                    <div className="mt-6 overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr>
                                <th>Department</th>
                                <th>Resolved (This Month)</th>
                                <th>Pending</th>
                                <th>Resolution Rate</th>
                            </tr>
                            </thead>
                            <tbody>
                            {departments.map((d, i) => (
                                <tr key={i}>
                                    <td className="font-medium">{d.name}</td>
                                    <td>{d.resolved}</td>
                                    <td className={d.pending > 10 ? 'text-[var(--warning)]' : ''}>{d.pending}</td>
                                    <td className="font-medium">{d.rate}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
<br />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                <div className="card stat-card">
                    <p className="stat-label">Busiest Department</p>
                    <p className="stat-value text-lg mt-3">{performance.busiestDepartment}</p>
                </div>
                <br />
                <div className="card stat-card">
                    <p className="stat-label">Improvement vs Last Quarter</p>
                    <p className="stat-value text-lg mt-3" style={{ color: 'var(--success)' }}>
                        {performance.avgResolutionImprovement}
                    </p>
                </div>
                <br />
                <div className="card stat-card">
                    <p className="stat-label">Avg Resolution Time</p>
                    <p className="stat-value text-lg mt-3">2.4 days</p>
                </div>
            </div>
<br />
            <div className="flex flex-wrap gap-4 mt-12">
                <Link to="/admin/complaints" className="btn-primary flex-1 min-w-[220px] text-center">
                    Go to Live Complaint Queue
                </Link>
                <Link to="/admin/reports" className="btn-outline flex-1 min-w-[220px] text-center">
                    Generate Detailed Reports
                </Link>
                <Link to="/admin/departments" className="btn-outline flex-1 min-w-[220px] text-center">
                    Full Department View
                </Link>
                <Link to="/admin/users" className="btn-outline flex-1 min-w-[220px] text-center">
                    Manage Users
                </Link>
            </div>
        </div>
    );
}

export default AdminOverview;