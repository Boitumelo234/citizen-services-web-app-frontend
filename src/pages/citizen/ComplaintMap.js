// ComplaintMap.jsx
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../styles/dashboard.css';

// Fix default Leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const userPinIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color:#2563eb;width:30px;height:30px;border-radius:50%;border:3px solid white;box-shadow:0 4px 12px rgba(37,99,235,0.45);display:flex;align-items:center;justify-content:center;">
            <div style="width:11px;height:11px;background:white;border-radius:50%;"></div>
          </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -18],
});

function LocationPicker({ onLocationSelect, selectedLocation }) {
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            onLocationSelect({ lat, lng });
        },
    });

    return selectedLocation ? (
        <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={userPinIcon}>
            <Popup>
                <div style={{ fontFamily: 'inherit', fontSize: '0.85rem' }}>
                    <p style={{ margin: 0, fontWeight: 700, marginBottom: '0.3rem' }}>📍 Pinned Location</p>
                    <p style={{ margin: 0, color: '#64748b' }}>Lat: {selectedLocation.lat.toFixed(6)}</p>
                    <p style={{ margin: 0, color: '#64748b' }}>Lng: {selectedLocation.lng.toFixed(6)}</p>
                </div>
            </Popup>
        </Marker>
    ) : null;
}

function ComplaintFormModal({ selectedLocation, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({ category: '', location: '', description: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const categories = [
        'Pothole / Road Damage', 'Water Leak / Burst Pipe', 'Power Outage',
        'Streetlight Fault', 'Illegal Dumping', 'Sewer Overflow', 'Other',
    ];

    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, []);

    // Close on Escape
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onCancel(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onCancel]);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) { setError('File too large (max 10 MB)'); return; }
        setSelectedFile(file);
        setError(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        if (file.type.startsWith('image/')) setPreviewUrl(URL.createObjectURL(file));
    };

    const clearFile = () => {
        if (previewUrl) { URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }
        setSelectedFile(null);
        const input = document.getElementById('map-complaint-file');
        if (input) input.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);
        setError(null);

        const token = localStorage.getItem('access_token') || localStorage.getItem('token');
        if (!token) { setError('Please log in first.'); setSubmitting(false); return; }

        try {
            const body = new FormData();
            body.append('data', new Blob([JSON.stringify({
                category: formData.category,
                location: formData.location || `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`,
                description: formData.description,
                latitude: selectedLocation.lat,
                longitude: selectedLocation.lng,
            })], { type: 'application/json' }));
            if (selectedFile) body.append('photo', selectedFile);

            const response = await fetch('http://localhost:8081/api/complaints', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body,
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.error || err.message || `Server error (${response.status})`);
            }

            const data = await response.json();
            setMessage(`Complaint submitted! Reference: ${data.referenceNumber || '—'}`);
            setTimeout(() => onSubmit(data), 1500);
        } catch (err) {
            setError(err.message || 'Failed to submit. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const inputStyle = {
        width: '100%', boxSizing: 'border-box',
        border: '1px solid #cbd5e1', borderRadius: '0.75rem',
        padding: '0.8rem 0.95rem', fontSize: '0.9rem',
        color: '#1e293b', background: '#f8fafc',
        outline: 'none', fontFamily: 'inherit',
        transition: 'border-color 0.15s',
    };

    return (
        <div
            onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
            style={{
                position: 'fixed', inset: 0,
                background: 'rgba(15,23,42,0.55)',
                backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 99999, padding: '1.25rem',
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: '#fff', borderRadius: '1.25rem',
                    width: '100%', maxWidth: '520px', maxHeight: '90vh',
                    display: 'flex', flexDirection: 'column',
                    boxShadow: '0 32px 64px rgba(15,23,42,0.22), 0 0 0 1px rgba(226,232,240,0.8)',
                    overflow: 'hidden',
                }}
            >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', background: '#fafbfc', flexShrink: 0 }}>
                    <div>
                        <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Report Issue</p>
                        <h2 style={{ margin: '0.2rem 0 0', fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>New Complaint</h2>
                    </div>
                    <button onClick={onCancel} aria-label="Close" style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: '1.35rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                </div>

                {/* Body */}
                <div style={{ overflowY: 'auto', flex: 1, padding: '1.5rem' }}>

                    {message && (
                        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderLeft: '3px solid #16a34a', borderRadius: '0.65rem', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#15803d', fontSize: '0.875rem', fontWeight: 600 }}>
                            ✓ {message}
                        </div>
                    )}
                    {error && (
                        <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderLeft: '3px solid #ef4444', borderRadius: '0.65rem', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#dc2626', fontSize: '0.875rem' }}>
                            {error}
                        </div>
                    )}

                    {/* Location pill */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', padding: '0.65rem 1rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.75rem' }}>
                        <span style={{ fontSize: '1rem' }}>📍</span>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pinned Location</p>
                            <p style={{ margin: 0, fontSize: '0.82rem', color: '#3b82f6', fontWeight: 600 }}>
                                {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                            </p>
                        </div>
                    </div>

                    <form id="map-complaint-form" onSubmit={handleSubmit}>
                        {/* Category */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.45rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                                Category <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <select
                                required value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                style={{ ...inputStyle, appearance: 'none' }}
                                onFocus={e => e.target.style.borderColor = '#2563eb'}
                                onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                            >
                                <option value="">Select a category…</option>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>

                        {/* Location name */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.45rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                                Location name <span style={{ color: '#94a3b8', fontWeight: 500 }}>(optional)</span>
                            </label>
                            <input
                                type="text" value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="e.g. Main Street, near Shoprite"
                                style={inputStyle}
                                onFocus={e => e.target.style.borderColor = '#2563eb'}
                                onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                            />
                        </div>

                        {/* Description */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.45rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                                Description <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <textarea
                                required rows={4} value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe the issue in detail…"
                                style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
                                onFocus={e => e.target.style.borderColor = '#2563eb'}
                                onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                            />
                        </div>

                        {/* Photo upload */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.45rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                                Attach photo <span style={{ color: '#94a3b8', fontWeight: 500 }}>(optional · max 10 MB)</span>
                            </label>
                            {!selectedFile ? (
                                <label htmlFor="map-complaint-file" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', padding: '1.5rem', border: '2px dashed #cbd5e1', borderRadius: '0.9rem', background: '#f8fafc', cursor: 'pointer', transition: 'all 0.15s' }}
                                       onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.background = '#eff6ff'; }}
                                       onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#f8fafc'; }}>
                                    <span style={{ fontSize: '1.5rem' }}>📷</span>
                                    <span style={{ fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Click to upload</span>
                                    <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>JPG, PNG, GIF</span>
                                    <input id="map-complaint-file" type="file" accept="image/jpeg,image/png,image/gif" onChange={handleFileChange} style={{ display: 'none' }} />
                                </label>
                            ) : (
                                <div style={{ border: '1px solid #bbf7d0', background: '#f0fdf4', borderRadius: '0.9rem', padding: '0.75rem' }}>
                                    {previewUrl && <img src={previewUrl} alt="Preview" style={{ display: 'block', width: '100%', maxHeight: '180px', objectFit: 'contain', borderRadius: '0.6rem', marginBottom: '0.5rem' }} />}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 600, wordBreak: 'break-all' }}>✓ {selectedFile.name}</span>
                                        <button type="button" onClick={clearFile} style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: '0.45rem', padding: '0.25rem 0.65rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', flexShrink: 0, marginLeft: '0.75rem' }}>Remove</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #f1f5f9', background: '#fafbfc', display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', flexShrink: 0 }}>
                    <button type="button" onClick={onCancel} style={{ padding: '0.65rem 1.35rem', borderRadius: '0.65rem', border: '1px solid #e2e8f0', background: '#fff', color: '#475569', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
                        Cancel
                    </button>
                    <button type="submit" form="map-complaint-form" disabled={submitting}
                            style={{ padding: '0.65rem 1.75rem', borderRadius: '0.65rem', background: submitting ? '#93c5fd' : '#2563eb', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {submitting ? (
                            <><span style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />Submitting…</>
                        ) : 'Submit Report'}
                    </button>
                </div>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

function ComplaintMap() {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const rustenburgCenter = [-25.67, 27.24];
    const defaultZoom = 13;

    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
        setShowForm(true);
    };

    return (
        <div className="dashboard-container">
            <div style={{ marginBottom: '1.75rem' }}>
                <h1 className="dashboard-title">Report a Complaint</h1>
                <p className="subtitle">Click anywhere on the map to pin the exact location of your issue</p>
            </div>

            <div className="card" style={{ padding: '1.25rem', overflow: 'hidden' }}>
                {/* Map */}
                <div style={{ height: '560px', width: '100%', borderRadius: '0.9rem', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <MapContainer center={rustenburgCenter} zoom={defaultZoom} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationPicker onLocationSelect={handleLocationSelect} selectedLocation={selectedLocation} />
                    </MapContainer>
                </div>

                {/* Tip */}
                <div style={{ marginTop: '1rem', padding: '0.9rem 1.1rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.85rem', display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>📍</span>
                    <div>
                        <p style={{ margin: 0, fontWeight: 700, color: '#1d4ed8', fontSize: '0.88rem', marginBottom: '0.25rem' }}>How to report a complaint</p>
                        <p style={{ margin: 0, color: '#3b82f6', fontSize: '0.82rem', lineHeight: 1.6 }}>
                            1. Click anywhere on the map to drop a pin at the exact location.<br />
                            2. Fill in the complaint details in the form that appears.<br />
                            3. Submit your report — we'll take it from there.
                        </p>
                    </div>
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.85rem' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#2563eb', border: '2px solid #fff', boxShadow: '0 2px 6px rgba(37,99,235,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 7, height: 7, background: '#fff', borderRadius: '50%' }} />
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Your selected pin location</span>
                </div>
            </div>

            {showForm && selectedLocation && (
                <ComplaintFormModal
                    selectedLocation={selectedLocation}
                    onSubmit={() => { setShowForm(false); setSelectedLocation(null); }}
                    onCancel={() => { setShowForm(false); setSelectedLocation(null); }}
                />
            )}
        </div>
    );
}

export default ComplaintMap;
