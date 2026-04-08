import { useEffect, useState } from "react";
import api from "../../api/api"; // make sure baseURL = http://localhost:8080/api

function SystemSettings() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await api.get("/SystemSettings"); // 🔹 match backend exactly
            setSettings(res.data);
        } catch (err) {
            console.error("Failed to fetch system settings:", err);
            alert("Failed to fetch system settings. Check console.");
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (key) => {
        try {
            const updated = { ...settings, [key]: !settings[key] };
            const res = await api.put("/SystemSettings", updated);
            setSettings(res.data);
        } catch (err) {
            console.error("Failed to update setting:", err);
            alert("Failed to update setting. Check console.");
        }
    };

    if (loading) return <p>Loading system settings...</p>;
    if (!settings) return <p>No settings found</p>;

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">System Settings</h1>
            <div className="p-4 border rounded bg-white">
                <div className="mb-4">
                    <label>
                        <input
                            type="checkbox"
                            checked={settings.autoRoutingEnabled}
                            onChange={() => handleToggle("autoRoutingEnabled")}
                        />
                        Auto Routing Enabled
                    </label>
                </div>
                <div className="mb-4">
                    <label>
                        <input
                            type="checkbox"
                            checked={settings.adminEmailNotifications}
                            onChange={() => handleToggle("adminEmailNotifications")}
                        />
                        Admin Email Notifications
                    </label>
                </div>
            </div>
        </div>
    );
}

export default SystemSettings;