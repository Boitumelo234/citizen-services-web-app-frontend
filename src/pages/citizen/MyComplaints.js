<<<<<<< HEAD
// MyComplaints.jsx
=======
>>>>>>> 3b4c154 (feat: restyle my complaints page)
import '../../styles/dashboard.css';
import { Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import ComplaintDetailsModal from '../citizen/modal/ComplaintDetailsModal';
import AddUpdateModal from '../citizen/modal/AddUpdateModal';

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
<<<<<<< HEAD
            const res = await fetch('http://localhost:8080/api/complaints', {
=======
            const res = await fetch('http://localhost:8081/api/complaints', {
>>>>>>> 3b4c154 (feat: restyle my complaints page)
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

    useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

    const formatDate = (dateStr) => {
<<<<<<< HEAD
        if (!dateStr) return '—';
=======
        if (!dateStr) return '-';
>>>>>>> 3b4c154 (feat: restyle my complaints page)
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
<<<<<<< HEAD
        return `http://localhost:8080/api/files/${filename}`;
    };

    const handleImageError = (complaintId) => {
        setImageErrors(prev => ({ ...prev, [complaintId]: true }));
=======
        return `http://localhost:8081/api/files/${filename}`;
    };

    const handleImageError = (complaintId) => {
        setImageErrors((prev) => ({ ...prev, [complaintId]: true }));
>>>>>>> 3b4c154 (feat: restyle my complaints page)
    };

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

<<<<<<< HEAD
    // Status config
    const statusConfig = {
        resolved:     { bg: '#ecfdf5', border: '#a7f3d0', text: '#047857', dot: '#10b981' },
        'in progress':{ bg: '#fffbeb', border: '#fde68a', text: '#b45309', dot: '#f59e0b' },
        pending:      { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8', dot: '#3b82f6' },
    };

    return (
        <div className="dashboard-container">
            {/* ── Page header ── */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="dashboard-title">My Complaints</h1>
                <p className="subtitle">Track the status of all your reported issues</p>
            </div>

            {/* ── Loading ── */}
            {loading && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem', gap: '1rem', color: '#94a3b8' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid #e2e8f0', borderTopColor: '#2563eb', animation: 'spin 0.7s linear infinite' }} />
                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500 }}>Loading your complaints…</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            )}

            {/* ── Error ── */}
            {error && !loading && (
                <div style={{
                    background: '#fff5f5', border: '1px solid #fecaca',
                    borderLeft: '3px solid #ef4444', borderRadius: '0.75rem',
                    padding: '0.9rem 1.1rem', color: '#dc2626', fontSize: '0.9rem', marginBottom: '1.5rem',
                }}>
                    {error}
                </div>
            )}

            {/* ── Empty ── */}
            {!loading && !error && complaints.length === 0 && (
                <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
                    <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem' }}>📭</span>
                    <p style={{ margin: '0 0 0.5rem', fontWeight: 600, color: '#334155' }}>No complaints yet</p>
                    <p style={{ margin: '0 0 1.25rem', color: '#94a3b8', fontSize: '0.875rem' }}>You haven't submitted any complaints yet.</p>
                    <Link
                        to="/submit-complaint"
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                            background: '#2563eb', color: '#fff',
                            padding: '0.65rem 1.4rem', borderRadius: '999px',
                            fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none',
                        }}
                    >
                        Submit your first complaint →
                    </Link>
                </div>
            )}

            {/* ── Complaint cards ── */}
            {!loading && !error && complaints.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
=======
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
                <Link className="citizen-v2-primary-btn" to="/citizen/submit">
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
>>>>>>> 3b4c154 (feat: restyle my complaints page)
                    {complaints.map((comp) => {
                        const imageUrl = getImageUrl(comp.photoUrl);
                        const hasImageError = imageErrors[comp.id];
                        const statusKey = comp.status?.toLowerCase() || 'pending';
                        const sc = statusConfig[statusKey] || statusConfig.pending;

                        return (
<<<<<<< HEAD
                            <div key={comp.id} className="card" style={{ overflow: 'hidden' }}>
                                <div style={{ padding: '1.35rem 1.4rem' }}>
                                    {/* Card header */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem', gap: '1rem' }}>
                                        <div style={{ minWidth: 0 }}>
                                            <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                                                {comp.referenceNumber}
                                            </p>
                                            <h3 style={{ margin: 0, fontWeight: 700, color: '#0f172a', fontSize: '1rem', wordBreak: 'break-word' }}>
                                                {comp.category}
                                            </h3>
                                            <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                📅 {formatDate(comp.createdAt)}
                                            </p>
                                        </div>

                                        {/* Status badge */}
                                        <span style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                            padding: '0.3rem 0.8rem', borderRadius: '999px',
                                            background: sc.bg, border: `1px solid ${sc.border}`,
                                            color: sc.text, fontSize: '0.75rem', fontWeight: 700,
                                            whiteSpace: 'nowrap', flexShrink: 0,
                                        }}>
                                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: sc.dot, display: 'inline-block' }} />
                                            {comp.status || 'Pending'}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p style={{
                                        margin: '0 0 1rem', color: '#475569', fontSize: '0.875rem',
                                        lineHeight: 1.6,
                                        display: '-webkit-box', WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                                    }}>
                                        {comp.description}
                                    </p>

                                    {/* Location chip */}
                                    {comp.location && (
                                        <p style={{ margin: '0 0 0.85rem', fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                            📍 {comp.location}
                                        </p>
                                    )}

                                    {/* Thumbnail */}
                                    {comp.photoUrl && !hasImageError && (
                                        <div style={{ marginBottom: '1rem', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#f8fafc', maxHeight: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <img
                                                src={imageUrl}
                                                alt="Complaint attachment"
                                                style={{ width: '100%', maxHeight: '160px', objectFit: 'cover', display: 'block' }}
                                                onError={() => handleImageError(comp.id)}
                                            />
                                        </div>
                                    )}

                                    {/* Action buttons */}
                                    <div style={{ display: 'flex', gap: '0.65rem', paddingTop: '0.9rem', borderTop: '1px solid #f1f5f9' }}>
                                        <button
                                            onClick={() => openDetails(comp)}
                                            style={{
                                                flex: 1, padding: '0.6rem 1rem',
                                                background: '#eff6ff', border: '1px solid #bfdbfe',
                                                color: '#1d4ed8', borderRadius: '0.65rem',
                                                fontWeight: 700, fontSize: '0.83rem', cursor: 'pointer',
                                                transition: 'all 0.15s',
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.background = '#dbeafe'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = '#eff6ff'; }}
                                        >
                                            👁️ View Details
                                        </button>
                                        <button
                                            onClick={() => openUpdate(comp)}
                                            style={{
                                                flex: 1, padding: '0.6rem 1rem',
                                                background: '#f0fdf4', border: '1px solid #bbf7d0',
                                                color: '#15803d', borderRadius: '0.65rem',
                                                fontWeight: 700, fontSize: '0.83rem', cursor: 'pointer',
                                                transition: 'all 0.15s',
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.background = '#dcfce7'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = '#f0fdf4'; }}
                                        >
                                            ✏️ Add Update
                                        </button>
=======
                            <article key={comp.id} className="citizen-v2-card my-complaint-card">
                                <div className="my-complaint-top">
                                    <div>
                                        <p className="my-complaint-ref">{comp.referenceNumber}</p>
                                        <h3 className="my-complaint-title">{comp.category}</h3>
                                        <p className="my-complaint-meta">Submitted {formatDate(comp.createdAt)}</p>
>>>>>>> 3b4c154 (feat: restyle my complaints page)
                                    </div>

                                    <span
                                        className="my-complaint-status"
                                        style={{
                                            background: sc.bg,
                                            border: `1px solid ${sc.border}`,
                                            color: sc.text,
                                        }}
                                    >
                                        <span className="my-complaint-status-dot" style={{ background: sc.dot }} />
                                        {comp.status || 'Pending'}
                                    </span>
                                </div>

                                <p className="my-complaint-description">{comp.description}</p>

                                <div className="my-complaint-grid">
                                    {comp.location && (
                                        <div>
                                            <span className="my-complaint-label">Location</span>
                                            <p className="my-complaint-value">{comp.location}</p>
                                        </div>
                                    )}

                                    {comp.photoUrl && !hasImageError && (
                                        <div>
                                            <span className="my-complaint-label">Attachment</span>
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
                                </div>

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
<<<<<<< HEAD
                </div>
            )}

            {/* ── Modals ── */}
=======
                </section>
            )}

>>>>>>> 3b4c154 (feat: restyle my complaints page)
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

<<<<<<< HEAD
export default MyComplaints;
=======
export default MyComplaints;
>>>>>>> 3b4c154 (feat: restyle my complaints page)
