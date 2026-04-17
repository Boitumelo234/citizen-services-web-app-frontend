// pages/staff/StaffDashboard.jsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import StaffLayout from "../../components/layout/StaffLayout";
import { getStaffDashboard, getMyComplaints } from "../../services/staffService";
import "../../styles/staff.css";

const PRIORITY_COLORS = {
    CRITICAL: "#ef4444", HIGH: "#f97316", MEDIUM: "#f59e0b", LOW: "#22c55e",
};
const STATUS_COLORS = {
    PENDING: "#ef4444", ASSIGNED: "#f97316", IN_PROGRESS: "#3b82f6",
    RESOLVED: "#22c55e", DECLINED: "#8b5cf6",
};
const CATEGORY_ICONS = {
    TRANSPORT: "🚌", WATER: "💧", ELECTRICITY: "⚡", WASTE: "♻️",
};

function timeAgo(dateStr) {
    if (!dateStr) return "—";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs  = Math.floor(mins / 60);
    const days = Math.floor(hrs  / 24);
    if (days > 0) return `${days}d ago`;
    if (hrs  > 0) return `${hrs}h ago`;
    if (mins > 0) return `${mins}m ago`;
    return "just now";
}

function Badge({ value, colorMap }) {
    const color = colorMap?.[value] || "#6b7280";
    return (
        <span className="staff-badge" style={{
            background: color + "22", color, borderColor: color + "55",
        }}>{value}</span>
    );
}

function StatCard({ label, value, icon, color, sub }) {
    return (
        <div className="staff-stat-card">
            <div className="staff-stat-icon">{icon}</div>
            <div className="staff-stat-body">
                <div className="staff-stat-value" style={{ color }}>{value ?? "—"}</div>
                <div className="staff-stat-label">{label}</div>
                {sub && <div className="staff-stat-sub">{sub}</div>}
            </div>
        </div>
    );
}

function ResolutionRing({ rate }) {
    const pct    = Math.min(Math.max(rate || 0, 0), 100);
    const color  = pct >= 70 ? "#22c55e" : pct >= 40 ? "#f59e0b" : "#ef4444";
    const radius = 40;
    const circ   = 2 * Math.PI * radius;
    const dash   = (pct / 100) * circ;
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
            <svg width="100" height="100" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="50" cy="50" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10" />
                <circle cx="50" cy="50" r={radius} fill="none" stroke={color} strokeWidth="10"
                        strokeDasharray={`${dash} ${circ - dash}`}
                        strokeLinecap="round"
                        style={{ transition: "stroke-dasharray 0.5s" }}
                />
            </svg>
            <div style={{ textAlign: "center", marginTop: "-0.5rem" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: 700, color }}>{pct.toFixed(0)}%</div>
                <div style={{ fontSize: "0.7rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Resolution Rate</div>
            </div>
        </div>
    );
}

export default function StaffDashboard() {
    const navigate = useNavigate();
    const [stats, setStats]           = useState(null);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState(null);

    const fetchAll = useCallback(async () => {
        try {
            const [dashData, complaintData] = await Promise.all([
                getStaffDashboard(),
                getMyComplaints(),
            ]);
            setStats(dashData);
            setComplaints(Array.isArray(complaintData) ? complaintData : []);
            setError(null);
        } catch (e) {
            setError("Failed to load dashboard data.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAll();
        const t = setInterval(fetchAll, 30000);
        return () => clearInterval(t);
    }, [fetchAll]);

    // Derive quick stats from complaints if backend doesn't supply them
    const derived = {
        total:      complaints.length,
        pending:    complaints.filter(c => c.status === "PENDING" || c.status === "ASSIGNED").length,
        inProgress: complaints.filter(c => c.status === "IN_PROGRESS").length,
        resolved:   complaints.filter(c => c.status === "RESOLVED").length,
        critical:   complaints.filter(c => c.priority === "CRITICAL").length,
    };
    const resRate = derived.total > 0
        ? Math.round((derived.resolved / derived.total) * 100)
        : 0;

    const urgent = complaints
        .filter(c => c.status !== "RESOLVED" && c.status !== "DECLINED")
        .sort((a, b) => {
            const pri = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
            return (pri[b.priority] || 0) - (pri[a.priority] || 0);
        })
        .slice(0, 5);

    const recent = complaints
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4);

    return (
        <StaffLayout>
            <div className="staff-page">
                <div className="staff-page-header">
                    <div>
                        <h2 className="staff-page-title">My Dashboard</h2>
                        <p className="staff-page-sub">Your assigned complaints and performance overview</p>
                    </div>
                    <button className="staff-btn-primary" onClick={() => navigate("/staff/complaints")}>
                        📋 View All Complaints
                    </button>
                </div>

                {error && <div className="staff-error">⚠ {error}</div>}

                {loading ? (
                    <div className="staff-loading">
                        <div className="staff-spinner" />
                        <span>Loading your dashboard…</span>
                    </div>
                ) : (
                    <>
                        {/* ── STATS GRID ── */}
                        <div className="staff-stats-grid">
                            <StatCard label="Total Assigned"  value={stats?.totalAssigned  ?? derived.total}      icon="📋" color="#2563eb" />
                            <StatCard label="Pending / Open"  value={stats?.pending         ?? derived.pending}     icon="🕐" color="#ef4444"
                                      sub={derived.critical > 0 ? `${derived.critical} critical!` : null} />
                            <StatCard label="In Progress"     value={stats?.inProgress      ?? derived.inProgress}  icon="⚙️" color="#3b82f6" />
                            <StatCard label="Resolved"        value={stats?.resolved        ?? derived.resolved}    icon="✅" color="#22c55e" />
                        </div>

                        {/* ── MAIN GRID ── */}
                        <div className="staff-main-grid">
                            {/* Left: Urgent Queue */}
                            <div className="staff-card">
                                <div className="staff-card-head">
                                    <h3 className="staff-card-title">🔥 Urgent — Needs Action</h3>
                                    <span className="staff-card-badge">{urgent.length} open</span>
                                </div>
                                {urgent.length === 0 ? (
                                    <div className="staff-empty">
                                        <span className="staff-empty-icon">✅</span>
                                        <p className="staff-empty-text">All caught up! No urgent complaints.</p>
                                    </div>
                                ) : (
                                    <div className="staff-complaint-list">
                                        {urgent.map(c => (
                                            <div
                                                key={c.id}
                                                className={`staff-complaint-item ${c.priority?.toLowerCase()}`}
                                                onClick={() => navigate(`/staff/complaints/${c.id}`)}
                                            >
                                                <div className="staff-complaint-icon">
                                                    {CATEGORY_ICONS[c.category] || "📋"}
                                                </div>
                                                <div className="staff-complaint-body">
                                                    <p className="staff-complaint-title">{c.title}</p>
                                                    <div className="staff-complaint-meta">
                                                        <span>📍 {c.area || "—"}</span>
                                                        <span>🕐 {timeAgo(c.createdAt)}</span>
                                                        <Badge value={c.priority} colorMap={PRIORITY_COLORS} />
                                                        <Badge value={c.status}   colorMap={STATUS_COLORS} />
                                                    </div>
                                                </div>
                                                <div className="staff-complaint-actions">
                                                    <button className="staff-act-btn" title="Open">👁</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {urgent.length > 0 && (
                                    <div style={{ marginTop: "1rem", textAlign: "center" }}>
                                        <button className="staff-btn-outline"
                                                onClick={() => navigate("/staff/complaints")}>
                                            See all complaints →
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Right column */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

                                {/* Resolution ring */}
                                <div className="staff-card" style={{ textAlign: "center", padding: "1.5rem" }}>
                                    <h3 className="staff-card-title" style={{ marginBottom: "1rem" }}>📊 Performance</h3>
                                    <ResolutionRing rate={stats?.resolutionRate ?? resRate} />
                                    <div style={{
                                        display: "grid", gridTemplateColumns: "1fr 1fr",
                                        gap: "0.6rem", marginTop: "1.25rem",
                                    }}>
                                        {[
                                            { label: "Avg Days",    value: stats?.avgResolutionDays ?? "—", color: "#2563eb" },
                                            { label: "This Week",   value: stats?.resolvedThisWeek  ?? derived.resolved, color: "#22c55e" },
                                        ].map(s => (
                                            <div key={s.label} style={{
                                                background: "#f9fafb", border: "1px solid #e5e7eb",
                                                borderRadius: "0.75rem", padding: "0.75rem",
                                            }}>
                                                <div style={{ fontSize: "1.4rem", fontWeight: 700, color: s.color }}>{s.value}</div>
                                                <div style={{ fontSize: "0.68rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Status breakdown */}
                                <div className="staff-card">
                                    <h3 className="staff-card-title" style={{ marginBottom: "1rem" }}>📈 Status Breakdown</h3>
                                    {Object.entries(STATUS_COLORS).map(([status, color]) => {
                                        const count = complaints.filter(c => c.status === status).length;
                                        const pct   = derived.total > 0 ? (count / derived.total) * 100 : 0;
                                        return (
                                            <div key={status} style={{
                                                display: "grid", gridTemplateColumns: "90px 1fr 35px",
                                                alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem",
                                            }}>
                                                <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#4b5563" }}>{status}</span>
                                                <div className="staff-progress-wrap">
                                                    <div className="staff-progress-fill" style={{ width: `${pct}%`, background: color }} />
                                                </div>
                                                <span style={{ fontSize: "0.72rem", fontFamily: "monospace", color: "#6b7280", textAlign: "right" }}>{count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* ── RECENT ACTIVITY ── */}
                        <div className="staff-card">
                            <div className="staff-card-head">
                                <h3 className="staff-card-title">🕐 Recently Assigned</h3>
                                <button className="staff-btn-outline" style={{ padding: "0.35rem 0.75rem", fontSize: "0.78rem" }}
                                        onClick={() => navigate("/staff/complaints")}>See all</button>
                            </div>
                            {recent.length === 0 ? (
                                <div className="staff-empty">
                                    <span className="staff-empty-icon">📭</span>
                                    <p className="staff-empty-text">No complaints assigned yet.</p>
                                </div>
                            ) : (
                                <div className="staff-table-wrap">
                                    <table className="staff-table">
                                        <thead>
                                        <tr>
                                            <th>#ID</th>
                                            <th>Title</th>
                                            <th>Category</th>
                                            <th>Area</th>
                                            <th>Priority</th>
                                            <th>Status</th>
                                            <th>Age</th>
                                            <th>Action</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {recent.map(c => (
                                            <tr key={c.id} style={{ cursor: "pointer" }}
                                                onClick={() => navigate(`/staff/complaints/${c.id}`)}>
                                                <td style={{ fontFamily: "monospace", color: "#2563eb" }}>#{c.id}</td>
                                                <td style={{ fontWeight: 600, color: "#111827", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.title}</td>
                                                <td><Badge value={c.category} colorMap={{ TRANSPORT:"#f59e0b", WATER:"#3b82f6", ELECTRICITY:"#eab308", WASTE:"#22c55e" }} /></td>
                                                <td>{c.area || "—"}</td>
                                                <td><Badge value={c.priority} colorMap={PRIORITY_COLORS} /></td>
                                                <td><Badge value={c.status}   colorMap={STATUS_COLORS} /></td>
                                                <td style={{ fontFamily: "monospace", fontSize: "0.78rem", color: "#6b7280" }}>{timeAgo(c.createdAt)}</td>
                                                <td>
                                                    <button className="staff-act-btn" title="Open"
                                                            onClick={e => { e.stopPropagation(); navigate(`/staff/complaints/${c.id}`); }}>
                                                        👁
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </StaffLayout>
    );
}