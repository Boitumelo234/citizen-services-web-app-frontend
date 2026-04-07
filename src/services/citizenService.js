import api from "./api";

export const getDashboard = async () => {
    const { data } = await api.get("/api/citizen/dashboard");
    return data;
};

export const getOverview = async () => {
    const { data } = await api.get("/api/citizen/overview");
    return data;
};

export const getProfile = async () => {
    const { data } = await api.get("/api/citizen/profile");
    return data;
};

export const updateProfile = async (payload) => {
    const { data } = await api.put("/api/citizen/profile", payload);
    return data;
};

export const getNotifications = async () => {
    const { data } = await api.get("/api/citizen/notifications");
    return data;
};

export const markNotificationRead = async (id) => {
    await api.patch(`/api/citizen/notifications/${id}/read`);
};

export const markAllNotificationsRead = async () => {
    await api.patch("/api/citizen/notifications/read-all");
};
