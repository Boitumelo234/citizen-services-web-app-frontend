import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats } from "../../services/adminService";
import "../../styles/admin.css";

// ─── Animated counter hook ────────────────────────────────────────────────────
function useCountUp(target, duration = 1200) {
    const [value, setValue] = useState(0);
    useEffect(() => {
        if (!target) return;
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) { setValue(target); clearInterval(timer); }
            else setValue(Math.floor(start));
        }, 16);
        return () => clearInterval(timer);
    }, [target, duration]);
    return value;
}

// ─── Complaint Detail Drawer ──────────────────────────────────────────────────
function ComplaintDrawer({ complaint, onClose }) {
    // ✅ Hook declared BEFORE early return
    const [, forceRender] = useState(0);

    useEffect(() => {
        forceRender(n => n + 1);
    }, [complaint]);

    // ✅ Early return AFTER hooks
    if (!complaint) return null;

    const formatDate = (d) => d ? new Date(d).toLocaleString("en-ZA") : "—";
    const getStatusBadge = (st) => ({
        "New": "badge badge-new", "In Progress": "badge badge-inprogress",
        "Resolved": "badge badge-resolved", "Rejected": "badge badge-rejected"
    }[st] || "badge");

    return (
        <div className="drawer-overlay" onClick={onClose}>
            <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
                <div className="drawer-header">
                    <div>
                        <span className="drawer-ref">{complaint.referenceNumber}</span>
                        <h2 className="drawer-title">{complaint.category}</h2>
                    </div>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="drawer-body">
                    <div className="drawer-row">
                        <span className="drawer-label">Status</span>
                        <span className={getStatusBadge(complaint.status)}>{complaint.status}</span>
                    </div>
                    <div className="drawer-row">
                        <span className="drawer-label">Priority</span>
                        <span className={`priority priority-${complaint.priority?.toLowerCase()}`}>{complaint.priority}</span>
                    </div>
                    <div className="drawer-row">
                        <span className="drawer-label">Area</span>
                        <span>{complaint.area}</span>
                    </div>
                    <div className="drawer-row">
                        <span className="drawer-label">Assigned To</span>
                        <span>{complaint.assignedTo || <em>Unassigned</em>}</span>
                    </div>
                    <div className="drawer-row">
                        <span className="drawer-label">Submitted</span>
                        <span>{formatDate(complaint.createdAt)}</span>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-submit-complaint" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}

// ─── AdminOverview ────────────────────────────────────────────────────────────
function AdminOverview() {
    const [stats, setStats]               = useState(null);
    const [loading, setLoading]           = useState(true);
    const [error, setError]               = useState(null);
    const [activeTab, setActiveTab]       = useState("today");
    const [darkMode, setDarkMode]         = useState(() => localStorage.getItem("rlm-dark") === "true");
    const [currentTime, setCurrentTime]   = useState(new Date());
    const [lastUpdated, setLastUpdated]   = useState(null);
    const [searchQuery, setSearchQuery]   = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [dateFrom, setDateFrom]         = useState("");
    const [dateTo, setDateTo]             = useState("");

    useEffect(() => {
        document.body.classList.toggle("rlm-dark", darkMode);
        localStorage.setItem("rlm-dark", darkMode);
    }, [darkMode]);

    useEffect(() => {
        const tick = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(tick);
    }, []);

    const fetchStats = useCallback(async (showSpinner = false) => {
        if (showSpinner) setIsRefreshing(true);
        try {
            const res = await getDashboardStats();
            setStats(res.data);
            setLastUpdated(new Date());
            setError(null);
        } catch {
            setError("Failed to load overview data.");
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => { fetchStats(); }, [fetchStats]);

    // ✅ All useCountUp hooks called unconditionally
    const animTotal    = useCountUp(stats?.totalComplaints    ?? 0);
    const animOpen     = useCountUp(stats?.openComplaints     ?? 0);
    const animResolved = useCountUp(stats?.resolvedComplaints ?? 0);
    const animAvg      = useCountUp(stats?.avgResolutionDays  ?? 0);
    const animRate     = useCountUp(
        stats?.totalComplaints > 0
            ? Math.round((stats.resolvedComplaints / stats.totalComplaints) * 100)
            : 0
    );

    const handleRefresh = () => fetchStats(true);
    const handlePrint   = () => window.print();

    const formatTime  = (d) => d.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const formatDate  = (d) => d.toLocaleDateString("en-ZA", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
    const formatShort = (s) => s ? new Date(s).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
    const timeAgo = (d) => {
        if (!d) return "Never";
        const s = Math.floor((new Date() - d) / 1000);
        if (s < 10) return "Just now"; if (s < 60) return `${s}s ago`;
        if (s < 3600) return `${Math.floor(s / 60)}m ago`;
        return `${Math.floor(s / 3600)}h ago`;
    };
    const getStatusBadge   = (st) => ({ "New": "badge badge-new", "In Progress": "badge badge-inprogress", "Resolved": "badge badge-resolved", "Rejected": "badge badge-rejected" }[st] || "badge");
    const getPriorityBadge = (p)  => ({ "High": "priority priority-high", "Medium": "priority priority-medium", "Low": "priority priority-low" }[p] || "priority");
    const getSlaClass      = (sla) => sla >= 80 ? "sla-good" : sla >= 60 ? "sla-warn" : "sla-bad";

    const filterByDate = (list) => {
        if (!list) return [];
        return list.filter((c) => {
            const created = new Date(c.createdAt);
            if (dateFrom && created < new Date(dateFrom)) return false;
            if (dateTo   && created > new Date(dateTo + "T23:59:59")) return false;
            return true;
        });
    };

    const filteredComplaints = filterByDate(
        (stats?.recentComplaints || []).filter((c) => {
            if (!searchQuery.trim()) return true;
            const q = searchQuery.toLowerCase();
            return c.referenceNumber?.toLowerCase().includes(q) ||
                   c.category?.toLowerCase().includes(q) ||
                   c.area?.toLowerCase().includes(q) ||
                   c.status?.toLowerCase().includes(q);
        })
    );

    const sortedDepts = stats?.departmentPerformance
        ? [...stats.departmentPerformance].sort((a, b) => b.slaCompliance - a.slaCompliance)
        : [];
    const topDept    = sortedDepts[0]?.department;
    const bottomDept = sortedDepts[sortedDepts.length - 1]?.department;

    if (loading) return <div className="dash-loading"><div className="dash-spinner"></div><p>Loading overview…</p></div>;
    if (error)   return <div className="dash-error">{error}</div>;

    // ✅ Removed avgResolutionDays from destructuring since animAvg is used instead
    const { totalComplaints, openComplaints, resolvedComplaints, pendingComplaints,
            newThisMonth, resolvedThisMonth, newThisWeek,
            statusDistribution, departmentPerformance, complaintsByArea } = stats;

    const resolutionRate = totalComplaints > 0
        ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0;

    return (
        <div className="admin-dashboard">

            {selectedComplaint && (
                <ComplaintDrawer complaint={selectedComplaint} onClose={() => setSelectedComplaint(null)} />
            )}

            {/* ── Header ── */}
            <div className="dash-header">
                <div className="dash-header-left">
                    <span className="dash-greeting">Admin</span>
                    <h1 className="dash-title">System Overview</h1>
                    <div className="dash-clock">
                        <span className="clock-time">{formatTime(currentTime)}</span>
                        <span className="clock-date">{formatDate(currentTime)}</span>
                    </div>
                    <div className="tab-group">
                        {["today", "week", "month"].map((t) => (
                            <button key={t} className={`tab-btn ${activeTab === t ? "tab-active" : ""}`}
                                onClick={() => setActiveTab(t)}>
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="dash-header-controls">
                    <div className="refresh-wrapper">
                        <button className={`btn-refresh ${isRefreshing ? "refreshing" : ""}`} onClick={handleRefresh}>
                            <span className="refresh-icon">↻</span>
                            {isRefreshing ? "Refreshing…" : "Refresh"}
                        </button>
                        <span className="last-updated">Updated: {timeAgo(lastUpdated)}</span>
                    </div>
                    <button className="btn-print no-print" onClick={handlePrint}>🖨 Print / PDF</button>
                    <button className="btn-darkmode no-print" onClick={() => setDarkMode(!darkMode)}>
                        {darkMode ? "☀ Light" : "🌙 Dark"}
                    </button>
                    <Link to="/admin/complaints" className="btn-new-complaint no-print">+ New Complaint</Link>
                </div>
            </div>

            {/* ── KPI Cards ── */}
            <div className="kpi-grid kpi-grid-5">
                {[
                    { cls: "kpi-total",    icon: "📋", label: "TOTAL COMPLAINTS",   val: animTotal,    sub: `+${newThisMonth} this month`,      trend: true },
                    { cls: "kpi-open",     icon: "🔓", label: "OPEN CASES",          val: animOpen,     sub: `${newThisWeek} opened this week`,   trend: false },
                    { cls: "kpi-resolved", icon: "✅", label: "RESOLVED",            val: animResolved, sub: `+${resolvedThisMonth} this month`,  trend: true },
                    { cls: "kpi-sla",      icon: "⏱", label: "AVG RESOLUTION TIME", val: `${animAvg}d`,sub: "Average days to close",             trend: false },
                    { cls: "kpi-rate",     icon: "📈", label: "RESOLUTION RATE",     val: `${animRate}%`,sub: "Overall performance",             trend: false },
                ].map((k) => (
                    <div key={k.label} className={`kpi-card ${k.cls}`}>
                        <div className="kpi-icon">{k.icon}</div>
                        <div className="kpi-body">
                            <span className="kpi-label">{k.label}</span>
                            <span className="kpi-value">{k.val}</span>
                            <span className={`kpi-sub ${k.trend ? "kpi-trend-up" : ""}`}>
                                {k.trend ? "↑ " : ""}{k.sub}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Department Performance ── */}
            <div className="dash-card full-width">
                <div className="dash-card-header">
                    <h3>Department Performance Breakdown</h3>
                    <div className="dept-legend">
                        <span className="dept-legend-item top">🏆 Top: {topDept}</span>
                        <span className="dept-legend-item bottom">⚠ Needs attention: {bottomDept}</span>
                    </div>
                </div>
                <div className="table-scroll">
                    <table className="dept-table">
                        <thead>
                            <tr><th>Department</th><th>Total</th><th>Resolved</th><th>In Progress</th><th>Pending</th><th>SLA</th><th>Progress</th></tr>
                        </thead>
                        <tbody>
                            {departmentPerformance?.length === 0 && <tr><td colSpan="7" className="empty-row">No data yet.</td></tr>}
                            {departmentPerformance?.map((dept) => (
                                <tr key={dept.department}
                                    className={dept.department === topDept ? "row-top" : dept.department === bottomDept ? "row-bottom" : ""}>
                                    <td className="dept-name">
                                        {dept.department === topDept    && <span className="dept-badge">🏆 </span>}
                                        {dept.department === bottomDept && <span className="dept-badge">⚠ </span>}
                                        {dept.department}
                                    </td>
                                    <td><strong>{dept.total}</strong></td>
                                    <td className="text-green">{dept.resolved}</td>
                                    <td className="text-blue">{dept.inProgress}</td>
                                    <td className="text-orange">{dept.pending}</td>
                                    <td><span className={getSlaClass(dept.slaCompliance)}>{dept.slaCompliance}%</span></td>
                                    <td>
                                        <div className="perf-bar-track">
                                            <div className={`perf-bar-fill ${getSlaClass(dept.slaCompliance)}-bar`}
                                                style={{ width: `${dept.slaCompliance}%` }}></div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Status + Area ── */}
            <div className="dash-middle">
                <div className="dash-card">
                    <div className="dash-card-header"><h3>Complaint Status Summary</h3></div>
                    <div className="status-summary-grid">
                        {statusDistribution?.map((s) => {
                            const pct = totalComplaints ? Math.round((s.count / totalComplaints) * 100) : 0;
                            return (
                                <div key={s.status} className="status-summary-item">
                                    <span className={`legend-dot dot-${s.status?.toLowerCase().replace(" ", "-")}`}></span>
                                    <div className="status-summary-body">
                                        <div className="status-summary-top">
                                            <span className="status-summary-name">{s.status}</span>
                                            <span className="status-summary-count">{s.count}</span>
                                        </div>
                                        <div className="status-bar-track">
                                            <div className={`status-bar-fill fill-${s.status?.toLowerCase().replace(" ", "-")}`}
                                                style={{ width: `${pct}%` }}></div>
                                        </div>
                                        <span className="status-summary-pct">{pct}%</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="resolution-rate-wrapper">
                        <div className="rate-ring">
                            <span className="rate-ring-value">{resolutionRate}%</span>
                            <span className="rate-ring-label">Resolved</span>
                        </div>
                        <div className="rate-details">
                            <p><strong>{resolvedComplaints}</strong> Resolved</p>
                            <p><strong>{openComplaints}</strong> Still Open</p>
                            <p><strong>{pendingComplaints}</strong> Pending</p>
                        </div>
                    </div>
                </div>

                <div className="dash-card">
                    <div className="dash-card-header">
                        <h3>Geographic Distribution</h3>
                        <span className="card-badge">By Area</span>
                    </div>
                    <div className="area-list">
                        {complaintsByArea?.length === 0 && <p className="empty-row">No area data yet.</p>}
                        {complaintsByArea?.map((a, i) => (
                            <div key={a.area} className="area-row">
                                <span className="area-rank">#{i + 1}</span>
                                <span className="area-name">{a.area}</span>
                                <div className="area-bar-track">
                                    <div className="area-bar-fill" style={{
                                        width: `${complaintsByArea[0]?.count ? (a.count / complaintsByArea[0].count) * 100 : 0}%`
                                    }}></div>
                                </div>
                                <span className="area-count">{a.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Activity Log ── */}
            <div className="dash-card full-width">
                <div className="dash-card-header">
                    <h3>Recent Activity Log</h3>
                    <Link to="/admin/complaints" className="view-all-link">Manage all →</Link>
                </div>

                <div className="date-filter-row no-print">
                    <span className="date-filter-label">Filter by date:</span>
                    <input type="date" className="date-input" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                    <span className="date-sep">to</span>
                    <input type="date" className="date-input" value={dateTo}   onChange={(e) => setDateTo(e.target.value)} />
                    {(dateFrom || dateTo) && (
                        <button className="search-clear" onClick={() => { setDateFrom(""); setDateTo(""); }}>✕ Clear</button>
                    )}
                </div>

                <div className="search-wrapper no-print">
                    <span className="search-icon">🔍</span>
                    <input type="text" className="search-input"
                        placeholder="Search by ref, category, area or status…"
                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    {searchQuery && <button className="search-clear" onClick={() => setSearchQuery("")}>✕</button>}
                </div>

                {(searchQuery || dateFrom || dateTo) && (
                    <span className="filter-count">{filteredComplaints.length} result{filteredComplaints.length !== 1 ? "s" : ""} found</span>
                )}

                <div className="table-scroll">
                    <table className="recent-table">
                        <thead>
                            <tr><th>Ref #</th><th>Category</th><th>Area</th><th>Status</th><th>Priority</th><th>Assigned To</th><th>Date</th></tr>
                        </thead>
                        <tbody>
                            {filteredComplaints.length === 0 && (
                                <tr><td colSpan="7" className="empty-row">
                                    {searchQuery || dateFrom || dateTo ? "No results match your filters." : "No complaints yet."}
                                </td></tr>
                            )}
                            {filteredComplaints.map((c) => (
                                <tr key={c.id} className="clickable-row"
                                    onClick={() => setSelectedComplaint(c)} title="Click to view details">
                                    <td className="ref-num">{c.referenceNumber}</td>
                                    <td>{c.category}</td>
                                    <td>{c.area}</td>
                                    <td><span className={getStatusBadge(c.status)}>{c.status}</span></td>
                                    <td><span className={getPriorityBadge(c.priority)}>{c.priority}</span></td>
                                    <td>{c.assignedTo || <span className="unassigned">Unassigned</span>}</td>
                                    <td>{formatShort(c.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="click-hint no-print">💡 Click any row to view full complaint details</p>
            </div>
        </div>
    );
}

export default AdminOverview;