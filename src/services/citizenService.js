import api from "./api";

export const getDashboard = async () => {
    const { data } = await api.get("/citizen/dashboard");
    return data;
};

export const getOverview = async () => {
    const { data } = await api.get("/citizen/overview");
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

export const getNotifications = async () => {
    const { data } = await api.get("/citizen/notifications");
    return data;
};

export const markNotificationRead = async (id) => {
    await api.patch(`/citizen/notifications/${id}/read`);
};

export const markAllNotificationsRead = async () => {
    await api.patch("/citizen/notifications/read-all");
};

export const getMapComplaints = async () => {
    const { data } = await api.get("/complaints/map");
    return data;
};
