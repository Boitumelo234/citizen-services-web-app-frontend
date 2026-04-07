import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats, updateComplaintStatus, createComplaint } from "../../services/adminService";
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

// ─── Complaint Submission Modal ───────────────────────────────────────────────
function ComplaintModal({ onClose, onSubmit }) {
    const [form, setForm]         = useState({ category: "", description: "", area: "", priority: "Medium", citizenEmail: "" });
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError]   = useState("");

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        if (!form.category || !form.description || !form.area || !form.citizenEmail) {
            setFormError("All fields are required."); return;
        }
        setSubmitting(true); setFormError("");
        try {
            await onSubmit(form);
            onClose();
        } catch {
            setFormError("Failed to submit. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Log New Complaint</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="modal-body">
                    {formError && <div className="modal-error">{formError}</div>}
                    <div className="form-group">
                        <label>Citizen Email</label>
                        <input name="citizenEmail" placeholder="citizen@email.com"
                            value={form.citizenEmail} onChange={handleChange} className="form-input" />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select name="category" value={form.category} onChange={handleChange} className="form-input">
                            <option value="">— Select category —</option>
                            <option>Water Services</option>
                            <option>Roads &amp; Transport</option>
                            <option>Electricity</option>
                            <option>Waste Management</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Area</label>
                        <select name="area" value={form.area} onChange={handleChange} className="form-input">
                            <option value="">— Select area —</option>
                            <option>Rustenburg CBD</option>
                            <option>Tlhabane</option>
                            <option>Boitekong</option>
                            <option>Meriting</option>
                            <option>Geelhoutpark</option>
                            <option>Waterfall East</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Priority</label>
                        <select name="priority" value={form.priority} onChange={handleChange} className="form-input">
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea name="description" placeholder="Describe the complaint in detail…"
                            value={form.description} onChange={handleChange}
                            className="form-input form-textarea" rows={4} />
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="btn-submit-complaint" onClick={handleSubmit} disabled={submitting}>
                        {submitting ? "Submitting…" : "Submit Complaint"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Complaint Detail Drawer ──────────────────────────────────────────────────
function ComplaintDrawer({ complaint, onClose, onStatusUpdate }) {
    // ✅ ALL hooks declared BEFORE the early return — fixes the ESLint error
    const [newStatus, setNewStatus] = useState("");
    const [saving, setSaving]       = useState(false);

    // Sync newStatus when complaint changes
    useEffect(() => {
        if (complaint) setNewStatus(complaint.status);
    }, [complaint]);

    // ✅ Early return AFTER hooks
    if (!complaint) return null;

    const handleSave = async () => {
        setSaving(true);
        await onStatusUpdate(complaint.id, newStatus);
        setSaving(false);
        onClose();
    };

    const formatDate = (d) => d ? new Date(d).toLocaleString("en-ZA") : "—";

    const getStatusBadge = (st) => ({
        "New": "badge badge-new",
        "In Progress": "badge badge-inprogress",
        "Resolved": "badge badge-resolved",
        "Rejected": "badge badge-rejected"
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
                    <div className="drawer-divider"></div>
                    <div className="drawer-label" style={{ marginBottom: 8 }}>Update Status</div>
                    <select className="form-input" value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}>
                        <option>New</option>
                        <option>In Progress</option>
                        <option>Resolved</option>
                        <option>Rejected</option>
                    </select>
                </div>
                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose}>Close</button>
                    <button className="btn-submit-complaint" onClick={handleSave} disabled={saving}>
                        {saving ? "Saving…" : "Save Status"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main AdminDashboard ──────────────────────────────────────────────────────
function AdminDashboard() {
    const [stats, setStats]               = useState(null);
    const [loading, setLoading]           = useState(true);
    const [error, setError]               = useState(null);
    const [alertDismissed, setAlertDismissed] = useState(false);
    const [darkMode, setDarkMode]         = useState(() => localStorage.getItem("rlm-dark") === "true");
    const [currentTime, setCurrentTime]   = useState(new Date());
    const [lastUpdated, setLastUpdated]   = useState(null);
    const [searchQuery, setSearchQuery]   = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showModal, setShowModal]       = useState(false);
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
            setError("Failed to load dashboard data. Is the server running?");
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
        const interval = setInterval(() => fetchStats(), 60000);
        return () => clearInterval(interval);
    }, [fetchStats]);

    // ✅ All useCountUp hooks called unconditionally at top level
    const animTotal    = useCountUp(stats?.totalComplaints    ?? 0);
    const animOpen     = useCountUp(stats?.openComplaints     ?? 0);
    const animResolved = useCountUp(stats?.resolvedThisMonth  ?? 0);
    const animAvg      = useCountUp(stats?.avgResolutionDays  ?? 0);

    const handleRefresh       = () => fetchStats(true);
    const handlePrint         = () => window.print();
    const handleNewComplaint  = async (formData) => { await createComplaint(formData); fetchStats(); };
    const handleStatusUpdate  = async (id, newStatus) => { await updateComplaintStatus(id, { status: newStatus }); fetchStats(); };

    const formatTime  = (d) => d.toLocaleTimeString("en-ZA",  { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const formatDate  = (d) => d.toLocaleDateString("en-ZA",  { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
    const formatShort = (s) => s ? new Date(s).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" }) : "—";
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

    if (loading) return <div className="dash-loading"><div className="dash-spinner"></div><p>Loading dashboard…</p></div>;
    if (error)   return <div className="dash-error">{error}</div>;

    // ✅ Only destructure what is actually used — removed openComplaints and avgResolutionDays
    const { totalComplaints, resolvedComplaints, pendingComplaints,
            newThisMonth, resolvedThisMonth, newThisWeek,
            statusDistribution, departmentPerformance, complaintsByArea } = stats;

    const slaAlert = departmentPerformance?.find(d => d.slaCompliance < 80);

    return (
        <div className="admin-dashboard">

            {showModal && (
                <ComplaintModal onClose={() => setShowModal(false)} onSubmit={handleNewComplaint} />
            )}
            {selectedComplaint && (
                <ComplaintDrawer
                    complaint={selectedComplaint}
                    onClose={() => setSelectedComplaint(null)}
                    onStatusUpdate={handleStatusUpdate}
                />
            )}

            {/* ── Header ── */}
            <div className="dash-header">
                <div className="dash-header-left">
                    <span className="dash-greeting">Good morning, Administrator</span>
                    <h1 className="dash-title">Control Centre Dashboard</h1>
                    <div className="dash-clock">
                        <span className="clock-time">{formatTime(currentTime)}</span>
                        <span className="clock-date">{formatDate(currentTime)}</span>
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
                    <button className="btn-new-complaint no-print" onClick={() => setShowModal(true)}>
                        + New Complaint
                    </button>
                </div>
            </div>

            {/* ── SLA Alert ── */}
            {slaAlert && !alertDismissed && (
                <div className="sla-alert-banner no-print">
                    <span className="sla-alert-icon">⚠</span>
                    <span>
                        <strong>SLA Alert</strong> — {slaAlert.department} is at {slaAlert.slaCompliance}% SLA compliance (below 80% target).{" "}
                        <Link to="/admin/complaints">View complaints →</Link>
                    </span>
                    <button className="sla-alert-dismiss" onClick={() => setAlertDismissed(true)}>✕</button>
                </div>
            )}

            {/* ── KPI Cards ── */}
            <div className="kpi-grid">
                <div className="kpi-card kpi-total">
                    <div className="kpi-icon">📋</div>
                    <div className="kpi-body">
                        <span className="kpi-label">TOTAL COMPLAINTS</span>
                        <span className="kpi-value">{animTotal}</span>
                        <span className="kpi-sub">+{newThisMonth} this month</span>
                    </div>
                </div>
                <div className="kpi-card kpi-open">
                    <div className="kpi-icon">🔓</div>
                    <div className="kpi-body">
                        <span className="kpi-label">OPEN</span>
                        <span className="kpi-value">{animOpen}</span>
                        <span className="kpi-sub">{pendingComplaints} still pending</span>
                    </div>
                </div>
                <div className="kpi-card kpi-resolved">
                    <div className="kpi-icon">✅</div>
                    <div className="kpi-body">
                        <span className="kpi-label">RESOLVED THIS MONTH</span>
                        <span className="kpi-value">{animResolved}</span>
                        <span className="kpi-sub">{resolvedComplaints} total resolved</span>
                    </div>
                </div>
                <div className="kpi-card kpi-sla">
                    <div className="kpi-icon">⏱</div>
                    <div className="kpi-body">
                        <span className="kpi-label">AVG RESOLUTION</span>
                        <span className="kpi-value">{animAvg}d</span>
                        <span className="kpi-sub">{newThisWeek} new this week</span>
                    </div>
                </div>
            </div>

            {/* ── Status + VS ── */}
            <div className="dash-middle">
                <div className="dash-card">
                    <div className="dash-card-header">
                        <h3>Status Distribution</h3>
                        <span className="card-badge">This Month</span>
                    </div>
                    <div className="status-donut-wrapper">
                        <div className="status-donut">
                            <span className="donut-center-label">{totalComplaints}</span>
                            <span className="donut-center-sub">Total</span>
                        </div>
                        <div className="status-legend">
                            {statusDistribution?.map((s) => (
                                <div key={s.status} className="legend-item">
                                    <span className={`legend-dot dot-${s.status?.toLowerCase().replace(" ", "-")}`}></span>
                                    <span className="legend-label">{s.status}</span>
                                    <span className="legend-count">{s.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="status-bars">
                        {statusDistribution?.map((s) => (
                            <div key={s.status} className="status-bar-row">
                                <span className="status-bar-name">{s.status}</span>
                                <div className="status-bar-track">
                                    <div className={`status-bar-fill fill-${s.status?.toLowerCase().replace(" ", "-")}`}
                                        style={{ width: `${totalComplaints ? (s.count / totalComplaints) * 100 : 0}%` }}></div>
                                </div>
                                <span className="status-bar-count">{s.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="dash-card">
                    <div className="dash-card-header">
                        <h3>New vs Resolved</h3>
                        <span className="card-badge">This Month</span>
                    </div>
                    <div className="vs-chart">
                        {[
                            { label: "New",      count: newThisMonth,      cls: "vs-new" },
                            { label: "Resolved", count: resolvedThisMonth, cls: "vs-resolved" },
                            { label: "Pending",  count: pendingComplaints, cls: "vs-pending" },
                        ].map((item) => (
                            <div key={item.label} className="vs-bar-group">
                                <div className="vs-label">{item.label}</div>
                                <div className="vs-track">
                                    <div className={`vs-fill ${item.cls}`}
                                        style={{ width: `${totalComplaints ? (item.count / totalComplaints) * 100 : 0}%` }}></div>
                                </div>
                                <div className="vs-count">{item.count}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Department Performance ── */}
            <div className="dash-card full-width">
                <div className="dash-card-header">
                    <h3>Department Performance</h3>
                    <div className="dept-legend">
                        <span className="dept-legend-item top">🏆 Top: {topDept}</span>
                        <span className="dept-legend-item bottom">⚠ Needs attention: {bottomDept}</span>
                    </div>
                </div>
                <div className="table-scroll">
                    <table className="dept-table">
                        <thead>
                            <tr>
                                <th>Department</th><th>Submitted</th><th>Resolved</th>
                                <th>In Progress</th><th>Pending</th><th>SLA Compliance</th><th>Performance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departmentPerformance?.length === 0 && (
                                <tr><td colSpan="7" className="empty-row">No department data yet.</td></tr>
                            )}
                            {departmentPerformance?.map((dept) => (
                                <tr key={dept.department}
                                    className={dept.department === topDept ? "row-top" : dept.department === bottomDept ? "row-bottom" : ""}>
                                    <td className="dept-name">
                                        {dept.department === topDept    && <span className="dept-badge">🏆 </span>}
                                        {dept.department === bottomDept && <span className="dept-badge">⚠ </span>}
                                        {dept.department}
                                    </td>
                                    <td>{dept.total}</td>
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

            {/* ── Recent Complaints ── */}
            <div className="dash-bottom">
                <div className="dash-card recent-card">
                    <div className="dash-card-header">
                        <h3>Recent Complaints</h3>
                        <Link to="/admin/complaints" className="view-all-link">View all →</Link>
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
                                <tr><th>Ref #</th><th>Category</th><th>Area</th><th>Status</th><th>Priority</th><th>Date</th></tr>
                            </thead>
                            <tbody>
                                {filteredComplaints.length === 0 && (
                                    <tr><td colSpan="6" className="empty-row">
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
                                        <td>{formatShort(c.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="click-hint no-print">💡 Click any row to view details and update status</p>
                </div>

                <div className="dash-card area-card">
                    <div className="dash-card-header"><h3>Complaints by Area</h3></div>
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
        </div>
    );
}

export default AdminDashboard;