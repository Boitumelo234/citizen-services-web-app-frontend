import React, { useState, useEffect } from 'react';
import { getSystemSettings, updateSystemSettings } from '../services/SettingsService';

const SystemSettingsPage = () => {
    const [settings, setSettings] = useState({
        autoRoutingEnabled: false,
        adminEmailNotifications: false,
        maintenanceMode: false,
        defaultLanguage: 'en',
        highContrastMode: false,
        baseFontSize: 16,
        emergencyAnnouncement: ''
    });

    useEffect(() => {
        getSystemSettings().then(res => setSettings(res.data));
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings({
            ...settings,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSave = async () => {
        try {
            await updateSystemSettings(settings);
            alert("System settings updated successfully!");
        } catch (error) {
            alert("Error updating settings.");
        }
    };

    return (
        <div className="settings-container" style={{ padding: '2rem', color: '#fff', backgroundColor: '#0a0a0a' }}>
            <h1 style={{ borderBottom: '1px solid #333', paddingBottom: '1rem' }}>Global System Settings</h1>

            {/* --- SYSTEM STATE --- */}
            <div className="settings-card" style={cardStyle}>
                <h3>System Status</h3>
                <label style={labelStyle}>
                    <input type="checkbox" name="maintenanceMode" checked={settings.maintenanceMode} onChange={handleChange} />
                    Enable Maintenance Mode (Blocks Public Access)
                </label>
                <label style={labelStyle}>
                    Emergency Banner Message:
                    <input type="text" name="emergencyAnnouncement" value={settings.emergencyAnnouncement} onChange={handleChange} style={inputStyle} placeholder="e.g. Scheduled power outage at 2PM" />
                </label>
            </div>

            {/* --- ACCESSIBILITY & LOCALIZATION --- */}
            <div className="settings-card" style={cardStyle}>
                <h3>Accessibility & Language</h3>
                <label style={labelStyle}>
                    Default System Language:
                    <select name="defaultLanguage" value={settings.defaultLanguage} onChange={handleChange} style={inputStyle}>
                        <option value="en">English</option>
                        <option value="zu">isiZulu</option>
                        <option value="af">Afrikaans</option>
                        <option value="xh">isiXhosa</option>
                    </select>
                </label>
                <label style={labelStyle}>
                    <input type="checkbox" name="highContrastMode" checked={settings.highContrastMode} onChange={handleChange} />
                    Default High Contrast for New Users
                </label>
            </div>

            <button onClick={handleSave} style={saveButtonStyle}>SAVE CHANGES</button>
        </div>
    );
};

// Simple inline styles for demonstration
const cardStyle = { background: '#111', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #222' };
const labelStyle = { display: 'block', marginBottom: '1rem', fontSize: '0.9rem', color: '#ccc' };
const inputStyle = { display: 'block', width: '100%', padding: '0.5rem', marginTop: '0.5rem', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' };
const saveButtonStyle = { padding: '1rem 2rem', background: '#fff', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '30px', cursor: 'pointer' };

export default SystemSettingsPage;