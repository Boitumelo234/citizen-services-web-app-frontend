// SystemSettings.jsx
import { useEffect, useState } from "react";
import api from "../../api/api";
import '../../styles/dashboard.css';

function SystemSettings() {
    const [settings, setSettings] = useState({
        autoRoutingEnabled: false,
        adminEmailNotifications: false,
        rolePermissions: {
            AGENT: { viewAssigned: true, viewReports: false, manageUsers: false },
            DEPT_HEAD: { viewDeptQueue: true, assignDept: true, systemSettings: false },
            ADMIN: { fullAccess: true, manageUsers: true, systemConfig: true }
        }
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get("/api/settings");
                setSettings(response.data);
            } catch (error) {
                console.error("Failed to fetch settings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleToggle = (field) => {
        setSettings(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleRoleToggle = (role, perm) => {
        setSettings(prev => ({
            ...prev,
            rolePermissions: {
                ...prev.rolePermissions,
                [role]: {
                    ...prev.rolePermissions[role],
                    [perm]: !prev.rolePermissions[role][perm]
                }
            }
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put("/api/settings", settings);
            alert("Settings saved successfully!");
        } catch (error) {
            console.error("Failed to save settings:", error);
            alert("Failed to save settings. Check console.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p>Loading settings...</p>;

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">System Settings</h1>
            <p className="subtitle">Configure platform behavior, notifications & access rules</p>

            <div className="space-y-8 mt-8">

                {/* General Settings */}
                <div className="card">
                    <div className="p-6 pt-8">
                        <h3 className="section-title">General Settings</h3>
                        <div className="mt-6 space-y-6">

                            <div className="flex justify-between items-center">
                                <div>
                                    <label className="font-medium">Auto-routing enabled</label>
                                    <p className="text-sm text-[var(--text-light)]">
                                        Automatically assign complaints to departments
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.autoRoutingEnabled}
                                    onChange={() => handleToggle("autoRoutingEnabled")}
                                />
                            </div>

                            <div className="flex justify-between items-center">
                                <div>
                                    <label className="font-medium">Email notifications for admins</label>
                                    <p className="text-sm text-[var(--text-light)]">Receive daily summary emails</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.adminEmailNotifications}
                                    onChange={() => handleToggle("adminEmailNotifications")}
                                />
                            </div>

                        </div>
                    </div>
                </div>

                {/* Role Permissions Editable */}
                <div className="card">
                    <div className="p-6 pt-8">
                        <h3 className="section-title">Role Permissions</h3>
                        <p className="text-[var(--text-medium)] mt-4 mb-6">
                            Configure what each role can access and perform
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                            {/* Agent */}
                            <div className="border border-[var(--border)] rounded-xl p-5">
                                <h4 className="font-medium mb-3">Agent</h4>
                                <ul className="text-sm space-y-2 text-[var(--text-medium)]">
                                    {Object.entries(settings.rolePermissions.AGENT).map(([perm, value]) => (
                                        <li key={perm}>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={value}
                                                    onChange={() => handleRoleToggle("AGENT", perm)}
                                                /> {perm.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Department Head */}
                            <div className="border border-[var(--border)] rounded-xl p-5">
                                <h4 className="font-medium mb-3">Department Head</h4>
                                <ul className="text-sm space-y-2 text-[var(--text-medium)]">
                                    {Object.entries(settings.rolePermissions.DEPT_HEAD).map(([perm, value]) => (
                                        <li key={perm}>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={value}
                                                    onChange={() => handleRoleToggle("DEPT_HEAD", perm)}
                                                /> {perm.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Admin */}
                            <div className="border border-[var(--border)] rounded-xl p-5">
                                <h4 className="font-medium mb-3">Administrator</h4>
                                <ul className="text-sm space-y-2 text-[var(--text-medium)]">
                                    {Object.entries(settings.rolePermissions.ADMIN).map(([perm, value]) => (
                                        <li key={perm}>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={value}
                                                    onChange={() => handleRoleToggle("ADMIN", perm)}
                                                /> {perm.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 mt-4"
                >
                    {saving ? "Saving..." : "Save Settings"}
                </button>

            </div>
        </div>
    );
}

export default SystemSettings;