import API_BASE_URL from "../config/apiBaseUrl";

export const login = async (data) => {
    return fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
};
