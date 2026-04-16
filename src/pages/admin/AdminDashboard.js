// AdminDashboard.jsx – Light theme, citizen styling
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

// ── REPORTS TAB ────────────────────────────────────────────────
function ReportsTab() {
    const [period, setPeriod]   = useState(7);
    const [summary, setSummary] = useState(null);
    const [perf, setPerf]       = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReports = useCallback(async () => {
        setLoading(true);
        try {
            const [sRes, pRes] = await Promise.all([
                api.get(`/admin/reports/summary?days=${period}`),
                api.get("/admin/reports/staff-performance"),
            ]);
            setSummary(sRes.data); setPerf(pRes.data);
        } catch {}
        setLoading(false);
    }, [period]);

    useEffect(() => { fetchReports(); }, [fetchReports]);

    const rateColor = (rate) => rate >= 70 ? "#22c55e" : rate >= 40 ? "#f59e0b" : "#ef4444";

    return (
        <div className="tab-content">
            <div className="tab-toolbar">
                <div className="filters">
                    <select className="filter-select" value={period} onChange={e => setPeriod(Number(e.target.value))}>
                        <option value={7}>Last 7 days</option>
                        <option value={14}>Last 14 days</option>
                        <option value={30}>Last 30 days</option>
                    </select>
                    <button className="btn-outline" onClick={fetchReports}>↻ Reload</button>
                </div>
                <button className="btn-outline" onClick={() => perf.length && exportCSV(perf, "staff-performance.csv")}>
                    ⬇ Export Performance CSV
                </button>
            </div>
            {loading ? (
                <div className="tab-loading">
                    <div style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid #e5e7eb", borderTopColor: "#3b82f6", animation: "spin 0.7s linear infinite", margin: "0 auto 0.75rem" }} />
                    Loading reports…
                </div>
            ) : (
                <>
                    {summary && (
                        <div className="report-summary">
                            <div className="report-card">
                                <div className="report-num">{summary.totalComplaints}</div>
                                <div className="report-label">Total ({summary.period})</div>
                            </div>
                            <div className="report-card">
                                <div className="report-num" style={{ color: "#22c55e" }}>{summary.resolved}</div>
                                <div className="report-label">Resolved</div>
                            </div>
                            <div className="report-card">
                                <div className="report-num" style={{ color: rateColor(summary.resolutionRate) }}>
                                    {summary.resolutionRate?.toFixed(1)}%
                                </div>
                                <div className="report-label">Resolution Rate</div>
                            </div>
                        </div>
                    )}
                    {summary?.hotspots && Object.keys(summary.hotspots).length > 0 && (
                        <div className="report-section">
                            <div className="section-label">📍 Hotspot Areas</div>
                            <div className="hotspot-list">
                                {Object.entries(summary.hotspots)
                                    .sort((a, b) => b[1] - a[1])
                                    .slice(0, 10)
                                    .map(([area, count], i) => (
                                        <div key={i} className="hotspot-row">
                                            <span className="hotspot-rank">#{i + 1}</span>
                                            <span className="hotspot-area">{area}</span>
                                            <span className="hotspot-count">{count}</span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                    <div className="report-section">
                        <div className="section-label">👷 Staff Performance</div>
                        {perf.length === 0 ? (
                            <div className="no-data">No staff performance data yet</div>
                        ) : (
                            <div className="table-wrap">
                                <table className="data-table">
                                    <thead>
                                    <tr><th>Staff</th><th>Department</th><th>Assigned</th><th>Resolved</th><th>Declined</th><th>Rate</th></tr>
                                    </thead>
                                    <tbody>
                                    {perf.map((s, i) => (
                                        <tr key={i}>
                                            <td style={{ fontWeight: 600, color: "#111827" }}>{s.name}</td>
                                            <td style={{ color: "#6b7280", fontSize: "0.8rem" }}>{s.department}</td>
                                            <td className="mono">{s.assigned}</td>
                                            <td className="mono" style={{ color: "#166534" }}>{s.resolved}</td>
                                            <td className="mono" style={{ color: "#b91c1c" }}>{s.declined}</td>
                                            <td>
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                                                    <div style={{ flex: 1, background: "#e5e7eb", borderRadius: "3px", height: 8, overflow: "hidden" }}>
                                                        <div style={{ width: `${s.resolutionRate}%`, height: "100%", background: rateColor(s.resolutionRate), borderRadius: "3px", transition: "width 0.6s ease" }} />
                                                    </div>
                                                    <span className="mono small" style={{ color: "#6b7280", minWidth: 36, textAlign: "right" }}>
                                                        {s.resolutionRate?.toFixed(0)}%
                                                    </span>
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
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

// ── SETTINGS TAB ───────────────────────────────────────────────
function SettingsTab() {
    const settingsData = [
        {
            title: "📂 Complaint Categories",
            items: [
                "TRANSPORT — Potholes, road damage, traffic lights",
                "WATER — Leaks, supply issues, burst pipes",
                "ELECTRICITY — Outages, faulty street lights",
                "WASTE — Litter, illegal dumping, bin collection",
            ],
        },
        {
            title: "⚡ Priority Rules",
            items: [
                ["🟢 LOW",      "Routine, non-urgent"],
                ["🟡 MEDIUM",   "Response within 5 days"],
                ["🟠 HIGH",     "Response within 24 hours"],
                ["🔴 CRITICAL", "Immediate escalation"],
            ].map(([p, r]) => `${p} — ${r}`),
        },
        {
            title: "⏱ SLA Thresholds",
            items: [
                "Overdue trigger: 3 days unresolved",
                "Auto-escalation after: 7 days",
                "Dashboard refresh: every 30 seconds",
            ],
        },
        {
            title: "🔐 Admin Access",
            items: [
                "Admin email configured in application.properties",
                "JWT token required for all API calls",
                "Token expires after 24 hours",
            ],
        },
    ];

    return (
        <div className="tab-content">
            <div className="settings-grid">
                {settingsData.map((card, i) => (
                    <div key={i} className="settings-card">
                        <div className="settings-card-title">{card.title}</div>
                        <div className="settings-list">
                            {card.items.map((item, j) => (
                                <div key={j} className="settings-item">{item}</div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

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