import { useEffect, useState, useCallback } from "react";
import api from "../../api/api";
import "../../styles/admin.css";

const PRIORITY_COLORS = { LOW: "#22c55e", MEDIUM: "#f59e0b", HIGH: "#f97316", CRITICAL: "#ef4444" };
const STATUS_COLORS   = { PENDING: "#ef4444", ASSIGNED: "#f97316", IN_PROGRESS: "#3b82f6", RESOLVED: "#22c55e", DECLINED: "#8b5cf6" };
const TABS = ["Complaints", "Users", "Departments", "Reports", "Settings"];

// ── Helpers ────────────────────────────────────────────
function timeAgo(dateStr) {
    if (!dateStr) return "—";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs  = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);
    if (days > 0)  return `${days}d ago`;
    if (hrs > 0)   return `${hrs}h ago`;
    if (mins > 0)  return `${mins}m ago`;
    return "just now";
}

function exportCSV(data, filename) {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]);
    const rows = data.map(row => headers.map(h => `"${row[h] ?? ""}"`).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
}

// ── Reusables ──────────────────────────────────────────
function Badge({ value, colorMap }) {
    const color = colorMap?.[value] || "#6b7280";
    return <span className="badge" style={{ background: color + "22", color, border: `1px solid ${color}55` }}>{value}</span>;
}

function Modal({ title, onClose, children }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <span className="modal-title">{title}</span>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="modal-body">{children}</div>
            </div>
        </div>
    );
}

// ── Complaint Timeline ─────────────────────────────────
function ComplaintTimeline({ complaint }) {
    const steps = [
        { key: "createdAt",  label: "Submitted",   icon: "📋", color: "#6366f1" },
        { key: "updatedAt",  label: "Last Updated", icon: "⚙️", color: "#3b82f6" },
        { key: "resolvedAt", label: "Resolved",    icon: "✅", color: "#22c55e" },
    ];
    return (
        <div className="timeline">
            {steps.map((s, i) => {
                const date = complaint[s.key];
                const active = !!date;
                return (
                    <div key={i} className={`timeline-step ${active ? "done" : "pending"}`}>
                        <div className="timeline-icon" style={{ borderColor: active ? s.color : "#2d3748", background: active ? s.color + "22" : "transparent" }}>
                            {s.icon}
                        </div>
                        <div className="timeline-info">
                            <div className="timeline-label">{s.label}</div>
                            <div className="timeline-date">
                                {active ? new Date(date).toLocaleString() : "—"}
                            </div>
                        </div>
                        {i < steps.length - 1 && <div className={`timeline-line ${active ? "active" : ""}`} />}
                    </div>
                );
            })}
        </div>
    );
}

// ── COMPLAINTS TAB ─────────────────────────────────────
function ComplaintsTab() {
    const [complaints, setComplaints]   = useState([]);
    const [loading, setLoading]         = useState(true);
    const [filter, setFilter]           = useState({ status: "", priority: "", category: "" });
    const [selected, setSelected]       = useState(null);
    const [staff, setStaff]             = useState([]);
    const [assignStaffId, setAssignStaffId] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [toast, setToast]             = useState(null);
    const [checkedIds, setCheckedIds]   = useState(new Set());

    const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

    const fetchComplaints = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filter.status)   params.set("status", filter.status);
            if (filter.priority) params.set("priority", filter.priority);
            if (filter.category) params.set("category", filter.category);
            const res = await api.get(`/api/admin/complaints?${params}`);
            setComplaints(res.data);
            setCheckedIds(new Set());
        } catch { showToast("Failed to load complaints", "error"); }
        setLoading(false);
    }, [filter]);

    useEffect(() => { fetchComplaints(); }, [fetchComplaints]);
    useEffect(() => { api.get("/api/admin/users?role=STAFF").then(r => setStaff(r.data)).catch(() => {}); }, []);

    const handleAssign = async (id) => {
        if (!assignStaffId) return;
        setActionLoading(true);
        try {
            await api.put(`/api/admin/complaints/${id}/assign`, { staffId: assignStaffId });
            showToast("Complaint assigned successfully");
            fetchComplaints(); setSelected(null);
        } catch { showToast("Failed to assign complaint", "error"); }
        setActionLoading(false);
    };

    const handleEscalate = async (id) => {
        setActionLoading(true);
        try {
            await api.put(`/api/admin/complaints/${id}/escalate`);
            showToast("Complaint escalated to CRITICAL");
            fetchComplaints(); setSelected(null);
        } catch { showToast("Escalation failed", "error"); }
        setActionLoading(false);
    };

    const handleStatus = async (id, status) => {
        setActionLoading(true);
        try {
            await api.put(`/api/admin/complaints/${id}/status`, { status });
            showToast(`Status updated to ${status}`);
            fetchComplaints();
        } catch { showToast("Status update failed", "error"); }
        setActionLoading(false);
    };

    // Bulk actions
    const toggleCheck = (id) => setCheckedIds(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
    const toggleAll   = () => setCheckedIds(checkedIds.size === complaints.length ? new Set() : new Set(complaints.map(c => c.id)));

    const bulkEscalate = async () => {
        if (checkedIds.size === 0) return;
        setActionLoading(true);
        for (const id of checkedIds) { try { await api.put(`/api/admin/complaints/${id}/escalate`); } catch {} }
        showToast(`Escalated ${checkedIds.size} complaint(s)`);
        fetchComplaints(); setActionLoading(false);
    };

    const bulkResolve = async () => {
        if (checkedIds.size === 0) return;
        setActionLoading(true);
        for (const id of checkedIds) { try { await api.put(`/api/admin/complaints/${id}/status`, { status: "RESOLVED" }); } catch {} }
        showToast(`Resolved ${checkedIds.size} complaint(s)`);
        fetchComplaints(); setActionLoading(false);
    };

    // Staff workload map
    const workloadMap = {};
    complaints.forEach(c => {
        if (c.assignedToId && c.status !== "RESOLVED") workloadMap[c.assignedToId] = (workloadMap[c.assignedToId] || 0) + 1;
    });

    return (
        <div className="tab-content">
            {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
            <div className="tab-toolbar">
                <div className="filters">
                    {[["status","Status","PENDING,ASSIGNED,IN_PROGRESS,RESOLVED,DECLINED"],
                        ["priority","Priority","LOW,MEDIUM,HIGH,CRITICAL"],
                        ["category","Category","TRANSPORT,WATER,ELECTRICITY,WASTE"]
                    ].map(([key, label, opts]) => (
                        <select key={key} value={filter[key]}
                                onChange={e => setFilter(f => ({ ...f, [key]: e.target.value }))}
                                className="filter-select">
                            <option value="">{label}: All</option>
                            {opts.split(",").map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    ))}
                    <button className="btn-outline" onClick={fetchComplaints}>↻ Reload</button>
                </div>
                <div className="toolbar-right">
                    {checkedIds.size > 0 && (
                        <div className="bulk-actions">
                            <span className="bulk-count">{checkedIds.size} selected</span>
                            <button className="btn-action escalate" onClick={bulkEscalate} disabled={actionLoading}>🔴 Escalate All</button>
                            <button className="btn-action resolve"  onClick={bulkResolve}  disabled={actionLoading}>✅ Resolve All</button>
                        </div>
                    )}
                    <button className="btn-outline" onClick={() => exportCSV(complaints, "complaints.csv")}>⬇ Export CSV</button>
                    <div className="count-badge">{complaints.length} complaint{complaints.length !== 1 ? "s" : ""}</div>
                </div>
            </div>

            {loading ? <div className="tab-loading">Loading complaints…</div> : (
                <div className="table-wrap">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th><input type="checkbox" onChange={toggleAll} checked={checkedIds.size === complaints.length && complaints.length > 0} /></th>
                            <th>#ID</th><th>Title</th><th>Category</th><th>Area</th>
                            <th>Priority</th><th>Status</th><th>Assigned To</th><th>Age</th><th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {complaints.length === 0 && (
                            <tr><td colSpan={10} className="empty-row">No complaints match the current filters</td></tr>
                        )}
                        {complaints.map(c => (
                            <tr key={c.id} className={checkedIds.has(c.id) ? "row-checked" : ""}>
                                <td><input type="checkbox" checked={checkedIds.has(c.id)} onChange={() => toggleCheck(c.id)} /></td>
                                <td className="mono">#{c.id}</td>
                                <td className="complaint-title">{c.title}</td>
                                <td><Badge value={c.category} colorMap={{ TRANSPORT:"#f59e0b", WATER:"#3b82f6", ELECTRICITY:"#eab308", WASTE:"#22c55e" }} /></td>
                                <td>{c.area}</td>
                                <td><Badge value={c.priority} colorMap={PRIORITY_COLORS} /></td>
                                <td><Badge value={c.status}   colorMap={STATUS_COLORS} /></td>
                                <td className="small">{c.assignedToName || <span className="unassigned-text">Unassigned</span>}</td>
                                <td className="mono small age-cell">{timeAgo(c.createdAt)}</td>
                                <td>
                                    <div className="action-btns">
                                        <button className="act-btn view"     onClick={() => setSelected(c)}              title="View & Manage">👁</button>
                                        <button className="act-btn escalate" onClick={() => handleEscalate(c.id)}        title="Escalate">🔴</button>
                                        {c.status !== "RESOLVED" && <button className="act-btn resolve" onClick={() => handleStatus(c.id, "RESOLVED")} title="Resolve">✅</button>}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selected && (
                <Modal title={`Complaint #${selected.id} — ${selected.title}`} onClose={() => { setSelected(null); setAssignStaffId(""); }}>
                    <div className="detail-grid">
                        <div><label>Category</label><Badge value={selected.category} colorMap={{ TRANSPORT:"#f59e0b", WATER:"#3b82f6", ELECTRICITY:"#eab308", WASTE:"#22c55e" }} /></div>
                        <div><label>Priority</label><Badge value={selected.priority} colorMap={PRIORITY_COLORS} /></div>
                        <div><label>Status</label><Badge value={selected.status} colorMap={STATUS_COLORS} /></div>
                        <div><label>Area</label><span>{selected.area}</span></div>
                        <div><label>Citizen</label><span>{selected.citizenName || selected.citizenEmail || "—"}</span></div>
                        <div><label>Department</label><span>{selected.departmentName || "—"}</span></div>
                        <div className="full"><label>Description</label><p className="desc-text">{selected.description || "No description provided."}</p></div>
                        {selected.latitude && <div><label>Location</label><span className="mono">{selected.latitude.toFixed(4)}, {selected.longitude?.toFixed(4)}</span></div>}
                    </div>

                    {/* Timeline */}
                    <div className="modal-section">
                        <div className="section-label">📅 Complaint Timeline</div>
                        <ComplaintTimeline complaint={selected} />
                    </div>

                    {/* Assign — with workload indicator */}
                    <div className="modal-section">
                        <div className="section-label">🔧 Assign to Staff</div>
                        <div className="assign-row">
                            <select className="filter-select" value={assignStaffId} onChange={e => setAssignStaffId(e.target.value)}>
                                <option value="">Select staff member…</option>
                                {staff.map(s => {
                                    const load = workloadMap[s.id] || 0;
                                    const indicator = load >= 5 ? "⚠️ Busy" : load >= 3 ? "🟡" : "✅";
                                    return (
                                        <option key={s.id} value={s.id}>
                                            {indicator} {s.fullName || s.email} ({load} active) {s.departmentName ? `— ${s.departmentName}` : ""}
                                        </option>
                                    );
                                })}
                            </select>
                            <button className="btn-primary" disabled={!assignStaffId || actionLoading} onClick={() => handleAssign(selected.id)}>
                                {actionLoading ? "Assigning…" : "Assign"}
                            </button>
                        </div>
                    </div>

                    <div className="modal-section">
                        <div className="section-label">⚡ Quick Actions</div>
                        <div className="quick-actions">
                            <button className="btn-action escalate"   onClick={() => handleEscalate(selected.id)}                          disabled={actionLoading}>🔴 Escalate to Critical</button>
                            <button className="btn-action resolve"    onClick={() => handleStatus(selected.id, "RESOLVED")}                 disabled={actionLoading}>✅ Mark Resolved</button>
                            <button className="btn-action inprogress" onClick={() => handleStatus(selected.id, "IN_PROGRESS")}              disabled={actionLoading}>⚙ Set In Progress</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

function UsersTab() {
    const [users, setUsers]       = useState([]);
    const [departments, setDepts] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [roleFilter, setRole]   = useState("");
    const [showAdd, setShowAdd]   = useState(false);
    const [form, setForm]         = useState({ email:"", password:"", fullName:"", phone:"", role:"CITIZEN", departmentId:"" });
    const [saving, setSaving]     = useState(false);
    const [toast, setToast]       = useState(null);
    const showToast = (msg, type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

    const fetch = useCallback(async () => {
        setLoading(true);
        try {
            const [uRes, dRes] = await Promise.all([
                api.get(roleFilter ? `/api/admin/users?role=${roleFilter}` : "/api/admin/users"),
                api.get("/api/admin/departments"),
            ]);
            setUsers(uRes.data); setDepts(dRes.data);
        } catch { showToast("Failed to load users","error"); }
        setLoading(false);
    }, [roleFilter]);

    useEffect(() => { fetch(); }, [fetch]);

    const handleAdd = async () => {
        setSaving(true);
        try {
            await api.post("/api/admin/users", form);
            showToast("User created successfully");
            setShowAdd(false);
            setForm({ email:"", password:"", fullName:"", phone:"", role:"CITIZEN", departmentId:"" });
            fetch();
        } catch (err) {
            console.error(err);
            showToast(err.response?.data?.message || "Failed to create user","error");
        }
        setSaving(false);
    };

    const toggleActive = async (user) => {
        try {
            await api.put(`/api/admin/users/${user.id}`, { active: !user.active });
            showToast(user.active ? "Account deactivated" : "Account activated");
            fetch();
        } catch { showToast("Update failed","error"); }
    };

    const deleteUser = async (id) => {
        if (!window.confirm("Delete this user? This cannot be undone.")) return;
        try { await api.delete(`/api/admin/users/${id}`); showToast("User deleted"); fetch(); }
        catch { showToast("Delete failed","error"); }
    };

    return (
        <div className="tab-content">
            {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
            <div className="tab-toolbar">
                <div className="filters">
                    <select className="filter-select" value={roleFilter} onChange={e => setRole(e.target.value)}>
                        <option value="">All Roles</option>
                        <option value="ADMIN">Admin</option>
                        <option value="STAFF">Staff</option>
                        <option value="CITIZEN">Citizen</option>
                    </select>
                    <button className="btn-outline" onClick={fetch}>↻ Reload</button>
                </div>
                <div className="toolbar-right">
                    <button className="btn-outline" onClick={() => exportCSV(users, "users.csv")}>⬇ Export CSV</button>
                    <button className="btn-primary" onClick={() => setShowAdd(true)}>+ Add User</button>
                </div>
            </div>

            {loading ? <div className="tab-loading">Loading users…</div> : (
                <div className="table-wrap">
                    <table className="data-table">
                        <thead>
                        <tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Department</th><th>Status</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                        {users.length === 0 && <tr><td colSpan={7} className="empty-row">No users found</td></tr>}
                        {users.map(u => (
                            <tr key={u.id}>
                                <td className="mono">#{u.id}</td>
                                <td>{u.fullName || "—"}</td>
                                <td className="small">{u.email}</td>
                                <td><Badge value={u.role} colorMap={{ ADMIN:"#ef4444", STAFF:"#f97316", CITIZEN:"#3b82f6" }} /></td>
                                <td>{u.departmentName || "—"}</td>
                                <td><span className={`status-pill ${u.active ? "active" : "inactive"}`}>{u.active ? "Active" : "Inactive"}</span></td>
                                <td>
                                    <div className="action-btns">
                                        <button className="act-btn" onClick={() => toggleActive(u)} title={u.active ? "Deactivate" : "Activate"}>
                                            {u.active ? "🔴" : "🟢"}
                                        </button>
                                        <button className="act-btn delete" onClick={() => deleteUser(u.id)} title="Delete">🗑</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showAdd && (
                <Modal title="Add New User" onClose={() => setShowAdd(false)}>
                    <div className="form-grid">
                        {[["fullName","Full Name","text"],["email","Email","email"],["password","Password","password"],["phone","Phone","text"]].map(([k,l,t]) => (
                            <div key={k} className="form-field">
                                <label>{l}</label>
                                <input type={t} value={form[k]} onChange={e => setForm(f => ({...f,[k]:e.target.value}))} className="form-input" />
                            </div>
                        ))}

                        <div className="form-field">
                            <label>Role</label>
                            <select className="form-input" value={form.role} onChange={e => setForm(f => ({...f,role:e.target.value}))}>
                                <option value="">Select role</option>
                                <option value="STAFF">Staff</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>

                        {form.role === "STAFF" && (
                            <div className="form-field">
                                <label>Department</label>
                                <select className="form-input" value={form.departmentId} onChange={e => setForm(f => ({...f,departmentId:e.target.value}))}>
                                    <option value="">Select department…</option>
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button className="btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>

                        <button
                            className="btn-primary"
                            onClick={handleAdd}
                            disabled={
                                saving ||
                                !form.fullName ||
                                !form.email ||
                                !form.password ||
                                !form.phone ||
                                !form.role ||
                                (form.role === "STAFF" && !form.departmentId)
                            }
                        >
                            {saving ? "Creating…" : "Create User"}
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
}

// ── DEPARTMENTS TAB ────────────────────────────────────
function DepartmentsTab() {
    const [departments, setDepts] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [showAdd, setShowAdd]   = useState(false);
    const [form, setForm]         = useState({ name: "", description: "" });
    const [saving, setSaving]     = useState(false);
    const [toast, setToast]       = useState(null);
    const showToast = (msg,type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

    const fetch = useCallback(async () => {
        setLoading(true);
        try { const r = await api.get("/api/admin/departments"); setDepts(r.data); }
        catch { showToast("Failed to load departments","error"); }
        setLoading(false);
    }, []);

    useEffect(() => { fetch(); }, [fetch]);

    const handleAdd = async () => {
        setSaving(true);
        try {
            await api.post("/api/admin/departments", form);
            showToast("Department created");
            setShowAdd(false); setForm({ name: "", description: "" }); fetch();
        } catch { showToast("Failed to create department","error"); }
        setSaving(false);
    };

    const ICONS = { TRANSPORT:"🚌", WATER:"💧", ELECTRICITY:"⚡", WASTE:"♻️" };

    return (
        <div className="tab-content">
            {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}

            {/* 🔴 BUTTON REMOVED HERE */}
            <div className="tab-toolbar">
                <div />
            </div>

            {loading ? <div className="tab-loading">Loading departments…</div> : (
                <div className="dept-cards">
                    {departments.length === 0 && <div className="empty-state">No departments yet.</div>}
                    {departments.map(d => (
                        <div key={d.id} className="dept-card">
                            <div className="dept-card-icon">{ICONS[d.name] || "🏢"}</div>
                            <div className="dept-card-body">
                                <div className="dept-card-name">{d.name}</div>
                                <div className="dept-card-desc">{d.description || "No description"}</div>
                                <div className="dept-card-stats">
                                    <span>👷 {d.staffCount} staff</span>
                                    <span>📋 {d.activeComplaints} active</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showAdd && (
                <Modal title="Create Department" onClose={() => setShowAdd(false)}>
                    <div className="form-grid">
                        <div className="form-field full">
                            <label>Department Name</label>
                            <select className="form-input" value={form.name} onChange={e => setForm(f => ({...f,name:e.target.value}))}>
                                <option value="">Select type…</option>
                                {["TRANSPORT","WATER","ELECTRICITY","WASTE"].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>
                        <div className="form-field full">
                            <label>Description</label>
                            <input type="text" value={form.description} onChange={e => setForm(f => ({...f,description:e.target.value}))} className="form-input" placeholder="Optional description…" />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
                        <button className="btn-primary" onClick={handleAdd} disabled={saving || !form.name}>
                            {saving ? "Creating…" : "Create Department"}
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
}

// ── REPORTS TAB ────────────────────────────────────────
function ReportsTab() {
    const [period, setPeriod]   = useState(7);
    const [summary, setSummary] = useState(null);
    const [perf, setPerf]       = useState([]);
    const [loading, setLoading] = useState(true);

    const fetch = useCallback(async () => {
        setLoading(true);
        try {
            const [sRes, pRes] = await Promise.all([
                api.get(`/api/admin/reports/summary?days=${period}`),
                api.get("/api/admin/reports/staff-performance"),
            ]);
            setSummary(sRes.data); setPerf(pRes.data);
        } catch {}
        setLoading(false);
    }, [period]);

    useEffect(() => { fetch(); }, [fetch]);

    return (
        <div className="tab-content">
            <div className="tab-toolbar">
                <div className="filters">
                    <select className="filter-select" value={period} onChange={e => setPeriod(Number(e.target.value))}>
                        <option value={7}>Last 7 days</option>
                        <option value={14}>Last 14 days</option>
                        <option value={30}>Last 30 days</option>
                    </select>
                    <button className="btn-outline" onClick={fetch}>↻ Reload</button>
                </div>
                <button className="btn-outline" onClick={() => perf.length && exportCSV(perf, "staff-performance.csv")}>⬇ Export Performance CSV</button>
            </div>

            {loading ? <div className="tab-loading">Loading reports…</div> : (
                <>
                    {summary && (
                        <div className="report-summary">
                            <div className="report-card">
                                <div className="report-num">{summary.totalComplaints}</div>
                                <div className="report-label">Total ({summary.period})</div>
                            </div>
                            <div className="report-card">
                                <div className="report-num">{summary.resolved}</div>
                                <div className="report-label">Resolved</div>
                            </div>
                            <div className="report-card">
                                <div className="report-num" style={{ color: summary.resolutionRate >= 70 ? "#22c55e" : summary.resolutionRate >= 40 ? "#f59e0b" : "#ef4444" }}>
                                    {summary.resolutionRate?.toFixed(1)}%
                                </div>
                                <div className="report-label">Resolution Rate</div>
                            </div>
                        </div>
                    )}

                    {summary?.hotspots && (
                        <div className="report-section">
                            <div className="section-label">📍 Hotspot Areas</div>
                            <div className="hotspot-list">
                                {Object.entries(summary.hotspots).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([area,count],i)=>(
                                    <div key={i} className="hotspot-row">
                                        <span className="hotspot-rank">#{i+1}</span>
                                        <span className="hotspot-area">{area}</span>
                                        <span className="hotspot-count">{count}</span>
                                    </div>
                                ))}
                                {Object.keys(summary.hotspots).length === 0 && <div className="no-data">No data</div>}
                            </div>
                        </div>
                    )}

                    <div className="report-section">
                        <div className="section-label">👷 Staff Performance</div>
                        {perf.length === 0 ? <div className="no-data">No staff data yet</div> : (
                            <div className="table-wrap">
                                <table className="data-table">
                                    <thead>
                                    <tr><th>Staff</th><th>Department</th><th>Assigned</th><th>Resolved</th><th>Declined</th><th>Rate</th></tr>
                                    </thead>
                                    <tbody>
                                    {perf.map((s,i) => (
                                        <tr key={i}>
                                            <td>{s.name}</td>
                                            <td>{s.department}</td>
                                            <td className="mono">{s.assigned}</td>
                                            <td className="mono" style={{color:"#22c55e"}}>{s.resolved}</td>
                                            <td className="mono" style={{color:"#ef4444"}}>{s.declined}</td>
                                            <td>
                                                <div className="perf-bar-row">
                                                    <div className="perf-bar-track">
                                                        <div className="perf-bar-fill" style={{width:`${s.resolutionRate}%`}} />
                                                    </div>
                                                    <span className="mono small">{s.resolutionRate?.toFixed(0)}%</span>
                                                </div>
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
    );
}

// ── SETTINGS TAB ───────────────────────────────────────
function SettingsTab() {
    return (
        <div className="tab-content">
            <div className="settings-grid">
                <div className="settings-card">
                    <div className="settings-card-title">📂 Complaint Categories</div>
                    <div className="settings-list">
                        {["TRANSPORT — Potholes, road damage, traffic lights","WATER — Leaks, supply issues, burst pipes","ELECTRICITY — Outages, faulty street lights","WASTE — Litter, illegal dumping, bin collection"].map((c,i) => (
                            <div key={i} className="settings-item">{c}</div>
                        ))}
                    </div>
                </div>
                <div className="settings-card">
                    <div className="settings-card-title">⚡ Priority Rules</div>
                    <div className="settings-list">
                        {[["🟢 LOW","Routine, non-urgent"],["🟡 MEDIUM","Response within 5 days"],["🟠 HIGH","Response within 24 hours"],["🔴 CRITICAL","Immediate escalation"]].map(([p,r],i) => (
                            <div key={i} className="settings-item"><strong>{p}</strong> — {r}</div>
                        ))}
                    </div>
                </div>
                <div className="settings-card">
                    <div className="settings-card-title">⏱ SLA Thresholds</div>
                    <div className="settings-list">
                        <div className="settings-item">Overdue trigger: <strong>3 days</strong> unresolved</div>
                        <div className="settings-item">Auto-escalation after: <strong>7 days</strong></div>
                        <div className="settings-item">Dashboard refresh: every <strong>30 seconds</strong></div>
                    </div>
                </div>
                <div className="settings-card">
                    <div className="settings-card-title">🔐 Admin Access</div>
                    <div className="settings-list">
                        <div className="settings-item">Admin email set in <code>application.properties</code></div>
                        <div className="settings-item">JWT token required for all API calls</div>
                        <div className="settings-item">Token expires after <strong>24 hours</strong></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── MAIN ───────────────────────────────────────────────
export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("Complaints");
    return (
        <div className="admin-dashboard">
            <div className="dash-header">
                <div>
                    <h1 className="dash-title">Admin Management Panel</h1>
                    <p className="dash-subtitle">Rustenburg Local Municipality — complaint management system</p>
                </div>
            </div>
            <div className="dash-tabs">
                {TABS.map(tab => (
                    <button key={tab} className={`dash-tab ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
                        {{Complaints:"📋",Users:"👥",Departments:"🏢",Reports:"📊",Settings:"⚙️"}[tab]} {tab}
                    </button>
                ))}
            </div>
            <div className="dash-body">
                {activeTab === "Complaints"  && <ComplaintsTab />}
                {activeTab === "Users"       && <UsersTab />}
                {activeTab === "Departments" && <DepartmentsTab />}
                {activeTab === "Reports"     && <ReportsTab />}
                {activeTab === "Settings"    && <SettingsTab />}
            </div>
        </div>
    );
}