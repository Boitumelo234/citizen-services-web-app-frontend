//import { useState } from "react";
import {Link} from "react-router-dom";
import '../../styles/dashboard.css'

function AdminDashboard() {
    const kpi = [
        { label: "Total Active", value: "87", color: "var(--primary)" },
        { label: "Open", value: "42", color: "var(--warning)" },
        { label: "In Progress", value: "25", color: "var(--primary)" },
        { label: "Resolved Today", value: "12", color: "var(--success)" },
    ];

    const liveComplaints = [
        { id: "RUST-7856", citizen: "Thabo M.", category: "Infrastructure & Roads", location: "Seraleng", time: "11 min ago", status: "Pending", dept: "—" },
        { id: "RUST-7855", citizen: "Lerato K.", category: "Water & Sanitation", location: "Tlhabane", time: "47 min ago", status: "In Progress", dept: "Water" },
        { id: "RUST-7854", citizen: "John R.", category: "Electricity & Energy", location: "Rustenburg CBD", time: "2h ago", status: "Pending", dept: "—" },
    ];

    return (
        <div className="dashboard-root">
            <div className="dashboard-container">
                <h1 className="dashboard-title">Municipal Control Center</h1>
                <p className="subtitle">Real-time overview • Automated routing enabled</p>

                {/* KPI Cards */}
                <div className="overview-cards">
                    {kpi.map((item, i) => (
                        <div key={i} className="card stat-card">
                            <p className="stat-label">{item.label}</p>
                            <p className="stat-value" style={{ color: item.color }}>{item.value}</p>
                        </div>
                    ))}
                    <div className="card stat-card">
                        <p className="stat-label">Resolution Rate</p>
                        <div className="flex items-end gap-3 mt-3">
                            <p className="stat-value" style={{ color: "var(--success)" }}>78%</p>
                            <div className="h-2 bg-green-200 flex-1 rounded-full overflow-hidden">
                                <div className="h-2 bg-green-600 w-[78%] rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
<br />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Charts */}
                    <div className="card lg:col-span-8">
                        <div className="p-6">
                            <br />
                            <h3 className="section-title">Analytics Engine</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <p className="text-sm font-medium mb-3">Complaints Last 30 Days</p>
                                    <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center border border-dashed">
                                        <p className="text-[var(--text-light)]">Line Chart Placeholder (Volumes + Heatmap overlay)</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium mb-3">By Department</p>
                                    <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center border border-dashed">
                                        <p className="text-[var(--text-light)]">Bar / Pie Chart Placeholder</p>
                                    </div>
                                </div>
                                <br />
                            </div>
                        </div>
                    </div>
<br />
                    {/* Smart Features */}
                    <div className="card lg:col-span-4">
                        <div className="p-6 space-y-4">
                            <br />
                            <h3 className="section-title">Smart Features</h3>
                            <button
                                onClick={() => alert("Auto-routing all pending complaints...")}
                                className="btn-primary w-full"
                            >
                                🚀 Auto-Route Pending Complaints
                            </button>
                            <button
                                onClick={() => alert("Generating PDF/CSV report...")}
                                className="btn-outline w-full"
                            >
                                📊 Generate KPI Report (PDF / CSV)
                            </button>
                            <button
                                onClick={() => alert("Opening full heatmap...")}
                                className="btn-outline w-full"
                            >
                                🔥 View City-Wide Heatmap
                            </button>
                            <br />
                        </div>
                    </div>
<br />
                    {/* Live Complaints Queue */}
                    <div className="card lg:col-span-12">
                        <div className="p-6">
                            <br />
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="section-title">Live Complaint Queue</h3>
                                <span className="status-badge status-resolved">Auto-routing ON</span>
                            </div>
                            <div className="table-container">
                                <table>
                                    <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Citizen</th>
                                        <th>Category</th>
                                        <th>Location</th>
                                        <th>Time</th>
                                        <th>Status</th>
                                        <th>Assigned</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {liveComplaints.map((c, i) => (
                                        <tr key={i}>
                                            <td className="font-medium">{c.id}</td>
                                            <td>{c.citizen}</td>
                                            <td>{c.category}</td>
                                            <td>{c.location}</td>
                                            <td className="text-sm text-[var(--text-light)]">{c.time}</td>
                                            <td>
                          <span className={`status-badge status-${c.status.toLowerCase()}`}>
                            {c.status}
                          </span>
                                            </td>
                                            <td>{c.dept}</td>
                                            <td>
                                                <button className="text-[var(--primary)] hover:underline text-sm mr-3">Assign</button>
                                                <button className="text-[var(--primary)] hover:underline text-sm">Update</button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                            <Link to="/admin/complaints" className="text-[var(--primary)] mt-6 inline-block hover:underline">
                                Manage All Complaints →
                            </Link>
                        </div>
                        <br />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
