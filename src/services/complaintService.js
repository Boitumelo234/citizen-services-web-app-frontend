import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api/complaints",
});

const complaintService = {

    getAllComplaints: async () => {
        const res = await api.get("/");
        return res.data;
    },

    updateStatus: async (id, status) => {
        const res = await api.put(`/${id}/status?status=${status}`);
        return res.data;
    },

    assignComplaint: async (id, assignedTo) => {
        const res = await api.put(`/${id}/assign?assignedTo=${assignedTo}`);
        return res.data;
    },

    // 🔥 SINGLE DASHBOARD API
    getDashboardData: async () => {
        const res = await api.get("/stats");
        return res.data;
    }

};

export default complaintService;