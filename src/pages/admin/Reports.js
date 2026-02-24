// Reports.jsx
import '../../styles/dashboard.css';

function Reports() {
    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Reports & Analytics</h1>
            <p className="subtitle">Generate and download performance & trend reports</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div className="card">
                    <div className="p-6 pt-8">
                        <h3 className="section-title">Quick Reports</h3>
                        <div className="space-y-4 mt-6">
                            <button className="btn-primary w-full justify-start">
                                Daily Summary (Today)
                            </button>
                            <button className="btn-outline w-full justify-start">
                                Weekly Performance Report
                            </button>
                            <button className="btn-outline w-full justify-start">
                                Monthly Department Breakdown
                            </button>
                            <button className="btn-outline w-full justify-start">
                                Annual Trend Analysis
                            </button>
                        </div>
                    </div>
                </div>
<br />
                <div className="card">
                    <div className="p-6 pt-8">
                        <h3 className="section-title">Custom Report</h3>
                        <div className="space-y-5 mt-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Date Range</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="date" className="p-3 border border-[var(--border)] rounded-lg" />
                                    <input type="date" className="p-3 border border-[var(--border)] rounded-lg" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Departments</label>
                                <select multiple className="w-full p-3 border border-[var(--border)] rounded-lg h-28">
                                    <option value="roads">Infrastructure & Roads</option>
                                    <option value="water">Water & Sanitation</option>
                                    <option value="electricity">Electricity & Energy</option>
                                    <option value="waste">Solid Waste & Environment</option>
                                    {/* ... */}
                                </select>
                            </div>
                            <button className="btn-primary w-full mt-4">
                                Generate Custom Report (PDF/CSV)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Reports;