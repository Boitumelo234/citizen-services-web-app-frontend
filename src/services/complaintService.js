import API_URL from "./api";

export const submitComplaint = async (data) => {
    return fetch(`${API_URL}/complaints`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
};