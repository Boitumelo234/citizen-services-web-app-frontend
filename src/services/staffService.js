// services/staffService.js
// All API calls for the Staff side of the platform
import api from "../api/api";

// ── DASHBOARD ─────────────────────────────────────────────
export const getStaffDashboard = () =>
    api.get("/staff/dashboard").then(r => r.data);

// ── COMPLAINTS ────────────────────────────────────────────
export const getMyComplaints = (params = {}) => {
    const q = new URLSearchParams();
    if (params.status)   q.set("status",   params.status);
    if (params.priority) q.set("priority", params.priority);
    if (params.category) q.set("category", params.category);
    return api.get(`/staff/complaints?${q}`).then(r => r.data);
};

export const getComplaintById = (id) =>
    api.get(`/staff/complaints/${id}`).then(r => r.data);

export const updateComplaintStatus = (id, status) =>
    api.put(`/staff/complaints/${id}/status`, { status }).then(r => r.data);

export const addNote = (id, note) =>
    api.post(`/staff/complaints/${id}/notes`, { note }).then(r => r.data);

// ── NOTIFICATIONS ─────────────────────────────────────────
export const getNotifications = () =>
    api.get("/staff/notifications").then(r => r.data);

export const markNotificationRead = (id) =>
    api.put(`/staff/notifications/${id}/read`).then(r => r.data);

export const markAllNotificationsRead = () =>
    api.put("/staff/notifications/read-all").then(r => r.data);

// ── PROFILE ───────────────────────────────────────────────
export const getProfile = () =>
    api.get("/staff/profile").then(r => r.data);

export const updateProfile = (data) =>
    api.put("/staff/profile", data).then(r => r.data);

export const changePassword = (data) =>
    api.put("/staff/profile/password", data).then(r => r.data);