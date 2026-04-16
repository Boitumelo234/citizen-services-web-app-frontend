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
export const getDashboardStats = () => api.get("/admin/dashboard");

// ─── Complaints ───────────────────────────────────────────────────────────────
export const getAllComplaints   = ()             => api.get("/admin/complaints");
export const getComplaintById  = (id)           => api.get(`/admin/complaints/${id}`);
export const updateComplaintStatus = (id, data) => api.put(`/admin/complaints/${id}/status`, data);
export const createComplaint   = (data)         => api.post("/admin/complaints", data);

// ─── Users ────────────────────────────────────────────────────────────────────
export const getAllUsers   = () => api.get("/admin/users");
export const getUserCount = () => api.get("/admin/users/count");

export default api;
