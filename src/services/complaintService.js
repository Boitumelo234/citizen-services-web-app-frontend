import API_BASE_URL from "../config/apiBaseUrl";

export const submitComplaint = async (data) => {
    return fetch(`${API_BASE_URL}/api/complaints`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
};
