// pages/staff/StaffComplaints.jsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StaffLayout from "../../components/layout/StaffLayout";
import {
    getMyComplaints,
    getComplaintById,
    updateComplaintStatus,
    addNote,
} from "../../services/staffService";
import "../../styles/staff.css";

const PRIORITY_COLORS = { CRITICAL:"#ef4444", HIGH:"#f97316", MEDIUM:"#f59e0b", LOW:"#22c55e" };
const STATUS_COLORS   = { PENDING:"#ef4444", ASSIGNED:"#f97316", IN_PROGRESS:"#3b82f6", RESOLVED:"#22c55e", DECLINED:"#8b5cf6" };
const CATEGORY_ICONS  = { TRANSPORT:"🚌", WATER:"💧", ELECTRICITY:"⚡", WASTE:"♻️" };

function timeAgo(dateStr) {
    if (!dateStr) return "—";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs  = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);
    if (days > 0) return `${days}d ago`;
    if (hrs  > 0) return `${hrs}h ago`;
    if (mins > 0) return `${mins}m ago`;
    return "just now";
}

function Badge({ value, colorMap }) {
    const color = colorMap?.[value] || "#6b7280";
    return (
        <span className="staff-badge" style={{ background: color + "22", color, borderColor: color + "55" }}>
            {value}
        </span>
    );
}

function Toast({ msg, type }) {
    if (!msg) return null;
    return <div className={`staff-toast ${type}`}>{type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"} {msg}</div>;
}

// ── COMPLAINT DETAIL MODAL ────────────────────────────────
function ComplaintModal({ id, onClose, onUpdated }) {
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading]     = useState(true);
    const [note, setNote]           = useState("");
    const [addingNote, setAddingNote] = useState(false);
    const [updating, setUpdating]   = useState(false);
    const [toast, setToast]         = useState(null);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        const handler = (e) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", handler);
            document.body.style.overflow = prev;
        };
    }, [onClose]);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        getComplaintById(id)
            .then(data => { setComplaint(data); setLoading(false); })
            .catch(() => { showToast("Failed to load complaint", "error"); setLoading(false); });
    }, [id]);

    const handleStatus = async (status) => {
        setUpdating(true);
        try {
            await updateComplaintStatus(id, status);
            setComplaint(prev => ({ ...prev, status }));
            showToast(`Status updated to ${status}`);
            onUpdated?.();
        } catch {
            showToast("Failed to update status", "error");
        }
        setUpdating(false);
    };

    const handleAddNote = async () => {
        if (!note.trim()) return;
        setAddingNote(true);
        try {
            await addNote(id, note.trim());
            showToast("Note added successfully");
            setNote("");
            // Refresh complaint data to show new note
            const updated = await getComplaintById(id);
            setComplaint(updated);
        } catch {
            showToast("Failed to add note", "error");
        }
        setAddingNote(false);
    };

    const timeline = [
        { label: "Submitted",    date: complaint?.createdAt,  icon: "📋", color: "#3b82f6" },
        { label: "Last Updated", date: complaint?.updatedAt,  icon: "⚙️", color: "#6b7280" },
        { label: "Resolved",     date: complaint?.resolvedAt, icon: "✅", color: "#22c55e" },
    ];

    return (
        <div className="staff-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="staff-modal" onClick={e => e.stopPropagation()}>
                <div className="staff-modal-header">
                    <h3 className="staff-modal-title">
                        {complaint ? `Complaint #${complaint.id} — ${complaint.title}` : "Loading…"}
                    </h3>
                    <button className="staff-modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="staff-modal-body">
                    <Toast msg={toast?.msg} type={toast?.type} />

                    {loading ? (
                        <div className="staff-loading"><div className="staff-spinner" /><span>Loading…</span></div>
                    ) : !complaint ? (
                        <div className="staff-error">Failed to load complaint details.</div>
                    ) : (
                        <>
                            {/* ── BASIC DETAILS ── */}
                            <div className="staff-detail-grid">
                                <div>
                                    <span className="staff-detail-label">Category</span>
                                    <Badge value={complaint.category} colorMap={{ TRANSPORT:"#f59e0b", WATER:"#3b82f6", ELECTRICITY:"#eab308", WASTE:"#22c55e" }} />
                                </div>
                                <div>
                                    <span className="staff-detail-label">Priority</span>
                                    <Badge value={complaint.priority} colorMap={PRIORITY_COLORS} />
                                </div>
                                <div>
                                    <span className="staff-detail-label">Status</span>
                                    <Badge value={complaint.status} colorMap={STATUS_COLORS} />
                                </div>
                                <div>
                                    <span className="staff-detail-label">Area</span>
                                    <span className="staff-detail-value">{complaint.area || "—"}</span>
                                </div>
                                <div>
                                    <span className="staff-detail-label">Citizen</span>
                                    <span className="staff-detail-value">{complaint.citizenEmail || complaint.user?.email || "—"}</span>
                                </div>
                                <div>
                                    <span className="staff-detail-label">Department</span>
                                    <span className="staff-detail-value">{complaint.departmentName || "—"}</span>
                                </div>
                                <div className="full">
                                    <span className="staff-detail-label">Description</span>
                                    <p style={{ fontSize: "0.875rem", color: "#4b5563", lineHeight: 1.6, margin: "0.3rem 0 0" }}>
                                        {complaint.description || "No description provided."}
                                    </p>
                                </div>
                                {complaint.photoUrl && (
                                    <div className="full">
                                        <span className="staff-detail-label">Photo Evidence</span>
                                        <img src={complaint.photoUrl} alt="Complaint evidence" className="staff-photo-full" />
                                    </div>
                                )}
                            </div>

                            {/* ── TIMELINE ── */}
                            <div className="staff-section-divider">📅 Timeline</div>
                            <div className="staff-timeline">
                                {timeline.map((t, i) => (
                                    <div key={i} className="staff-timeline-item">
                                        <div className="staff-timeline-dot" style={{
                                            background: t.date ? t.color + "22" : "#f3f4f6",
                                            border: `2px solid ${t.date ? t.color : "#e5e7eb"}`,
                                        }}>
                                            {t.icon}
                                        </div>
                                        <div className="staff-timeline-content">
                                            <p className="staff-timeline-label" style={{ color: t.date ? "#111827" : "#9ca3af" }}>{t.label}</p>
                                            <p className="staff-timeline-date">{t.date ? new Date(t.date).toLocaleString() : "—"}</p>
                                        </div>
                                        {t.date && <span style={{ width: 8, height: 8, borderRadius: "50%", background: t.color, flexShrink: 0 }} />}
                                    </div>
                                ))}
                            </div>

                            {/* ── NOTES ── */}
                            <div className="staff-section-divider">💬 Internal Notes</div>
                            {complaint.notes?.length > 0 ? (
                                <div className="staff-notes-list">
                                    {complaint.notes.map((n, i) => (
                                        <div key={i} className="staff-note-item">
                                            <div>
                                                <span className="staff-note-author">{n.authorName || "Staff"}</span>
                                                <span className="staff-note-time">{n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}</span>
                                            </div>
                                            <p className="staff-note-text">{n.note || n.text}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ fontSize: "0.82rem", color: "#9ca3af", marginBottom: "0.75rem" }}>No notes yet.</p>
                            )}
                            <div style={{ display: "flex", gap: "0.6rem", alignItems: "flex-end" }}>
                                <textarea
                                    className="staff-note-input"
                                    placeholder="Add an internal note…"
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                />
                                <button
                                    className="staff-btn-primary"
                                    style={{ flexShrink: 0, alignSelf: "flex-end" }}
                                    onClick={handleAddNote}
                                    disabled={!note.trim() || addingNote}
                                >
                                    {addingNote ? "Adding…" : "Add Note"}
                                </button>
                            </div>

                            {/* ── QUICK ACTIONS ── */}
                            <div className="staff-section-divider">⚡ Quick Actions</div>
                            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                                {complaint.status !== "IN_PROGRESS" && (
                                    <button className="staff-btn-info" disabled={updating}
                                            onClick={() => handleStatus("IN_PROGRESS")}>
                                        ⚙️ Set In Progress
                                    </button>
                                )}
                                {complaint.status !== "RESOLVED" && (
                                    <button className="staff-btn-success" disabled={updating}
                                            onClick={() => handleStatus("RESOLVED")}>
                                        ✅ Mark Resolved
                                    </button>
                                )}
                                {complaint.status !== "DECLINED" && (
                                    <button className="staff-btn-danger" disabled={updating}
                                            onClick={() => handleStatus("DECLINED")}>
                                        ❌ Decline
                                    </button>
                                )}
                                {complaint.status === "RESOLVED" && (
                                    <button className="staff-btn-warning" disabled={updating}
                                            onClick={() => handleStatus("IN_PROGRESS")}>
                                        🔄 Re-open
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── MAIN COMPLAINTS LIST ──────────────────────────────────
export default function StaffComplaints() {
    const navigate = useNavigate();
    const { id: urlId } = useParams(); // support /staff/complaints/:id deep link

    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading]       = useState(true);
    const [filter, setFilter]         = useState({ status: "", priority: "", category: "" });
    const [selectedId, setSelectedId] = useState(urlId ? Number(urlId) : null);
    const [toast, setToast]           = useState(null);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchComplaints = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getMyComplaints(filter);
            setComplaints(Array.isArray(data) ? data : []);
        } catch {
            showToast("Failed to load complaints", "error");
        }
        setLoading(false);
    }, [filter]);

    useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

    // Quick inline status update from table
    const quickStatus = async (e, id, status) => {
        e.stopPropagation();
        try {
            await updateComplaintStatus(id, status);
            showToast(`Updated to ${status}`);
            fetchComplaints();
        } catch {
            showToast("Update failed", "error");
        }
    };

    const exportCSV = () => {
        if (!complaints.length) return;
        const headers = ["ID", "Title", "Category", "Area", "Priority", "Status", "Created", "Description"];
        const rows = complaints.map(c => [
            c.id, `"${c.title}"`, c.category, c.area, c.priority, c.status,
            c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—",
            `"${(c.description || "").replace(/"/g, "'")}"`,
        ]);
        const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement("a");
        a.href = url; a.download = "my-complaints.csv"; a.click();
        URL.revokeObjectURL(url);
    };

    // Group counts for mini summary chips
    const counts = {
        total:      complaints.length,
        pending:    complaints.filter(c => c.status === "PENDING" || c.status === "ASSIGNED").length,
        inProgress: complaints.filter(c => c.status === "IN_PROGRESS").length,
        resolved:   complaints.filter(c => c.status === "RESOLVED").length,
        critical:   complaints.filter(c => c.priority === "CRITICAL").length,
    };

    return (
        <StaffLayout>
            <div className="staff-page">
                <div className="staff-page-header">
                    <div>
                        <h2 className="staff-page-title">My Complaints</h2>
                        <p className="staff-page-sub">All complaints assigned to you</p>
                    </div>
                    <button className="staff-btn-outline" onClick={exportCSV}>⬇ Export CSV</button>
                </div>

                <Toast msg={toast?.msg} type={toast?.type} />

                {/* ── SUMMARY CHIPS ── */}
                <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                    {[
                        { label: "Total",       value: counts.total,      color: "#2563eb" },
                        { label: "Open",        value: counts.pending,    color: "#ef4444" },
                        { label: "In Progress", value: counts.inProgress, color: "#3b82f6" },
                        { label: "Resolved",    value: counts.resolved,   color: "#22c55e" },
                        { label: "Critical",    value: counts.critical,   color: "#dc2626" },
                    ].map(chip => (
                        <div key={chip.label} style={{
                            background: chip.color + "11",
                            border: `1px solid ${chip.color}33`,
                            borderRadius: "999px",
                            padding: "0.35rem 0.9rem",
                            display: "flex", alignItems: "center", gap: "0.4rem",
                        }}>
                            <span style={{ fontWeight: 700, color: chip.color, fontSize: "1rem" }}>{chip.value}</span>
                            <span style={{ fontSize: "0.72rem", color: "#4b5563", fontWeight: 600 }}>{chip.label}</span>
                        </div>
                    ))}
                </div>

                {/* ── FILTERS ── */}
                <div className="staff-toolbar">
                    <div className="staff-filters">
                        {[
                            ["status",   "Status",   "PENDING,ASSIGNED,IN_PROGRESS,RESOLVED,DECLINED"],
                            ["priority", "Priority", "LOW,MEDIUM,HIGH,CRITICAL"],
                            ["category", "Category", "TRANSPORT,WATER,ELECTRICITY,WASTE"],
                        ].map(([key, label, opts]) => (
                            <select key={key} className="staff-select"
                                    value={filter[key]}
                                    onChange={e => setFilter(f => ({ ...f, [key]: e.target.value }))}>
                                <option value="">{label}: All</option>
                                {opts.split(",").map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                        ))}
                        <button className="staff-btn-outline" onClick={fetchComplaints}>↻ Reload</button>
                    </div>
                    <div className="staff-toolbar-right">
                        <span className="staff-count-badge">
                            {complaints.length} complaint{complaints.length !== 1 ? "s" : ""}
                        </span>
                    </div>
                </div>

                {/* ── TABLE ── */}
                {loading ? (
                    <div className="staff-loading"><div className="staff-spinner" /><span>Loading complaints…</span></div>
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
                                <th>Photo</th>
                                <th>Age</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {complaints.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="staff-empty-row">
                                        <span style={{ fontSize: "1.5rem", display: "block", marginBottom: "0.4rem" }}>📭</span>
                                        No complaints match the current filters
                                    </td>
                                </tr>
                            )}
                            {complaints.map(c => (
                                <tr key={c.id} style={{ cursor: "pointer" }}
                                    onClick={() => setSelectedId(c.id)}>
                                    <td style={{ fontFamily: "monospace", color: "#2563eb" }}>#{c.id}</td>
                                    <td style={{ fontWeight: 600, color: "#111827", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {CATEGORY_ICONS[c.category] || "📋"} {c.title}
                                    </td>
                                    <td><Badge value={c.category} colorMap={{ TRANSPORT:"#f59e0b", WATER:"#3b82f6", ELECTRICITY:"#eab308", WASTE:"#22c55e" }} /></td>
                                    <td style={{ fontSize: "0.82rem" }}>{c.area || "—"}</td>
                                    <td><Badge value={c.priority} colorMap={PRIORITY_COLORS} /></td>
                                    <td><Badge value={c.status}   colorMap={STATUS_COLORS} /></td>
                                    <td style={{ textAlign: "center" }}>
                                        {c.photoUrl ? (
                                            <img src={c.photoUrl} alt="evidence"
                                                 className="staff-photo-thumb"
                                                 onClick={e => { e.stopPropagation(); setSelectedId(c.id); }} />
                                        ) : <span style={{ color: "#9ca3af" }}>—</span>}
                                    </td>
                                    <td style={{ fontFamily: "monospace", fontSize: "0.78rem", color: "#6b7280" }}>
                                        {timeAgo(c.createdAt)}
                                    </td>
                                    <td onClick={e => e.stopPropagation()}>
                                        <div style={{ display: "flex", gap: "0.3rem" }}>
                                            <button className="staff-act-btn" title="View detail"
                                                    onClick={() => setSelectedId(c.id)}>👁</button>
                                            {c.status !== "IN_PROGRESS" && c.status !== "RESOLVED" && (
                                                <button className="staff-act-btn" title="Set In Progress"
                                                        onClick={e => quickStatus(e, c.id, "IN_PROGRESS")}>⚙️</button>
                                            )}
                                            {c.status !== "RESOLVED" && (
                                                <button className="staff-act-btn" title="Mark Resolved"
                                                        onClick={e => quickStatus(e, c.id, "RESOLVED")}>✅</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ── DETAIL MODAL ── */}
                {selectedId && (
                    <ComplaintModal
                        id={selectedId}
                        onClose={() => { setSelectedId(null); navigate("/staff/complaints", { replace: true }); }}
                        onUpdated={fetchComplaints}
                    />
                )}
            </div>
        </StaffLayout>
    );
}