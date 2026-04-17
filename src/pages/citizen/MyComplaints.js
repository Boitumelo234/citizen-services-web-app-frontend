import '../../styles/dashboard.css';
import { Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { MapPin } from 'lucide-react';
import ComplaintDetailsModal from '../citizen/modal/ComplaintDetailsModal';
import AddUpdateModal from '../citizen/modal/AddUpdateModal';

const stickerConfig = {
    'Infrastructure & Roads': {
        icon: 'https://em-content.zobj.net/source/apple/391/construction_1f6a7.png',
        background: 'linear-gradient(135deg, #fb923c, #ef4444)',
    },
    'Power Outage': {
        icon: 'https://em-content.zobj.net/source/apple/391/high-voltage_26a1.png',
        background: 'linear-gradient(135deg, #facc15, #f97316)',
    },
    'Water & Sanitation': {
        icon: 'https://em-content.zobj.net/source/apple/391/potable-water_1f6b0.png',
        background: 'linear-gradient(135deg, #38bdf8, #2563eb)',
    },
    'Electricity & Energy': {
        icon: 'https://em-content.zobj.net/source/apple/391/electric-plug_1f50c.png',
        background: 'linear-gradient(135deg, #facc15, #eab308)',
    },
    'Illegal Dumping': {
        icon: 'https://em-content.zobj.net/source/apple/391/wastebasket_1f5d1-fe0f.png',
        background: 'linear-gradient(135deg, #14b8a6, #0f766e)',
    },
    Other: {
        icon: 'https://em-content.zobj.net/source/apple/391/clipboard_1f4cb.png',
        background: 'linear-gradient(135deg, #a78bfa, #6366f1)',
    },
};

function MyComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [imageErrors, setImageErrors] = useState({});

    const fetchComplaints = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem('access_token');
        if (!token) {
            setError('Please log in to view your complaints');
            setLoading(false);
            return;
        }
        try {
            const res = await fetch('http://localhost:8081/api/complaints', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to load complaints');
            const data = await res.json();
            setComplaints(data);
        } catch (err) {
            setError(err.message || 'Could not load complaints');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchComplaints();
    }, [fetchComplaints]);

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('en-ZA', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    const getImageUrl = (photoUrl) => {
        if (!photoUrl) return null;
        if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) return photoUrl;
        let filename = photoUrl;
        if (photoUrl.includes('/')) filename = photoUrl.split('/').pop();
        if (photoUrl.includes('\\')) filename = photoUrl.split('\\').pop();
        return `http://localhost:8081/api/files/${filename}`;
    };

    const handleImageError = (complaintId) => {
        setImageErrors((prev) => ({ ...prev, [complaintId]: true }));
    };

    const getSticker = (category) => stickerConfig[category] || stickerConfig.Other;

    const openDetails = (comp) => {
        setSelectedComplaint(comp);
        setShowDetails(true);
        setShowUpdate(false);
    };

    const openUpdate = (comp) => {
        setSelectedComplaint(comp);
        setShowUpdate(true);
        setShowDetails(false);
    };

    const closeAll = () => {
        setShowDetails(false);
        setShowUpdate(false);
        setSelectedComplaint(null);
    };

    const statusConfig = {
        resolved: { bg: '#ecfdf5', border: '#a7f3d0', text: '#047857', dot: '#10b981' },
        'in progress': { bg: '#fffbeb', border: '#fde68a', text: '#b45309', dot: '#f59e0b' },
        pending: { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8', dot: '#3b82f6' },
    };

    return (
        <div className="citizen-v2-page">
            <section className="citizen-v2-header enhanced">
                <div>
                    <h1>My Complaints</h1>
                    <p>Track the status of all your reported issues</p>
                </div>
                <Link className="citizen-v2-primary-btn my-complaints-header-btn" to="/citizen/submit">
                    New Complaint
                </Link>
            </section>

            {loading && (
                <article className="citizen-v2-card my-complaints-state">
                    <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid #e2e8f0', borderTopColor: '#2563eb', animation: 'spin 0.7s linear infinite' }} />
                    <p>Loading your complaints...</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </article>
            )}

            {error && !loading && (
                <article className="citizen-v2-card my-complaints-alert my-complaints-alert-error">
                    {error}
                </article>
            )}

            {!loading && !error && complaints.length === 0 && (
                <article className="citizen-v2-card my-complaints-state">
                    <span className="my-complaints-state-icon">Inbox</span>
                    <p className="my-complaints-state-title">No complaints yet</p>
                    <p className="my-complaints-state-copy">You haven't submitted any complaints yet.</p>
                    <Link to="/citizen/submit" className="citizen-v2-primary-btn">
                        Submit your first complaint
                    </Link>
                </article>
            )}

            {!loading && !error && complaints.length > 0 && (
                <section className="my-complaints-stack">
                    {complaints.map((comp) => {
                        const imageUrl = getImageUrl(comp.photoUrl);
                        const hasImageError = imageErrors[comp.id];
                        const statusKey = comp.status?.toLowerCase() || 'pending';
                        const sc = statusConfig[statusKey] || statusConfig.pending;
                        const sticker = getSticker(comp.category);

                        return (
                            <article key={comp.id} className="citizen-v2-card my-complaint-card">
                                <div className="my-complaint-top">
                                    <div className="my-complaint-heading">
                                        {sticker ? (
                                            <div
                                                className="my-complaint-sticker"
                                                style={{ background: sticker.background }}
                                            >
                                                <img
                                                    src={sticker.icon}
                                                    alt={comp.category}
                                                    className="my-complaint-sticker-icon"
                                                />
                                            </div>
                                        ) : null}
                                        <div>
                                            <p className="my-complaint-ref">{comp.referenceNumber}</p>
                                            <h3 className="my-complaint-title">{comp.category}</h3>
                                            <p className="my-complaint-meta">Submitted {formatDate(comp.createdAt)}</p>
                                        </div>
                                    </div>

                                    <span
                                        className="my-complaint-status my-complaint-status-pill"
                                    >
                                        {comp.status || 'Pending'}
                                    </span>
                                </div>

                                <p className="my-complaint-description">{comp.description}</p>

                                {comp.location && (
                                    <div className="my-complaint-location-block">
                                        <p className="my-complaint-location-title">Location</p>
                                        <div className="my-complaint-location-chip">
                                            <div className="my-complaint-location-icon">
                                                <MapPin size={16} />
                                            </div>
                                            <span>{comp.location}</span>
                                        </div>
                                    </div>
                                )}

                                {comp.photoUrl && !hasImageError && (
                                    <div className="my-complaint-media-wrap">
                                        <div className="my-complaint-media">
                                            <img
                                                src={imageUrl}
                                                alt="Complaint attachment"
                                                className="my-complaint-media-image"
                                                onError={() => handleImageError(comp.id)}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="my-complaint-actions">
                                    <button
                                        type="button"
                                        onClick={() => openDetails(comp)}
                                        className="my-complaint-secondary-btn"
                                    >
                                        View Details
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => openUpdate(comp)}
                                        className="citizen-v2-primary-btn"
                                    >
                                        Add Update
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </section>
            )}

            {showDetails && selectedComplaint && (
                <ComplaintDetailsModal
                    complaint={selectedComplaint}
                    onClose={closeAll}
                    formatDate={formatDate}
                    getImageUrl={getImageUrl}
                />
            )}
            {showUpdate && selectedComplaint && (
                <AddUpdateModal
                    complaint={selectedComplaint}
                    onClose={closeAll}
                    onSuccess={fetchComplaints}
                    getImageUrl={getImageUrl}
                />
            )}
        </div>
    );
}

export default MyComplaints;
