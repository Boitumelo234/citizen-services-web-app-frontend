// pages/staff/StaffProfile.jsx
import { useEffect, useState, useCallback } from "react";
import StaffLayout from "../../components/layout/StaffLayout";
import { getProfile, updateProfile, changePassword, getMyComplaints } from "../../services/staffService";
import "../../styles/staff.css";

export function StaffProfile() {
    const [profile, setProfile]   = useState(null);
    const [form, setForm]         = useState({ fullName: "", phone: "", email: "" });
    const [pwForm, setPwForm]     = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [saving, setSaving]     = useState(false);
    const [pwSaving, setPwSaving] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [toast, setToast]       = useState(null);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const [prof, comps] = await Promise.all([
                getProfile(),
                getMyComplaints(),
            ]);
            setProfile(prof);
            setForm({ fullName: prof.fullName || "", phone: prof.phone || "", email: prof.email || "" });
            setComplaints(Array.isArray(comps) ? comps : []);
        } catch {
            showToast("Failed to load profile", "error");
        }
        setLoading(false);
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            await updateProfile(form);
            showToast("Profile updated successfully");
            setEditMode(false);
            fetchAll();
        } catch {
            showToast("Failed to update profile", "error");
        }
        setSaving(false);
    };

    const handleChangePassword = async () => {
        if (pwForm.newPassword !== pwForm.confirmPassword) {
            showToast("Passwords do not match", "error");
            return;
        }
        if (pwForm.newPassword.length < 6) {
            showToast("Password must be at least 6 characters", "error");
            return;
        }
        setPwSaving(true);
        try {
            await changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
            showToast("Password changed successfully");
            setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch {
            showToast("Failed to change password. Check current password.", "error");
        }
        setPwSaving(false);
    };

    // Derived performance stats
    const resolved   = complaints.filter(c => c.status === "RESOLVED").length;
    const inProgress = complaints.filter(c => c.status === "IN_PROGRESS").length;
    const pending    = complaints.filter(c => c.status === "PENDING" || c.status === "ASSIGNED").length;
    const resRate    = complaints.length > 0 ? Math.round((resolved / complaints.length) * 100) : 0;

    const inputStyle = {
        width: "100%",
        border: "1px solid #e5e7eb",
        borderRadius: "0.75rem",
        padding: "0.65rem 0.9rem",
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.875rem",
        color: "#111827",
        background: "#fff",
        outline: "none",
        transition: "border-color 0.15s",
    };

    if (loading) {
        return (
            <StaffLayout>
                <div className="staff-page">
                    <div className="staff-loading">
                        <div className="staff-spinner" />
                        <span>Loading profile…</span>
                    </div>
                </div>
            </StaffLayout>
        );
    }

    const initials = (profile?.fullName || profile?.email || "S")[0].toUpperCase();

    return (
        <StaffLayout>
            <div className="staff-page">
                <div className="staff-page-header">
                    <div>
                        <h2 className="staff-page-title">👤 My Profile</h2>
                        <p className="staff-page-sub">Manage your account information and security</p>
                    </div>
                </div>

                {toast && <div className={`staff-toast ${toast.type}`}>{toast.msg}</div>}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1.5rem" }}>

                    {/* ── LEFT: Avatar + Stats ── */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

                        {/* Avatar card */}
                        <div className="staff-card" style={{ textAlign: "center", padding: "2rem 1.5rem" }}>
                            <div className="staff-avatar-lg" style={{ margin: "0 auto 1rem" }}>{initials}</div>
                            <h3 style={{ fontFamily: "'Satoshi', 'Inter', sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "#0f172a", margin: "0 0 0.2rem" }}>
                                {profile?.fullName || "—"}
                            </h3>
                            <p style={{ fontSize: "0.82rem", color: "#6b7280", margin: "0 0 0.5rem" }}>{profile?.email}</p>
                            <span style={{
                                display: "inline-flex", alignItems: "center", gap: "0.35rem",
                                padding: "0.25rem 0.75rem", borderRadius: 999,
                                background: "#eff6ff", color: "#1d4ed8",
                                border: "1px solid #bfdbfe", fontSize: "0.75rem", fontWeight: 700,
                            }}>
                                🏢 {profile?.departmentName || "Department"}
                            </span>
                        </div>

                        {/* Performance stats */}
                        <div className="staff-card">
                            <h3 className="staff-card-title" style={{ marginBottom: "1rem" }}>📊 My Performance</h3>
                            {[
                                { label: "Total Assigned", value: complaints.length, color: "#2563eb" },
                                { label: "Resolved",       value: resolved,           color: "#22c55e" },
                                { label: "In Progress",    value: inProgress,         color: "#3b82f6" },
                                { label: "Pending",        value: pending,            color: "#ef4444" },
                            ].map(s => (
                                <div key={s.label} style={{
                                    display: "flex", justifyContent: "space-between",
                                    alignItems: "center", padding: "0.65rem 0",
                                    borderBottom: "1px solid #f3f4f6",
                                }}>
                                    <span style={{ fontSize: "0.82rem", color: "#4b5563", fontWeight: 500 }}>{s.label}</span>
                                    <span style={{ fontWeight: 700, color: s.color, fontSize: "1rem" }}>{s.value}</span>
                                </div>
                            ))}
                            <div style={{ marginTop: "1rem" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                                    <span style={{ fontSize: "0.78rem", color: "#6b7280", fontWeight: 600 }}>Resolution Rate</span>
                                    <span style={{ fontWeight: 700, color: resRate >= 70 ? "#22c55e" : resRate >= 40 ? "#f59e0b" : "#ef4444" }}>{resRate}%</span>
                                </div>
                                <div className="staff-progress-wrap">
                                    <div className="staff-progress-fill" style={{
                                        width: `${resRate}%`,
                                        background: resRate >= 70 ? "#22c55e" : resRate >= 40 ? "#f59e0b" : "#ef4444",
                                    }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT: Edit form + password ── */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

                        {/* Profile details */}
                        <div className="staff-card">
                            <div className="staff-card-head">
                                <h3 className="staff-card-title">📝 Personal Information</h3>
                                <button
                                    className={editMode ? "staff-btn-primary" : "staff-btn-outline"}
                                    style={{ padding: "0.4rem 0.85rem", fontSize: "0.8rem" }}
                                    onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                                    disabled={saving}
                                >
                                    {saving ? "Saving…" : editMode ? "💾 Save" : "✏ Edit"}
                                </button>
                            </div>

                            {[
                                { key: "fullName", label: "Full Name",     type: "text" },
                                { key: "email",    label: "Email Address", type: "email" },
                                { key: "phone",    label: "Phone Number",  type: "tel" },
                            ].map(field => (
                                <div key={field.key} className="staff-profile-field">
                                    <label>{field.label}</label>
                                    {editMode ? (
                                        <input
                                            type={field.type}
                                            value={form[field.key]}
                                            onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                                            style={inputStyle}
                                            onFocus={e => e.target.style.borderColor = "#2563eb"}
                                            onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                                        />
                                    ) : (
                                        <p>{form[field.key] || "—"}</p>
                                    )}
                                </div>
                            ))}

                            {/* Read-only fields */}
                            {[
                                { label: "Role",       value: profile?.role || "STAFF" },
                                { label: "Department", value: profile?.departmentName || "—" },
                                { label: "Member Since", value: profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "—" },
                            ].map(field => (
                                <div key={field.label} className="staff-profile-field">
                                    <label>{field.label}</label>
                                    <p>{field.value}</p>
                                </div>
                            ))}

                            {editMode && (
                                <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #e5e7eb" }}>
                                    <button className="staff-btn-outline" onClick={() => { setEditMode(false); fetchAll(); }}>Cancel</button>
                                    <button className="staff-btn-primary" onClick={handleSaveProfile} disabled={saving}>
                                        {saving ? "Saving…" : "Save Changes"}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Change Password */}
                        <div className="staff-card">
                            <div className="staff-card-head">
                                <h3 className="staff-card-title">🔐 Change Password</h3>
                            </div>
                            {[
                                { key: "currentPassword", label: "Current Password", placeholder: "Enter current password" },
                                { key: "newPassword",     label: "New Password",     placeholder: "At least 6 characters" },
                                { key: "confirmPassword", label: "Confirm Password", placeholder: "Repeat new password" },
                            ].map(f => (
                                <div key={f.key} style={{ marginBottom: "0.85rem" }}>
                                    <label style={{
                                        display: "block", marginBottom: "0.35rem",
                                        fontSize: "0.78rem", fontWeight: 700,
                                        textTransform: "uppercase", letterSpacing: "0.05em",
                                        color: "#6b7280",
                                    }}>{f.label}</label>
                                    <input
                                        type="password"
                                        placeholder={f.placeholder}
                                        value={pwForm[f.key]}
                                        onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                                        style={inputStyle}
                                        onFocus={e => e.target.style.borderColor = "#2563eb"}
                                        onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                                    />
                                </div>
                            ))}
                            <div style={{ marginTop: "1rem" }}>
                                <button
                                    className="staff-btn-primary"
                                    onClick={handleChangePassword}
                                    disabled={pwSaving || !pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword}
                                >
                                    {pwSaving ? "Updating…" : "🔐 Update Password"}
                                </button>
                            </div>
                        </div>

                        {/* Account security info */}
                        <div className="staff-card" style={{ background: "#f8fafc" }}>
                            <h3 className="staff-card-title" style={{ marginBottom: "0.85rem" }}>🛡 Account Security</h3>
                            {[
                                "Your session uses a JWT token valid for 24 hours",
                                "Passwords are stored securely using BCrypt hashing",
                                "Contact your admin if you are locked out",
                            ].map((item, i) => (
                                <div key={i} style={{ display: "flex", gap: "0.5rem", padding: "0.4rem 0", borderBottom: i < 2 ? "1px solid #f1f5f9" : "none" }}>
                                    <span style={{ color: "#22c55e", fontSize: "0.8rem" }}>✓</span>
                                    <span style={{ fontSize: "0.82rem", color: "#4b5563" }}>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}