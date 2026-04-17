// AdminOverview.js – Light theme, citizen styling (no circular export)
import { useEffect, useState, useCallback } from "react";
import api from "../../api/api";
import "../../styles/admin.css";

const CATEGORY_COLORS = {
    TRANSPORT: "#f59e0b", WATER: "#3b82f6", ELECTRICITY: "#eab308", WASTE: "#22c55e",
};
const STATUS_COLORS = {
    PENDING: "#ef4444", ASSIGNED: "#f97316", IN_PROGRESS: "#3b82f6",
    RESOLVED: "#22c55e", DECLINED: "#8b5cf6",
};
const DEPT_ICONS = { TRANSPORT: "🚌", WATER: "💧", ELECTRICITY: "⚡", WASTE: "♻️" };

// function timeAgo(dateStr) {
//     if (!dateStr) return "—";
//     const diff = Date.now() - new Date(dateStr).getTime();
//     const mins = Math.floor(diff / 60000);
//     const hrs  = Math.floor(mins / 60);
//     const days = Math.floor(hrs / 24);
//     if (days > 0)  return `${days}d ago`;
//     if (hrs > 0)   return `${hrs}h ago`;
//     if (mins > 0)  return `${mins}m ago`;
//     return "just now";
// }

function StatCard({ label, value, icon, color, sub }) {
    return (
        <div className="stat-card" style={{ "--accent": color }}>
            <div className="stat-icon">{icon}</div>
            <div className="stat-body">
                <div className="stat-value">{value ?? "—"}</div>
                <div className="stat-label">{label}</div>
                {sub && <div className="stat-sub">{sub}</div>}
            </div>
        </div>
    );
}

function MiniBarChart({ data, colorMap, title }) {
    if (!data || data.length === 0) return <div className="chart-empty">No data yet</div>;
    const max = Math.max(...data.map(d => Number(d.count || 0)), 1);
    return (
        <div className="mini-bar-chart">
            {title && <div className="chart-title">{title}</div>}
            <div className="bars">
                {data.map((item, i) => {
                    const key = item.category || item.status || item.name;
                    const val = Number(item.count || 0);
                    const pct = (val / max) * 100;
                    const color = (colorMap && colorMap[key]) || "#6366f1";
                    return (
                        <div key={i} className="bar-row">
                            <div className="bar-label">{key}</div>
                            <div className="bar-track">
                                <div className="bar-fill" style={{ width: `${pct}%`, background: color }} />
                            </div>
                            <div className="bar-count">{val}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function LineChart({ data, title }) {
    if (!data || data.length < 2) return <div className="chart-empty">Insufficient data for trend chart</div>;
    const values = data.map(d => Number(d.count));
    const max = Math.max(...values, 1);
    const min = Math.min(...values, 0);
    const W = 400, H = 120, PAD = 20;
    const pts = data.map((d, i) => {
        const x = PAD + (i / (data.length - 1)) * (W - PAD * 2);
        const y = PAD + ((max - Number(d.count)) / (max - min + 1)) * (H - PAD * 2);
        return `${x},${y}`;
    });
    const polyline = pts.join(" ");
    const area = `${PAD},${H - PAD} ${polyline} ${W - PAD},${H - PAD}`;
    return (
        <div className="line-chart-wrap">
            {title && <div className="chart-title">{title}</div>}
            <svg viewBox={`0 0 ${W} ${H}`} className="line-chart-svg">
                <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor="#6366f1" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <polygon points={area} fill="url(#lineGrad)" />
                <polyline points={polyline} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinejoin="round" />
                {data.map((d, i) => {
                    const [x, y] = pts[i].split(",").map(Number);
                    return (
                        <circle key={i} cx={x} cy={y} r="3.5" fill="#6366f1">
                            <title>{d.date}: {d.count}</title>
                        </circle>
                    );
                })}
            </svg>
            <div className="line-chart-labels">
                {data.map((d, i) => <span key={i} className="line-label">{d.date?.slice(5)}</span>)}
            </div>
        </div>
    );
}

function AlertBadge({ type }) {
    const map = { CRITICAL: "#ef4444", OVERDUE: "#f97316", UNASSIGNED: "#8b5cf6" };
    return (
        <span className="alert-badge" style={{ background: map[type] || "#6b7280" }}>
            {type}
        </span>
    );
}

function RefreshCountdown({ seconds, onRefresh }) {
    const [count, setCount] = useState(seconds);
    useEffect(() => {
        setCount(seconds);
        const t = setInterval(() => setCount(c => c <= 1 ? seconds : c - 1), 1000);
        return () => clearInterval(t);
    }, [seconds]);
    return (
        <div className="refresh-countdown">
            <span className="refresh-dot" />
            <span className="refresh-text">Refreshing in {count}s</span>
            <button className="ov-refresh-btn" onClick={onRefresh}>↻ Now</button>
        </div>
    );
}

function HotspotWidget({ complaints }) {
    if (!complaints || complaints.length === 0) return <div className="no-data">No complaint data</div>;
    const areaMap = {};
    complaints.forEach(c => { if (c.area) areaMap[c.area] = (areaMap[c.area] || 0) + 1; });
    const sorted = Object.entries(areaMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
    if (sorted.length === 0) return <div className="no-data">No area data available</div>;
    const maxVal = sorted[0]?.[1] || 1;
    const rankColors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6"];
    return (
        <div className="hotspot-widget">
            {sorted.map(([area, count], i) => (
                <div key={i} className="hotspot-item">
                    <div className="hotspot-rank-badge" style={{ background: rankColors[i] + "33", color: rankColors[i] }}>
                        #{i + 1}
                    </div>
                    <div className="hotspot-area-name">{area}</div>
                    <div className="hotspot-bar-wrap">
                        <div className="hotspot-bar-fill" style={{ width: `${(count / maxVal) * 100}%`, background: rankColors[i] }} />
                    </div>
                    <div className="hotspot-count-badge">{count}</div>
                </div>
            ))}
        </div>
    );
}

function AvgResolutionCard({ complaints }) {
    if (!complaints || complaints.length === 0) return <div className="no-data">No data</div>;
    const resolved = complaints.filter(c => c.status === "RESOLVED" && c.createdAt && c.resolvedAt);
    if (resolved.length === 0) return <div className="no-data">No resolved complaints yet</div>;
    const avgMs = resolved.reduce((acc, c) =>
        acc + (new Date(c.resolvedAt).getTime() - new Date(c.createdAt).getTime()), 0) / resolved.length;
    const avgDays = (avgMs / (1000 * 60 * 60 * 24)).toFixed(1);
    const color = avgDays < 2 ? "#22c55e" : avgDays < 5 ? "#f59e0b" : "#ef4444";
    return (
        <div className="avg-res-display">
            <div className="avg-res-num" style={{ color }}>{avgDays}</div>
            <div className="avg-res-label">days avg. resolution</div>
            <div className="avg-res-sub">based on {resolved.length} resolved complaint{resolved.length !== 1 ? "s" : ""}</div>
        </div>
    );
}

function StaffAvailabilityPanel({ complaints, staff }) {
    if (!staff || staff.length === 0) return <div className="no-data">No staff data</div>;
    const activeMap = {};
    (complaints || []).forEach(c => {
        if (c.assignedToId && c.status !== "RESOLVED" && c.status !== "DECLINED")
            activeMap[c.assignedToId] = (activeMap[c.assignedToId] || 0) + 1;
    });
    const staffOnly = staff.filter(s => s.role === "STAFF");
    if (staffOnly.length === 0) return <div className="no-data">No staff members found</div>;
    return (
        <div className="staff-avail-list">
            {staffOnly.map((s, i) => {
                const active = activeMap[s.id] || 0;
                const loadClass = active >= 5 ? "busy" : active >= 3 ? "moderate" : "free";
                const initials = (s.fullName || s.email || "?")[0].toUpperCase();
                return (
                    <div key={i} className="staff-avail-row">
                        <div className="staff-avail-avatar">{initials}</div>
                        <div className="staff-avail-info">
                            <div className="staff-avail-name">{s.fullName || s.email}</div>
                            <div className="staff-avail-dept">{s.departmentName || "—"}</div>
                        </div>
                        <div className={`staff-avail-load ${loadClass}`}>{active} active</div>
                    </div>
                );
            })}
        </div>
    );
}

function LoadingState() {
    return (
        <div className="ov-loading">
            <div className="ov-spinner" />
            <p>Loading city operations data…</p>
        </div>
    );
}

export default function AdminOverview() {
    const [stats, setStats]               = useState(null);
    const [daily, setDaily]               = useState([]);
    const [byCategory, setByCategory]     = useState([]);
    const [byStatus, setByStatus]         = useState([]);
    const [deptActivity, setDeptActivity] = useState([]);
    const [alerts, setAlerts]             = useState({ unassignedCount: 0, criticalCount: 0, overdueCount: 0, alerts: [] });
    const [allComplaints, setAllComplaints] = useState([]);
    const [allStaff, setAllStaff]         = useState([]);
    const [loading, setLoading]           = useState(true);
    const [error, setError]               = useState(null);

    const fetchAll = useCallback(async () => {
        try {
            const [statsRes, dailyRes, catRes, statusRes, deptRes, alertsRes, complaintsRes, staffRes] = await Promise.all([
                api.get("/admin/overview/stats"),
                api.get("/admin/overview/charts/daily"),
                api.get("/admin/overview/charts/by-category"),
                api.get("/admin/overview/charts/by-status"),
                api.get("/admin/overview/department-activity"),
                api.get("/admin/overview/alerts"),
                api.get("/admin/complaints"),
                api.get("/admin/users"),
            ]);
            setStats(statsRes.data);
            setDaily(dailyRes.data);
            setByCategory(catRes.data);
            setByStatus(statusRes.data);
            setDeptActivity(deptRes.data);
            setAlerts(alertsRes.data);
            setAllComplaints(complaintsRes.data);
            setAllStaff(staffRes.data);
            setError(null);
        } catch {
            setError("Failed to load data. Is the backend running on port 8081?");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAll();
        const interval = setInterval(fetchAll, 30000);
        return () => clearInterval(interval);
    }, [fetchAll]);

    if (loading) return <LoadingState />;

    return (
        <div className="admin-overview">
            <div className="ov-header">
                <div>
                    <h1 className="ov-title">City Operations Centre</h1>
                    <p className="ov-subtitle">Rustenburg Local Municipality — live complaint monitoring</p>
                </div>
                <RefreshCountdown seconds={30} onRefresh={fetchAll} />
            </div>

            {error && (
                <div className="ov-error">
                    ⚠ {error}
                </div>
            )}

            <div className="stats-grid">
                <StatCard label="Total Complaints" value={stats?.totalComplaints}   icon="📋" color="#6366f1" />
                <StatCard label="Pending"           value={stats?.pending}           icon="🕐" color="#ef4444"
                          sub={stats?.pending > 10 ? "⚠ High backlog" : "Under control"} />
                <StatCard label="In Progress"       value={stats?.inProgress}        icon="⚙️" color="#3b82f6" />
                <StatCard label="Resolved Today"    value={stats?.resolvedToday}     icon="✅" color="#22c55e" />
                <StatCard label="Total Citizens"    value={stats?.totalCitizens}     icon="👥" color="#8b5cf6" />
                <StatCard label="Active Staff"      value={stats?.activeStaff}       icon="👷" color="#f97316" />
                <StatCard label="Unassigned"        value={stats?.unassigned}        icon="❗" color="#ef4444"
                          sub={stats?.unassigned > 0 ? "Needs attention" : "All assigned"} />
                <StatCard label="Critical Pending"  value={stats?.criticalPending}   icon="🔴" color="#dc2626" />
            </div>

            <div className="charts-row">
                <div className="chart-card wide">
                    <LineChart data={daily} title="📈 Complaints Received — Last 7 Days" />
                </div>
                <div className="chart-card">
                    <MiniBarChart data={byCategory} colorMap={CATEGORY_COLORS} title="📂 By Category" />
                </div>
                <div className="chart-card">
                    <MiniBarChart data={byStatus} colorMap={STATUS_COLORS} title="🔵 By Status" />
                </div>
            </div>

            <div className="insights-row">
                <div className="panel insight-panel">
                    <div className="panel-header">
                        <span className="panel-title">📍 Top Hotspot Areas</span>
                        <span className="panel-badge">Top 5</span>
                    </div>
                    <HotspotWidget complaints={allComplaints} />
                </div>

                <div className="panel insight-panel">
                    <div className="panel-header">
                        <span className="panel-title">⏱ Avg Resolution Time</span>
                    </div>
                    <AvgResolutionCard complaints={allComplaints} />
                </div>

                <div className="panel insight-panel">
                    <div className="panel-header">
                        <span className="panel-title">👷 Staff Availability</span>
                    </div>
                    <StaffAvailabilityPanel complaints={allComplaints} staff={allStaff} />
                </div>
            </div>

            <div className="bottom-grid">
                <div className="panel alerts-panel">
                    <div className="panel-header">
                        <span className="panel-title">⚠ Active Alerts</span>
                        <span className="panel-badge">{alerts.alerts?.length || 0}</span>
                    </div>
                    <div className="alerts-summary">
                        <div className="alert-count-chip critical">
                            <span>{alerts.criticalCount}</span>Critical
                        </div>
                        <div className="alert-count-chip overdue">
                            <span>{alerts.overdueCount}</span>Overdue
                        </div>
                        <div className="alert-count-chip unassigned">
                            <span>{alerts.unassignedCount}</span>Unassigned
                        </div>
                    </div>
                    <div className="alerts-list">
                        {!alerts.alerts?.length ? (
                            <div className="no-alerts">✅ No active alerts — system healthy</div>
                        ) : (
                            alerts.alerts.map((a, i) => (
                                <div key={i} className="alert-item">
                                    <AlertBadge type={a.type} />
                                    <span className="alert-msg">{a.message}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="panel dept-panel">
                    <div className="panel-header">
                        <span className="panel-title">🏢 Department Activity</span>
                    </div>
                    <div className="dept-list">
                        {deptActivity.length === 0 ? (
                            <div className="no-data">No departments configured yet</div>
                        ) : (
                            deptActivity.map((d, i) => (
                                <div key={i} className="dept-row">
                                    <div className="dept-icon">{DEPT_ICONS[d.name] || "🏢"}</div>
                                    <div className="dept-info">
                                        <div className="dept-name">{d.name}</div>
                                        <div className="dept-meta">{d.staffCount} staff member{d.staffCount !== 1 ? "s" : ""}</div>
                                    </div>
                                    <div>
                                        <span className="dept-active-num">{d.activeComplaints}</span>
                                        <span className="dept-active-label"> active</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="panel status-panel">
                    <div className="panel-header">
                        <span className="panel-title">📊 Resolution Status</span>
                    </div>
                    <div className="status-breakdown">
                        {byStatus.length === 0 ? (
                            <div className="no-data">No complaints yet</div>
                        ) : (() => {
                            const total = byStatus.reduce((acc, x) => acc + Number(x.count), 0);
                            return byStatus.map((s, i) => {
                                const color = STATUS_COLORS[s.status] || "#6b7280";
                                const pct = total > 0 ? Math.round((Number(s.count) / total) * 100) : 0;
                                return (
                                    <div key={i} className="status-row">
                                        <div className="status-dot" style={{ background: color }} />
                                        <div className="status-name">{s.status}</div>
                                        <div className="status-bar-wrap">
                                            <div className="status-bar-fill" style={{ width: `${pct}%`, background: color }} />
                                        </div>
                                        <div className="status-pct">{pct}%</div>
                                        <div className="status-count">{s.count}</div>
                                    </div>
                                );
                            });
                        })()}
                    </div>
                </div>
            </div>
        </div>
    );
}

