import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
});

// Attach JWT token from localStorage to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ─── Dashboard stats (AdminDashboard + AdminOverview) ─────────────────────────
export const getDashboardStats = () => api.get("/api/admin/dashboard");

// ─── Complaints ───────────────────────────────────────────────────────────────
export const getAllComplaints   = ()             => api.get("/api/admin/complaints");
export const getComplaintById  = (id)           => api.get(`/api/admin/complaints/${id}`);
export const updateComplaintStatus = (id, data) => api.put(`/api/admin/complaints/${id}/status`, data);
export const createComplaint   = (data)         => api.post("/api/admin/complaints", data);

// ─── Users ────────────────────────────────────────────────────────────────────
export const getAllUsers   = () => api.get("/api/admin/users");
export const getUserCount = () => api.get("/api/admin/users/count");

export default api;