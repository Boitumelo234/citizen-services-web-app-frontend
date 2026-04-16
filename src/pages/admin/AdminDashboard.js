// AdminDashboard.jsx – Light theme, citizen styling
// import { useEffect, useState, useCallback, useRef } from "react";
import { useEffect, useState, useCallback } from "react";
import api from "../../api/api";
import "../../styles/admin.css";

const PRIORITY_COLORS = { LOW: "#22c55e", MEDIUM: "#f59e0b", HIGH: "#f97316", CRITICAL: "#ef4444" };
const STATUS_COLORS   = { PENDING: "#ef4444", ASSIGNED: "#f97316", IN_PROGRESS: "#3b82f6", RESOLVED: "#22c55e", DECLINED: "#8b5cf6" };
const TABS = ["Complaints", "Users", "Departments", "Reports", "Settings"];

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

// Toast – light theme
function Toast({ msg, type }) {
    if (!msg) return null;
    const colors = {
        success: { bg: "#dcfce7", border: "#bbf7d0", text: "#166534" },
        error:   { bg: "#fee2e2", border: "#fecaca", text: "#b91c1c" },
        info:    { bg: "#eff6ff", border: "#bfdbfe", text: "#1e40af" },
    };
    const c = colors[type] || colors.info;
    return (
        <div style={{
            position: "fixed", top: "1.25rem", right: "1.5rem", zIndex: 999999,
            padding: "0.75rem 1.25rem",
            background: c.bg, border: `1px solid ${c.border}`,
            borderRadius: "0.75rem", color: c.text,
            fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.875rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            animation: "fadeInDown 0.2s ease",
            display: "flex", alignItems: "center", gap: "0.5rem",
            maxWidth: "380px",
        }}>
            {type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"} {msg}
        </div>
    );
}

// Modal – light theme
function Modal({ title, onClose, children, wide = false }) {
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const handler = (e) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener("keydown", handler);
        };
    }, [onClose]);

    return (
        <div
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            style={{
                position: "fixed", inset: 0,
                background: "rgba(0,0,0,0.4)",
                backdropFilter: "blur(4px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                zIndex: 99999, padding: "1.25rem",
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "1.5rem",
                    width: "100%",
                    maxWidth: wide ? "860px" : "620px",
                    maxHeight: "90vh",
                    display: "flex", flexDirection: "column",
                    boxShadow: "0 20px 35px -8px rgba(0,0,0,0.2)",
                    overflow: "hidden",
                }}
            >
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "1rem 1.4rem",
                    borderBottom: "1px solid #e5e7eb",
                    background: "#ffffff",
                    flexShrink: 0,
                }}>
                    <h3 style={{
                        margin: 0, color: "#0f172a",
                        fontFamily: "'Satoshi', 'Inter', sans-serif",
                        fontSize: "1rem", fontWeight: 700,
                    }}>
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        style={{
                            width: 32, height: 32, borderRadius: "50%",
                            border: "1px solid #e5e7eb", background: "#f9fafb",
                            color: "#4b5563", fontSize: "1.1rem", lineHeight: 1,
                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "#9ca3af"; e.currentTarget.style.color = "#111827"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#4b5563"; }}
                    >
                        ✕
                    </button>
                </div>
                <div style={{ overflowY: "auto", flex: 1, padding: "1.4rem" }}>
                    {children}
                </div>
            </div>
            <style>{`@keyframes fadeInDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
    );
}

// Badge – light theme
function Badge({ value, colorMap }) {
    const color = colorMap?.[value] || "#6b7280";
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: "0.3rem",
            padding: "0.2rem 0.65rem", borderRadius: "999px",
            background: color + "22", color,
            border: `1px solid ${color}55`,
            fontFamily: "'Inter', monospace",
            fontSize: "0.7rem", fontWeight: 600,
            whiteSpace: "nowrap",
        }}>
            {value}
        </span>
    );
}

// Complaint timeline – light
function ComplaintTimeline({ complaint }) {
    const steps = [
        { key: "createdAt",  label: "Submitted",    icon: "📋", color: "#3b82f6" },
        { key: "updatedAt",  label: "Last Updated",  icon: "⚙️", color: "#6b7280" },
        { key: "resolvedAt", label: "Resolved",      icon: "✅", color: "#22c55e" },
    ];
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {steps.map((s, i) => {
                const date = complaint[s.key];
                const active = !!date;
                return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                            border: `2px solid ${active ? s.color : "#e5e7eb"}`,
                            background: active ? s.color + "22" : "#f9fafb",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "1rem",
                        }}>
                            {s.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 600, color: active ? "#111827" : "#9ca3af" }}>
                                {s.label}
                            </p>
                            <p style={{ margin: 0, fontFamily: "monospace", fontSize: "0.72rem", color: active ? "#4b5563" : "#d1d5db" }}>
                                {active ? new Date(date).toLocaleString() : "—"}
                            </p>
                        </div>
                        {active && <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, flexShrink: 0 }} />}
                    </div>
                );
            })}
        </div>
    );
}

// function SectionLabel({ children }) {
//     return (
//         <p style={{
//             margin: "1.25rem 0 0.65rem",
//             fontSize: "0.7rem", fontWeight: 700,
//             color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em",
//             paddingBottom: "0.5rem", borderBottom: "1px solid #e5e7eb",
//         }}>
//             {children}
//         </p>
//     );
// }

const inputStyle = {
    width: "100%", boxSizing: "border-box",
    background: "#ffffff", border: "1px solid #d1d5db",
    borderRadius: "0.75rem", padding: "0.65rem 0.85rem",
    color: "#111827", fontFamily: "'Inter', sans-serif", fontSize: "0.875rem",
    outline: "none",
    transition: "border-color 0.15s",
};

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

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchComplaints = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filter.status)   params.set("status", filter.status);
            if (filter.priority) params.set("priority", filter.priority);
            if (filter.category) params.set("category", filter.category);

            const res = await api.get(`/admin/complaints?${params}`);
            setComplaints(res.data);
            setCheckedIds(new Set());
        } catch {
            showToast("Failed to load complaints", "error");
        }
        setLoading(false);
    }, [filter]);

    useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

    useEffect(() => {
        api.get("/admin/users?role=STAFF").then(r => setStaff(r.data)).catch(() => {});
    }, []);

    const handleAssign = async (id) => {
        if (!assignStaffId) return;
        setActionLoading(true);
        try {
            await api.put(`/admin/complaints/${id}/assign`, { staffId: assignStaffId });
            showToast("Complaint assigned successfully");
            fetchComplaints();
            setSelected(null);
            setAssignStaffId("");
        } catch {
            showToast("Failed to assign complaint", "error");
        }
        setActionLoading(false);
    };

    const handleEscalate = async (id) => {
        setActionLoading(true);
        try {
            await api.put(`/admin/complaints/${id}/escalate`);
            showToast("Complaint escalated to CRITICAL");
            fetchComplaints();
            setSelected(null);
        } catch {
            showToast("Escalation failed", "error");
        }
        setActionLoading(false);
    };

    const handleStatus = async (id, status) => {
        setActionLoading(true);
        try {
            await api.put(`/admin/complaints/${id}/status`, { status });
            showToast(`Status updated to ${status}`);
            fetchComplaints();
        } catch {
            showToast("Status update failed", "error");
        }
        setActionLoading(false);
    };

    // Bulk actions
    const toggleCheck = (id) => setCheckedIds(prev => {
        const s = new Set(prev);
        s.has(id) ? s.delete(id) : s.add(id);
        return s;
    });

    const toggleAll = () => setCheckedIds(
        checkedIds.size === complaints.length ? new Set() : new Set(complaints.map(c => c.id))
    );

    const bulkEscalate = async () => {
        if (checkedIds.size === 0) return;
        setActionLoading(true);
        for (const id of checkedIds) {
            try { await api.put(`/admin/complaints/${id}/escalate`); } catch {}
        }
        showToast(`Escalated ${checkedIds.size} complaint(s)`);
        fetchComplaints();
        setActionLoading(false);
    };

    const bulkResolve = async () => {
        if (checkedIds.size === 0) return;
        setActionLoading(true);
        for (const id of checkedIds) {
            try { await api.put(`/admin/complaints/${id}/status`, { status: "RESOLVED" }); } catch {}
        }
        showToast(`Resolved ${checkedIds.size} complaint(s)`);
        fetchComplaints();
        setActionLoading(false);
    };

    // Workload map
    const workloadMap = {};
    complaints.forEach(c => {
        if (c.assignedToId && c.status !== "RESOLVED") {
            workloadMap[c.assignedToId] = (workloadMap[c.assignedToId] || 0) + 1;
        }
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

            {loading ? (
                <div className="tab-loading">Loading complaints…</div>
            ) : (
                <div className="table-wrap">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th><input type="checkbox" onChange={toggleAll} checked={checkedIds.size === complaints.length && complaints.length > 0} /></th>
                            <th>#ID</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Area</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Assigned To (Email)</th>
                            <th>Photo</th>
                            <th>Age</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {complaints.length === 0 && (
                            <tr><td colSpan={11} className="empty-row">No complaints match the current filters</td></tr>
                        )}
                        {complaints.map(c => (
                            <tr key={c.id} className={checkedIds.has(c.id) ? "row-checked" : ""}>
                                <td><input type="checkbox" checked={checkedIds.has(c.id)} onChange={() => toggleCheck(c.id)} /></td>
                                <td className="mono">#{c.id}</td>
                                <td className="complaint-title">{c.title}</td>
                                <td><Badge value={c.category} colorMap={{ TRANSPORT:"#f59e0b", WATER:"#3b82f6", ELECTRICITY:"#eab308", WASTE:"#22c55e" }} /></td>
                                <td>{c.area}</td>
                                <td><Badge value={c.priority} colorMap={PRIORITY_COLORS} /></td>
                                <td><Badge value={c.status} colorMap={STATUS_COLORS} /></td>

                                {/* Assigned Staff Email */}
                                <td className="assigned-email-cell">
                                    {c.assignedToUser?.email ||
                                        c.assignedToEmail ||
                                        c.assignedTo ||
                                        "— Unassigned"}
                                </td>

                                {/* Complaint Photo Thumbnail */}
                                <td className="photo-cell">
                                    {c.photoUrl ? (
                                        <img
                                            src={c.photoUrl}
                                            alt="Complaint"
                                            className="complaint-thumbnail"
                                            onClick={() => setSelected(c)}
                                            title="Click to view full size"
                                        />
                                    ) : (
                                        <span className="no-photo">—</span>
                                    )}
                                </td>

                                <td className="mono small age-cell">{timeAgo(c.createdAt)}</td>
                                <td>
                                    <div className="action-btns">
                                        <button className="act-btn view" onClick={() => setSelected(c)} title="View & Manage">👁</button>
                                        <button className="act-btn escalate" onClick={() => handleEscalate(c.id)} title="Escalate">🔴</button>
                                        {c.status !== "RESOLVED" && (
                                            <button className="act-btn resolve" onClick={() => handleStatus(c.id, "RESOLVED")} title="Resolve">✅</button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ==================== COMPLAINT DETAIL MODAL ==================== */}
            {selected && (
                <Modal title={`Complaint #${selected.id} — ${selected.title}`} onClose={() => {
                    setSelected(null);
                    setAssignStaffId("");
                }}>
                    <div className="detail-grid">
                        <div><label>Category</label><Badge value={selected.category} colorMap={{ TRANSPORT:"#f59e0b", WATER:"#3b82f6", ELECTRICITY:"#eab308", WASTE:"#22c55e" }} /></div>
                        <div><label>Priority</label><Badge value={selected.priority} colorMap={PRIORITY_COLORS} /></div>
                        <div><label>Status</label><Badge value={selected.status} colorMap={STATUS_COLORS} /></div>
                        <div><label>Area</label><span>{selected.area}</span></div>
                        <div><label>Citizen Email</label><span>{selected.citizenEmail || selected.user?.email || "—"}</span></div>
                        <div><label>Department</label><span>{selected.departmentName || "—"}</span></div>

                        {/* Complaint Photo - Full View */}
                        {selected.photoUrl && (
                            <div className="full photo-section">
                                <label>Complaint Photo</label>
                                <img
                                    src={selected.photoUrl}
                                    alt="Complaint evidence"
                                    className="complaint-photo-full"
                                />
                            </div>
                        )}

                        {/* Assigned Staff Email */}
                        <div className="full assigned-section">
                            <label>Assigned To (Staff Email)</label>
                            <div className="assigned-email-box">
                                {selected.assignedToUser?.email ||
                                    selected.assignedToEmail ||
                                    selected.assignedTo ||
                                    "Not yet assigned"}
                            </div>
                        </div>

                        <div className="full"><label>Description</label><p className="desc-text">{selected.description || "No description provided."}</p></div>
                    </div>

                    {/* Timeline */}
                    <div className="modal-section">
                        <div className="section-label">📅 Complaint Timeline</div>
                        <ComplaintTimeline complaint={selected} />
                    </div>

                    {/* Assign to Staff */}
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
                                            {indicator} {s.email} ({load} active)
                                        </option>
                                    );
                                })}
                            </select>
                            <button
                                className="btn-primary"
                                disabled={!assignStaffId || actionLoading}
                                onClick={() => handleAssign(selected.id)}
                            >
                                {actionLoading ? "Assigning…" : "Assign"}
                            </button>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="modal-section">
                        <div className="section-label">⚡ Quick Actions</div>
                        <div className="quick-actions">
                            <button className="btn-action escalate" onClick={() => handleEscalate(selected.id)} disabled={actionLoading}>🔴 Escalate to Critical</button>
                            <button className="btn-action resolve" onClick={() => handleStatus(selected.id, "RESOLVED")} disabled={actionLoading}>✅ Mark Resolved</button>
                            <button className="btn-action inprogress" onClick={() => handleStatus(selected.id, "IN_PROGRESS")} disabled={actionLoading}>⚙ Set In Progress</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

// ── USERS TAB ─────────────────────────────────────────────────
function UsersTab() {
    const [users, setUsers]           = useState([]);
    const [departments, setDepts]     = useState([]);
    const [loading, setLoading]       = useState(true);
    const [roleFilter, setRole]       = useState("");
    const [showAdd, setShowAdd]       = useState(false);
    const [form, setForm]             = useState({ email: "", password: "", fullName: "", phone: "", role: "CITIZEN", departmentId: "" });
    const [saving, setSaving]         = useState(false);
    const [toast, setToast]           = useState(null);
    const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const [uRes, dRes] = await Promise.all([
                api.get(roleFilter ? `/admin/users?role=${roleFilter}` : "/admin/users"),
                api.get("/admin/departments"),
            ]);
            setUsers(uRes.data); setDepts(dRes.data);
        } catch { showToast("Failed to load users", "error"); }
        setLoading(false);
    }, [roleFilter]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const handleAdd = async () => {
        setSaving(true);
        try {
            await api.post("/admin/users", form);
            showToast("User created successfully");
            setShowAdd(false);
            setForm({ email: "", password: "", fullName: "", phone: "", role: "CITIZEN", departmentId: "" });
            fetchAll();
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to create user", "error");
        }
        setSaving(false);
    };

    const toggleActive = async (user) => {
        try {
            await api.put(`/admin/users/${user.id}`, { active: !user.active });
            showToast(user.active ? "Account deactivated" : "Account activated");
            fetchAll();
        } catch { showToast("Update failed", "error"); }
    };

    const deleteUser = async (id) => {
        if (!window.confirm("Delete this user? This cannot be undone.")) return;
        try { await api.delete(`/admin/users/${id}`); showToast("User deleted"); fetchAll(); }
        catch { showToast("Delete failed", "error"); }
    };

    const canCreate = form.fullName && form.email && form.password && form.phone && form.role && (form.role !== "STAFF" || form.departmentId);

    return (
        <div className="tab-content">
            <Toast msg={toast?.msg} type={toast?.type} />

            <div className="tab-toolbar">
                <div className="filters">
                    <select className="filter-select" value={roleFilter} onChange={e => setRole(e.target.value)}>
                        <option value="">All Roles</option>
                        <option value="ADMIN">Admin</option>
                        <option value="STAFF">Staff</option>
                        <option value="CITIZEN">Citizen</option>
                    </select>
                    <button className="btn-outline" onClick={fetchAll}>↻ Reload</button>
                </div>
                <div className="toolbar-right">
                    <button className="btn-outline" onClick={() => exportCSV(users, "users.csv")}>⬇ Export CSV</button>
                    <button className="btn-primary" onClick={() => setShowAdd(true)}>+ Add User</button>
                </div>
            </div>

            {loading ? (
                <div className="tab-loading">
                    <div style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid #e5e7eb", borderTopColor: "#3b82f6", animation: "spin 0.7s linear infinite", margin: "0 auto 0.75rem" }} />
                    Loading users…
                </div>
            ) : (
                <div className="table-wrap">
                    <table className="data-table">
                        <thead>
                        <tr><th>#ID</th><th>Name</th><th>Email</th><th>Role</th><th>Department</th><th>Status</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                        {users.length === 0 && (
                            <tr><td colSpan={7} className="empty-row">
                                <span style={{ fontSize: "1.5rem", display: "block", marginBottom: "0.4rem" }}>👥</span>
                                No users found
                            </td></tr>
                        )}
                        {users.map(u => (
                            <tr key={u.id}>
                                <td className="mono" style={{ color: "#3b82f6" }}>#{u.id}</td>
                                <td style={{ fontWeight: 600, color: "#111827" }}>{u.fullName || "—"}</td>
                                <td style={{ fontSize: "0.8rem", color: "#4b5563" }}>{u.email}</td>
                                <td><Badge value={u.role} colorMap={{ ADMIN: "#ef4444", STAFF: "#f97316", CITIZEN: "#3b82f6" }} /></td>
                                <td style={{ fontSize: "0.8rem", color: "#6b7280" }}>{u.departmentName || "—"}</td>
                                <td>
                                    <span style={{
                                        display: "inline-flex", alignItems: "center", gap: "0.35rem",
                                        padding: "0.2rem 0.65rem", borderRadius: "999px",
                                        background: u.active ? "#dcfce7" : "#f3f4f6",
                                        color: u.active ? "#166534" : "#6b7280",
                                        border: `1px solid ${u.active ? "#bbf7d0" : "#e5e7eb"}`,
                                        fontSize: "0.72rem", fontWeight: 600,
                                    }}>
                                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: u.active ? "#22c55e" : "#9ca3af" }} />
                                        {u.active ? "Active" : "Inactive"}
                                    </span>
                                </td>
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
                                <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.8rem", fontWeight: 600, color: "#4b5563" }}>{l}</label>
                                <input type={t} value={form[k]}
                                       onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                                       style={inputStyle}
                                       onFocus={e => e.target.style.borderColor = "#3b82f6"}
                                       onBlur={e => e.target.style.borderColor = "#d1d5db"}
                                />
                            </div>
                        ))}
                        <div className="form-field">
                            <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.8rem", fontWeight: 600, color: "#4b5563" }}>Role</label>
                            <select style={inputStyle} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                                <option value="">Select role…</option>
                                <option value="STAFF">Staff</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                        {form.role === "STAFF" && (
                            <div className="form-field">
                                <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.8rem", fontWeight: 600, color: "#4b5563" }}>Department</label>
                                <select style={inputStyle} value={form.departmentId} onChange={e => setForm(f => ({ ...f, departmentId: e.target.value }))}>
                                    <option value="">Select department…</option>
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                            </div>
                        )}
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.65rem", marginTop: "1.5rem", paddingTop: "1.1rem", borderTop: "1px solid #e5e7eb" }}>
                        <button className="btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
                        <button className="btn-primary" onClick={handleAdd} disabled={saving || !canCreate}>
                            {saving ? "Creating…" : "Create User"}
                        </button>
                    </div>
                </Modal>
            )}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

// ── DEPARTMENTS TAB ────────────────────────────────────────────
function DepartmentsTab() {
    const [departments, setDepts] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [showAdd, setShowAdd]   = useState(false);
    const [form, setForm]         = useState({ name: "", description: "" });
    const [saving, setSaving]     = useState(false);
    const [toast, setToast]       = useState(null);
    const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

    const fetchDepts = useCallback(async () => {
        setLoading(true);
        try { const r = await api.get("/admin/departments"); setDepts(r.data); }
        catch { showToast("Failed to load departments", "error"); }
        setLoading(false);
    }, []);

    useEffect(() => { fetchDepts(); }, [fetchDepts]);

    const handleAdd = async () => {
        setSaving(true);
        try {
            await api.post("/admin/departments", form);
            showToast("Department created");
            setShowAdd(false); setForm({ name: "", description: "" }); fetchDepts();
        } catch { showToast("Failed to create department", "error"); }
        setSaving(false);
    };

    const ICONS = { TRANSPORT: "🚌", WATER: "💧", ELECTRICITY: "⚡", WASTE: "♻️" };

    return (
        <div className="tab-content">
            <Toast msg={toast?.msg} type={toast?.type} />
            <div className="tab-toolbar">
                <div />
                <button className="btn-primary" onClick={() => setShowAdd(true)}>+ Add Department</button>
            </div>
            {loading ? (
                <div className="tab-loading">
                    <div style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid #e5e7eb", borderTopColor: "#3b82f6", animation: "spin 0.7s linear infinite", margin: "0 auto 0.75rem" }} />
                    Loading departments…
                </div>
            ) : (
                <div className="dept-cards">
                    {departments.length === 0 && (
                        <div className="empty-state">
                            <span style={{ fontSize: "2rem", display: "block", marginBottom: "0.5rem" }}>🏢</span>
                            No departments yet. Add one to get started.
                        </div>
                    )}
                    {departments.map(d => (
                        <div key={d.id} className="dept-card">
                            <div className="dept-card-icon">{ICONS[d.name] || "🏢"}</div>
                            <div className="dept-card-body">
                                <div className="dept-card-name">{d.name}</div>
                                <div className="dept-card-desc">{d.description || "No description"}</div>
                                <div className="dept-card-stats">
                                    <span>👷 {d.staffCount ?? 0} staff</span>
                                    <span>📋 {d.activeComplaints ?? 0} active</span>
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
                            <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.8rem", fontWeight: 600, color: "#4b5563" }}>Department Name</label>
                            <input type="text" style={inputStyle} value={form.name}
                                   onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                   placeholder="e.g. Roads, Housing, Sanitation"
                                   onFocus={e => e.target.style.borderColor = "#3b82f6"}
                                   onBlur={e => e.target.style.borderColor = "#d1d5db"}
                            />
                        </div>
                        <div className="form-field full">
                            <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.8rem", fontWeight: 600, color: "#4b5563" }}>Description <span style={{ color: "#9ca3af", fontWeight: 400 }}>(optional)</span></label>
                            <input type="text" style={inputStyle} value={form.description}
                                   onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                   placeholder="Brief description…"
                                   onFocus={e => e.target.style.borderColor = "#3b82f6"}
                                   onBlur={e => e.target.style.borderColor = "#d1d5db"}
                            />
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.65rem", marginTop: "1.5rem", paddingTop: "1.1rem", borderTop: "1px solid #e5e7eb" }}>
                        <button className="btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
                        <button className="btn-primary" onClick={handleAdd} disabled={saving || !form.name}>
                            {saving ? "Creating…" : "Create Department"}
                        </button>
                    </div>
                </Modal>
            )}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// PASTE THESE TWO FUNCTIONS INTO AdminDashboard.jsx
// Replace the existing ReportsTab and SettingsTab functions entirely.
// ─────────────────────────────────────────────────────────────────────────────

// ── REPORTS TAB ────────────────────────────────────────────────
// Requires: Chart.js loaded via CDN OR import from your build system.
// Add to your index.html or load lazily (see useEffect below).
//
// API endpoints used:
//   GET /api/admin/reports/summary?days=N
//   GET /api/admin/reports/staff-performance
//   GET /api/admin/overview/charts/by-category   ← NEW (already in your controller)
//   GET /api/admin/overview/charts/by-status      ← NEW (already in your controller)
//   GET /api/admin/overview/charts/daily          ← NEW (already in your controller)
// ─────────────────────────────────────────────────────────────────────────────


// ── tiny chart helper ──────────────────────────────────────────
// function ensureChartJs(cb) {
//     if (window.Chart) { cb(); return; }
//     const s = document.createElement("script");
//     s.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
//     s.onload = cb;
//     document.head.appendChild(s);
// }

// function destroyChart(ref) {
//     if (ref.current) { ref.current.destroy(); ref.current = null; }
// }

// Bar / Line chart widget
// function ChartWidget({ type, labels, datasets, height = 220, title }) {
//     const canvasRef = useRef(null);
//     const chartRef  = useRef(null);
//
//     useEffect(() => {
//         ensureChartJs(() => {
//             if (!canvasRef.current) return;
//             destroyChart(chartRef);
//
//             const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
//             const gridColor  = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
//             const tickColor  = isDark ? "#9ca3af" : "#6b7280";
//
//             chartRef.current = new window.Chart(canvasRef.current, {
//                 type,
//                 data: { labels, datasets },
//                 options: {
//                     responsive: true,
//                     maintainAspectRatio: false,
//                     plugins: {
//                         legend: { display: datasets.length > 1, position: "top",
//                             labels: { color: tickColor, boxWidth: 10, font: { size: 11 } } },
//                         tooltip: { mode: "index", intersect: false },
//                     },
//                     scales: type !== "doughnut" ? {
//                         x: { grid: { color: gridColor }, ticks: { color: tickColor, font: { size: 11 } } },
//                         y: { grid: { color: gridColor }, ticks: { color: tickColor, font: { size: 11 } }, beginAtZero: true },
//                     } : undefined,
//                     animation: { duration: 500 },
//                 },
//             });
//         });
//         return () => destroyChart(chartRef);
//     }, [type, labels, datasets]);
//
//     return (
//         <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "0.75rem", padding: "1rem 1.1rem" }}>
//             {title && (
//                 <p style={{ margin: "0 0 0.6rem", fontSize: "0.78rem", fontWeight: 700,
//                     color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em" }}>
//                     {title}
//                 </p>
//             )}
//             <div style={{ position: "relative", width: "100%", height }}>
//                 <canvas
//                     ref={canvasRef}
//                     role="img"
//                     aria-label={title || "Chart"}
//                 />
//             </div>
//         </div>
//     );
// }

// Stat summary card
// function StatCard({ label, value, color, sub }) {
//     return (
//         <div style={{
//             background: "#fff", border: "1px solid #e5e7eb", borderRadius: "0.75rem",
//             padding: "1rem 1.1rem", display: "flex", flexDirection: "column", gap: "0.2rem",
//         }}>
//             <p style={{ margin: 0, fontSize: "0.72rem", fontWeight: 700, color: "#6b7280",
//                 textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</p>
//             <p style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: color || "#111827",
//                 fontFamily: "'Inter', sans-serif", lineHeight: 1.1 }}>{value ?? "—"}</p>
//             {sub && <p style={{ margin: 0, fontSize: "0.72rem", color: "#9ca3af" }}>{sub}</p>}
//         </div>
//     );
// }

// ── REPORTS TAB ────────────────────────────────────────────────
// Paste this entire function into AdminDashboard.js, replacing the old ReportsTab.

function ReportsTab() {
    const [period, setPeriod] = useState(7);
    const [summary, setSummary] = useState(null);
    const [perf, setPerf] = useState([]);
    const [daily, setDaily] = useState([]);
    const [byCategory, setByCategory] = useState([]);
    const [byStatus, setByStatus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = "info") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Helper: ensure Chart.js is loaded
    // const ensureChartJs = (cb) => {
    //     //     if (window.Chart) {
    //     //         cb();
    //     //         return;
    //     //     }
    //     //     const script = document.createElement("script");
    //     //     script.src = "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js";
    //     //     script.onload = () => cb();
    //     //     script.onerror = () => showToast("Failed to load charts", "error");
    //     //     document.head.appendChild(script);
    //     // };

    const fetchReports = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [sRes, pRes, dRes, cRes, stRes] = await Promise.all([
                api.get(`/admin/reports/summary?days=${period}`),
                api.get("/admin/reports/staff-performance"),
                api.get("/admin/overview/charts/daily"),
                api.get("/admin/overview/charts/by-category"),
                api.get("/admin/overview/charts/by-status"),
            ]);
            setSummary(sRes.data);
            setPerf(pRes.data);
            setDaily(dRes.data);
            setByCategory(cRes.data);
            setByStatus(stRes.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load report data. Check backend connection.");
            showToast("Could not load reports", "error");
        }
        setLoading(false);
    }, [period]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const exportStaffCSV = () => {
        if (!perf.length) return;
        const headers = ["Staff", "Department", "Assigned", "Resolved", "Declined", "Resolution Rate (%)"];
        const rows = perf.map(s => [
            s.name,
            s.department,
            s.assigned,
            s.resolved,
            s.declined,
            s.resolutionRate?.toFixed(1) || 0
        ]);
        const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "staff-performance.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    const handlePrint = () => window.print();

    // Chart rendering (will run after data loads and Chart.js is ready)
    useEffect(() => {
        if (loading || !window.Chart) return;
        // Helper to destroy existing charts
        // const charts = [];
        const createChart = (canvasId, type, data, options) => {
            const canvas = document.getElementById(canvasId);
            if (!canvas) return null;
            const ctx = canvas.getContext("2d");
            // Destroy existing chart instance if any
            if (canvas.chart) canvas.chart.destroy();
            const chart = new window.Chart(ctx, { type, data, options });
            canvas.chart = chart;
            return chart;
        };

        // Daily line chart
        if (daily.length && document.getElementById("dailyChart")) {
            const labels = daily.map(d => new Date(d.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }));
            const data = {
                labels,
                datasets: [{
                    label: "Complaints",
                    data: daily.map(d => d.count),
                    borderColor: "#3b82f6",
                    backgroundColor: "rgba(59,130,246,0.1)",
                    fill: true,
                    tension: 0.3,
                    pointRadius: 4,
                    pointBackgroundColor: "#3b82f6"
                }]
            };
            createChart("dailyChart", "line", data, { responsive: true, maintainAspectRatio: false });
        }

        // Category doughnut
        if (byCategory.length && document.getElementById("categoryChart")) {
            const categoryColors = { TRANSPORT:"#f59e0b", WATER:"#3b82f6", ELECTRICITY:"#eab308", WASTE:"#22c55e" };
            const data = {
                labels: byCategory.map(c => c.category),
                datasets: [{
                    data: byCategory.map(c => c.count),
                    backgroundColor: byCategory.map(c => categoryColors[c.category] || "#6b7280"),
                    borderWidth: 0
                }]
            };
            createChart("categoryChart", "doughnut", data, { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } });
        }

        // Status bar chart
        if (byStatus.length && document.getElementById("statusChart")) {
            const statusColors = { PENDING:"#ef4444", ASSIGNED:"#f97316", IN_PROGRESS:"#3b82f6", RESOLVED:"#22c55e", DECLINED:"#8b5cf6" };
            const data = {
                labels: byStatus.map(s => s.status),
                datasets: [{
                    label: "Complaints",
                    data: byStatus.map(s => s.count),
                    backgroundColor: byStatus.map(s => statusColors[s.status] || "#6b7280"),
                    borderRadius: 6
                }]
            };
            createChart("statusChart", "bar", data, { responsive: true, maintainAspectRatio: false });
        }

        return () => {
            // Cleanup on unmount
            ["dailyChart", "categoryChart", "statusChart"].forEach(id => {
                const canvas = document.getElementById(id);
                if (canvas && canvas.chart) canvas.chart.destroy();
            });
        };
    }, [loading, daily, byCategory, byStatus]);

    // Load Chart.js once on mount
    // useEffect(() => {
    //     ensureChartJs(() => {});
    // }, [ensureChartsJs]);

    const rateColor = (rate) => rate >= 70 ? "#22c55e" : rate >= 40 ? "#f59e0b" : "#ef4444";

    if (loading) {
        return (
            <div className="tab-content">
                <div className="tab-loading">
                    <div style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid #e5e7eb", borderTopColor: "#3b82f6", animation: "spin 0.7s linear infinite", margin: "0 auto 0.75rem" }} />
                    Loading reports…
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (error) {
        return (
            <div className="tab-content">
                <div className="error-state" style={{ textAlign: "center", padding: "2rem", color: "#ef4444" }}>
                    ⚠️ {error}
                </div>
            </div>
        );
    }

    return (
        <div className="tab-content">
            {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}

            {/* Toolbar */}
            <div className="tab-toolbar">
                <div className="filters">
                    <select className="filter-select" value={period} onChange={e => setPeriod(Number(e.target.value))}>
                        <option value={7}>Last 7 days</option>
                        <option value={14}>Last 14 days</option>
                        <option value={30}>Last 30 days</option>
                    </select>
                    <button className="btn-outline" onClick={fetchReports}>↻ Reload</button>
                </div>
                <div className="toolbar-right">
                    <button className="btn-outline" onClick={handlePrint}>🖨 Print Report</button>
                    <button className="btn-outline" onClick={exportStaffCSV} disabled={!perf.length}>⬇ Export Staff CSV</button>
                </div>
            </div>

            {/* Summary Cards */}
            {summary && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                    <div className="stat-card"><div className="stat-label">Total ({summary.period})</div><div className="stat-value">{summary.totalComplaints}</div></div>
                    <div className="stat-card"><div className="stat-label">Resolved</div><div className="stat-value" style={{ color: "#22c55e" }}>{summary.resolved}</div></div>
                    <div className="stat-card"><div className="stat-label">Resolution Rate</div><div className="stat-value" style={{ color: rateColor(summary.resolutionRate) }}>{summary.resolutionRate?.toFixed(1)}%</div></div>
                    <div className="stat-card"><div className="stat-label">Pending</div><div className="stat-value" style={{ color: "#ef4444" }}>{summary.byStatus?.PENDING || 0}</div></div>
                    <div className="stat-card"><div className="stat-label">In Progress</div><div className="stat-value" style={{ color: "#3b82f6" }}>{summary.byStatus?.IN_PROGRESS || 0}</div></div>
                </div>
            )}

            {/* Charts Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                <div className="chart-container" style={{ background: "#fff", borderRadius: "0.75rem", padding: "1rem", border: "1px solid #e5e7eb" }}>
                    <div className="section-label">📈 Daily Complaints</div>
                    <div style={{ height: "220px", position: "relative" }}>
                        <canvas id="dailyChart" style={{ width: "100%", height: "100%" }} />
                    </div>
                </div>
                <div className="chart-container" style={{ background: "#fff", borderRadius: "0.75rem", padding: "1rem", border: "1px solid #e5e7eb" }}>
                    <div className="section-label">📂 By Category</div>
                    <div style={{ height: "220px", position: "relative" }}>
                        <canvas id="categoryChart" style={{ width: "100%", height: "100%" }} />
                    </div>
                </div>
                <div className="chart-container" style={{ background: "#fff", borderRadius: "0.75rem", padding: "1rem", border: "1px solid #e5e7eb" }}>
                    <div className="section-label">⚙️ By Status</div>
                    <div style={{ height: "220px", position: "relative" }}>
                        <canvas id="statusChart" style={{ width: "100%", height: "100%" }} />
                    </div>
                </div>
            </div>

            {/* Hotspots */}
            {summary?.hotspots && Object.keys(summary.hotspots).length > 0 && (
                <div style={{ marginBottom: "1.5rem", background: "#fff", borderRadius: "0.75rem", padding: "1rem", border: "1px solid #e5e7eb" }}>
                    <div className="section-label">📍 Hotspot Areas</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {Object.entries(summary.hotspots)
                            .sort((a,b) => b[1] - a[1])
                            .slice(0, 10)
                            .map(([area, count], idx) => (
                                <div key={area} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                    <span style={{ width: 30, fontSize: "0.75rem", color: "#6b7280" }}>#{idx+1}</span>
                                    <span style={{ flex: 1, fontWeight: 500 }}>{area}</span>
                                    <div style={{ width: "40%", background: "#e5e7eb", borderRadius: "999px", height: "8px", overflow: "hidden" }}>
                                        <div style={{ width: `${(count / Math.max(...Object.values(summary.hotspots))) * 100}%`, background: "#3b82f6", height: "100%" }} />
                                    </div>
                                    <span style={{ width: 40, textAlign: "right", fontWeight: 700 }}>{count}</span>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* Staff Performance Table */}
            <div style={{ background: "#fff", borderRadius: "0.75rem", padding: "1rem", border: "1px solid #e5e7eb" }}>
                <div className="section-label">👷 Staff Performance</div>
                {perf.length === 0 ? (
                    <div className="no-data">No staff performance data available</div>
                ) : (
                    <div className="table-wrap">
                        <table className="data-table">
                            <thead>
                            <tr><th>Staff</th><th>Department</th><th>Assigned</th><th>Resolved</th><th>Declined</th><th>Rate</th><th>Trend</th></tr>
                            </thead>
                            <tbody>
                            {perf.sort((a,b) => b.resolutionRate - a.resolutionRate).map((s, i) => (
                                <tr key={i}>
                                    <td><strong>{s.name}</strong></td>
                                    <td>{s.department}</td>
                                    <td>{s.assigned}</td>
                                    <td style={{ color: "#166534" }}>{s.resolved}</td>
                                    <td style={{ color: "#b91c1c" }}>{s.declined}</td>
                                    <td>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                            <div style={{ flex: 1, background: "#e5e7eb", borderRadius: 4, height: 6 }}>
                                                <div style={{ width: `${s.resolutionRate}%`, height: 6, background: rateColor(s.resolutionRate), borderRadius: 4 }} />
                                            </div>
                                            <span>{s.resolutionRate?.toFixed(0)}%</span>
                                        </div>
                                    </td>
                                    <td>{s.resolutionRate >= 70 ? "⬆️" : s.resolutionRate >= 40 ? "➡️" : "⬇️"}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── SETTINGS TAB ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
//
// BACKEND ADDITIONS REQUIRED — see SettingsController.java below.
// Endpoints:
//   GET  /api/admin/settings          → { autoRoutingEnabled, adminEmailNotifications, slaOverdueDays, slaAutoEscalateDays }
//   PUT  /api/admin/settings          → same shape → saves to DB
//   GET  /api/admin/settings/categories  → string[]
//   POST /api/admin/settings/categories  → { category: "..." }
//   DELETE /api/admin/settings/categories/:name
// ─────────────────────────────────────────────────────────────────────────────

const TOGGLE_STYLE = (on) => ({
    position: "relative", display: "inline-block", width: 42, height: 24, cursor: "pointer",
    background: on ? "#3b82f6" : "#d1d5db", borderRadius: 999, transition: "background 0.2s",
    flexShrink: 0,
});
const KNOB_STYLE = (on) => ({
    position: "absolute", top: 3, left: on ? 21 : 3, width: 18, height: 18,
    borderRadius: "50%", background: "#ffffff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.25)", transition: "left 0.2s",
});

function Toggle({ value, onChange }) {
    return (
        <div style={TOGGLE_STYLE(value)} onClick={() => onChange(!value)}>
            <div style={KNOB_STYLE(value)} />
        </div>
    );
}

function SettingRow({ label, desc, children }) {
    return (
        <div style={{
            display: "flex", alignItems: "flex-start", justifyContent: "space-between",
            gap: "1rem", padding: "0.9rem 0",
            borderBottom: "1px solid #f3f4f6",
        }}>
            <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: "#111827" }}>{label}</p>
                {desc && <p style={{ margin: "0.2rem 0 0", fontSize: "0.78rem", color: "#6b7280" }}>{desc}</p>}
            </div>
            <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
                {children}
            </div>
        </div>
    );
}

function SettingsSection({ icon, title, children }) {
    return (
        <div style={{
            background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "1rem",
            padding: "1rem 1.25rem", marginBottom: "1rem",
        }}>
            <p style={{
                margin: "0 0 0.1rem", fontSize: "0.72rem", fontWeight: 700,
                color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em",
            }}>
                {icon} {title}
            </p>
            {children}
        </div>
    );
}

function SettingsTab() {
    const [settings, setSettings]       = useState({
        autoRoutingEnabled: false,
        adminEmailNotifications: false,
        slaOverdueDays: 3,
        slaAutoEscalateDays: 7,
    });
    const [categories, setCategories]   = useState([]);
    const [newCat, setNewCat]           = useState("");
    const [saving, setSaving]           = useState(false);
    const [catSaving, setCatSaving]     = useState(false);
    const [loading, setLoading]         = useState(true);
    const [toast, setToast]             = useState(null);
    const [dirty, setDirty]             = useState(false);

    const CATEGORY_META = {
        TRANSPORT:   { icon: "🚌", desc: "Potholes, road damage, traffic lights" },
        WATER:       { icon: "💧", desc: "Leaks, supply issues, burst pipes" },
        ELECTRICITY: { icon: "⚡", desc: "Outages, faulty street lights" },
        WASTE:       { icon: "♻️", desc: "Litter, illegal dumping, bin collection" },
    };

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchSettings = useCallback(async () => {
        setLoading(true);
        try {
            const [sRes, cRes] = await Promise.all([
                api.get("/admin/settings"),
                api.get("/admin/settings/categories"),
            ]);
            setSettings(sRes.data);
            setCategories(cRes.data);
        } catch {
            // If endpoints don't exist yet, use defaults silently
        }
        setLoading(false);
        setDirty(false);
    }, []);

    useEffect(() => { fetchSettings(); }, [fetchSettings]);

    const updateField = (key, value) => {
        setSettings(s => ({ ...s, [key]: value }));
        setDirty(true);
    };

    const saveSettings = async () => {
        setSaving(true);
        try {
            await api.put("/admin/settings", settings);
            showToast("Settings saved successfully");
            setDirty(false);
        } catch {
            showToast("Failed to save settings", "error");
        }
        setSaving(false);
    };

    const addCategory = async () => {
        const cat = newCat.trim().toUpperCase();
        if (!cat || categories.includes(cat)) return;
        setCatSaving(true);
        try {
            await api.post("/admin/settings/categories", { category: cat });
            setCategories(prev => [...prev, cat]);
            setNewCat("");
            showToast(`Category "${cat}" added`);
        } catch {
            showToast("Failed to add category", "error");
        }
        setCatSaving(false);
    };

    const removeCategory = async (cat) => {
        if (!window.confirm(`Remove category "${cat}"? This won't delete existing complaints.`)) return;
        try {
            await api.delete(`/admin/settings/categories/${cat}`);
            setCategories(prev => prev.filter(c => c !== cat));
            showToast(`Category "${cat}" removed`);
        } catch {
            showToast("Failed to remove category", "error");
        }
    };

    const NumInput = ({ value, onChange, min = 1, max = 30 }) => (
        <input
            type="number" min={min} max={max} value={value}
            onChange={e => onChange(Number(e.target.value))}
            style={{
                width: 64, padding: "0.35rem 0.5rem", border: "1px solid #d1d5db",
                borderRadius: "0.5rem", fontSize: "0.875rem", textAlign: "center",
                color: "#111827", background: "#fff", outline: "none",
            }}
            onFocus={e => e.target.style.borderColor = "#3b82f6"}
            onBlur={e => e.target.style.borderColor = "#d1d5db"}
        />
    );

    if (loading) {
        return (
            <div className="tab-content">
                <div className="tab-loading">
                    <div style={{ width: 28, height: 28, borderRadius: "50%",
                        border: "2px solid #e5e7eb", borderTopColor: "#3b82f6",
                        animation: "spin 0.7s linear infinite", margin: "0 auto 0.75rem" }} />
                    Loading settings…
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div className="tab-content">
            {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}

            {/* ── Save bar ── */}
            {dirty && (
                <div style={{
                    position: "sticky", top: 0, zIndex: 100,
                    background: "#fffbeb", border: "1px solid #fde68a",
                    borderRadius: "0.75rem", padding: "0.6rem 1rem",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    marginBottom: "1rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}>
                    <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#92400e" }}>
                        ⚠ You have unsaved changes
                    </span>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button className="btn-outline" onClick={fetchSettings}>Discard</button>
                        <button className="btn-primary" onClick={saveSettings} disabled={saving}>
                            {saving ? "Saving…" : "Save Settings"}
                        </button>
                    </div>
                </div>
            )}

            {/* ── Automation ── */}
            <SettingsSection icon="🤖" title="Automation">
                <SettingRow
                    label="Auto-routing"
                    desc="Automatically assign new complaints to the least-loaded staff member in the relevant department."
                >
                    <Toggle value={settings.autoRoutingEnabled} onChange={v => updateField("autoRoutingEnabled", v)} />
                </SettingRow>
                <SettingRow
                    label="Admin email notifications"
                    desc="Send email alerts to admins when critical complaints are submitted or overdue."
                >
                    <Toggle value={settings.adminEmailNotifications} onChange={v => updateField("adminEmailNotifications", v)} />
                </SettingRow>
            </SettingsSection>

            {/* ── SLA Thresholds ── */}
            <SettingsSection icon="⏱" title="SLA Thresholds">
                <SettingRow
                    label="Overdue trigger (days)"
                    desc="Mark a complaint as overdue after this many days unresolved."
                >
                    <NumInput value={settings.slaOverdueDays} onChange={v => updateField("slaOverdueDays", v)} />
                </SettingRow>
                <SettingRow
                    label="Auto-escalate after (days)"
                    desc="Automatically escalate priority to CRITICAL after this many days."
                >
                    <NumInput value={settings.slaAutoEscalateDays} onChange={v => updateField("slaAutoEscalateDays", v)} />
                </SettingRow>
                <div style={{ paddingTop: "0.5rem" }}>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "#9ca3af" }}>
                        Dashboard refreshes every 30 seconds (hardcoded). JWT tokens expire after 24 hours.
                    </p>
                </div>
            </SettingsSection>

            {/* ── Complaint Categories ── */}
            <SettingsSection icon="📂" title="Complaint Categories">
                <div style={{ marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {categories.map(cat => (
                        <div key={cat} style={{
                            display: "flex", alignItems: "center", gap: "0.6rem",
                            padding: "0.55rem 0.75rem",
                            background: "#f9fafb", border: "1px solid #e5e7eb",
                            borderRadius: "0.6rem",
                        }}>
                            <span style={{ fontSize: "1rem" }}>{CATEGORY_META[cat]?.icon || "📁"}</span>
                            <div style={{ flex: 1 }}>
                                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111827" }}>{cat}</span>
                                {CATEGORY_META[cat]?.desc && (
                                    <span style={{ marginLeft: "0.5rem", fontSize: "0.75rem", color: "#9ca3af" }}>
                                        — {CATEGORY_META[cat].desc}
                                    </span>
                                )}
                            </div>
                            {!["TRANSPORT","WATER","ELECTRICITY","WASTE"].includes(cat) && (
                                <button
                                    onClick={() => removeCategory(cat)}
                                    style={{
                                        background: "none", border: "none", cursor: "pointer",
                                        color: "#ef4444", fontSize: "0.8rem", padding: "0.1rem 0.3rem",
                                        borderRadius: "0.35rem",
                                    }}
                                    title="Remove category"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}

                    {/* Add new category */}
                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                        <input
                            type="text"
                            placeholder="New category name (e.g. PARKS)"
                            value={newCat}
                            onChange={e => setNewCat(e.target.value.toUpperCase())}
                            onKeyDown={e => e.key === "Enter" && addCategory()}
                            style={{
                                flex: 1, padding: "0.55rem 0.75rem",
                                border: "1px solid #d1d5db", borderRadius: "0.6rem",
                                fontSize: "0.82rem", color: "#111827", background: "#fff",
                                outline: "none",
                            }}
                            onFocus={e => e.target.style.borderColor = "#3b82f6"}
                            onBlur={e => e.target.style.borderColor = "#d1d5db"}
                        />
                        <button
                            className="btn-primary"
                            onClick={addCategory}
                            disabled={catSaving || !newCat.trim()}
                        >
                            {catSaving ? "Adding…" : "+ Add"}
                        </button>
                    </div>
                </div>
            </SettingsSection>

            {/* ── Priority rules (read-only reference) ── */}
            <SettingsSection icon="⚡" title="Priority Rules (Reference)">
                {[
                    { p: "LOW",      color: "#22c55e", r: "Routine, non-urgent — no SLA" },
                    { p: "MEDIUM",   color: "#f59e0b", r: "Response within 5 days" },
                    { p: "HIGH",     color: "#f97316", r: "Response within 24 hours" },
                    { p: "CRITICAL", color: "#ef4444", r: "Immediate escalation required" },
                ].map(({ p, color, r }) => (
                    <div key={p} style={{
                        display: "flex", alignItems: "center", gap: "0.75rem",
                        padding: "0.55rem 0", borderBottom: "1px solid #f3f4f6",
                    }}>
                        <span style={{
                            padding: "0.15rem 0.6rem", borderRadius: 999,
                            background: color + "22", color,
                            border: `1px solid ${color}55`,
                            fontSize: "0.7rem", fontWeight: 700,
                            minWidth: 72, textAlign: "center",
                        }}>{p}</span>
                        <span style={{ fontSize: "0.82rem", color: "#4b5563" }}>{r}</span>
                    </div>
                ))}
            </SettingsSection>

            {/* ── Security (read-only info) ── */}
            <SettingsSection icon="🔐" title="Security & Access">
                {[
                    "Admin credentials are configured in application.properties",
                    "All API calls require a valid JWT Bearer token",
                    "JWT tokens expire after 24 hours — users must re-login",
                    "Passwords are stored as BCrypt hashes — never in plaintext",
                ].map((item, i) => (
                    <div key={i} style={{
                        display: "flex", alignItems: "flex-start", gap: "0.5rem",
                        padding: "0.45rem 0", borderBottom: i < 3 ? "1px solid #f3f4f6" : "none",
                    }}>
                        <span style={{ color: "#22c55e", fontSize: "0.8rem", marginTop: "0.05rem" }}>✓</span>
                        <span style={{ fontSize: "0.82rem", color: "#4b5563" }}>{item}</span>
                    </div>
                ))}
            </SettingsSection>

            {/* ── Save button at bottom too ── */}
            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "0.5rem" }}>
                <button className="btn-primary" onClick={saveSettings} disabled={saving || !dirty}>
                    {saving ? "Saving…" : dirty ? "Save Settings" : "All Changes Saved ✓"}
                </button>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

export { ReportsTab, SettingsTab };

// ── MAIN EXPORT ────────────────────────────────────────────────
export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("Complaints");
    const tabIcons = { Complaints: "📋", Users: "👥", Departments: "🏢", Reports: "📊", Settings: "⚙️" };
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
                        {tabIcons[tab]} {tab}
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