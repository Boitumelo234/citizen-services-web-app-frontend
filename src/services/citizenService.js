import api from "./api";

export const getDashboard = async () => {
    const { data } = await api.get("/citizen/dashboard");
    return data;
};

export const getOverview = async () => {
    const { data } = await api.get("/citizen/overview");
    return data;
};

export const getMyComplaints = async () => {
    const { data } = await api.get("/complaints");
    return data;
};

export const getProfile = async () => {
    const { data } = await api.get("/citizen/profile");
    return data;
};

export const updateProfile = async (payload) => {
    const { data } = await api.put("/citizen/profile", payload);
    return data;
};

// Notifications
export const getNotifications = () =>
    api.get("/citizen/notifications").then(r => r.data);

export const markNotificationRead = (id) =>
    api.patch(`/citizen/notifications/${id}/read`).then(r => r.data);

export const markAllNotificationsRead = () =>
    api.patch("/citizen/notifications/read-all").then(r => r.data);

export const getMapComplaints = async () => {
    const { data } = await api.get("/complaints/map");
    return data;
};