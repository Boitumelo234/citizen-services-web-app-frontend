// ComplaintDetailsModal.jsx
import { useEffect, useState } from 'react';

function ComplaintDetailsModal({ complaint, onClose, formatDate, getImageUrl }) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [updateImagesState, setUpdateImagesState] = useState({});

    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = prev; };
    }, []);

    // Close on Escape key
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    if (!complaint) return null;

    const mainImageUrl = complaint.photoUrl ? getImageUrl(complaint.photoUrl) : null;

    const statusColor = {
        resolved:    { text: '#047857', bg: '#ecfdf5', border: '#a7f3d0' },
        'in progress': { text: '#b45309', bg: '#fffbeb', border: '#fde68a' },
        pending:     { text: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe' },
    };
    const statusKey = complaint.status?.toLowerCase() || 'pending';
    const sc = statusColor[statusKey] || statusColor.pending;

    return (
        <div
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            style={{
                position: 'fixed', inset: 0,
                background: 'rgba(15,23,42,0.55)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 99999, padding: '1.25rem',
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: '#ffffff',
                    borderRadius: '1.25rem',
                    width: '100%',
                    maxWidth: '680px',
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 32px 64px rgba(15,23,42,0.22), 0 0 0 1px rgba(226,232,240,0.8)',
                    overflow: 'hidden',
                }}
            >
                {/* ── Header ── */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '1.25rem 1.5rem',
                    borderBottom: '1px solid #f1f5f9',
                    background: '#fafbfc',
                    flexShrink: 0,
                }}>
                    <div>
                        <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            Complaint Details
                        </p>
                        <h2 style={{ margin: '0.2rem 0 0', fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
                            {complaint.referenceNumber}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            border: '1px solid #e2e8f0', background: '#fff',
                            color: '#64748b', fontSize: '1.35rem', lineHeight: 1,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.15s',
                            flexShrink: 0,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#0f172a'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#64748b'; }}
                    >
                        ×
                    </button>
                </div>

                {/* ── Scrollable body ── */}
                <div style={{ overflowY: 'auto', flex: 1, padding: '1.5rem' }}>

                    {/* Status + Meta row */}
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                            padding: '0.35rem 0.85rem', borderRadius: '999px',
                            background: sc.bg, border: `1px solid ${sc.border}`,
                            color: sc.text, fontSize: '0.78rem', fontWeight: 700,
                        }}>
                            <span style={{ width: 7, height: 7, borderRadius: '50%', background: sc.text, display: 'inline-block' }} />
                            {complaint.status || 'Pending'}
                        </span>
                        <span style={{
                            display: 'inline-flex', alignItems: 'center',
                            padding: '0.35rem 0.85rem', borderRadius: '999px',
                            background: '#f8fafc', border: '1px solid #e2e8f0',
                            color: '#64748b', fontSize: '0.78rem', fontWeight: 600,
                        }}>
                            📅 {formatDate(complaint.createdAt)}
                        </span>
                    </div>

                    {/* Info grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                        {[
                            { label: 'Category', value: complaint.category, icon: '🏷️' },
                            { label: 'Location', value: complaint.location, icon: '📍' },
                        ].map(({ label, value, icon }) => (
                            <div key={label} style={{
                                background: '#f8fafc', border: '1px solid #e2e8f0',
                                borderRadius: '0.9rem', padding: '0.85rem 1rem',
                            }}>
                                <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                                    {icon} {label}
                                </p>
                                <p style={{ margin: 0, fontWeight: 600, color: '#1e293b', fontSize: '0.88rem', wordBreak: 'break-word' }}>
                                    {value || '—'}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <p style={{ margin: '0 0 0.5rem', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            💬 Description
                        </p>
                        <div style={{
                            background: '#f8fafc', border: '1px solid #e2e8f0',
                            borderRadius: '0.9rem', padding: '1rem 1.1rem',
                        }}>
                            <p style={{ margin: 0, color: '#334155', lineHeight: 1.7, fontSize: '0.9rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                {complaint.description}
                            </p>
                        </div>
                    </div>

                    {/* Attached photo */}
                    {mainImageUrl && (
                        <div style={{ marginBottom: '1.25rem' }}>
                            <p style={{ margin: '0 0 0.5rem', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                📷 Attached Photo
                            </p>
                            <div style={{
                                background: '#f8fafc', border: '1px solid #e2e8f0',
                                borderRadius: '0.9rem', padding: '0.75rem',
                                overflow: 'hidden',
                            }}>
                                {!imageLoaded && !imageError && (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '180px', gap: '0.5rem', color: '#94a3b8', fontSize: '0.8rem' }}>
                                        <div style={{
                                            width: 22, height: 22, borderRadius: '50%',
                                            border: '2px solid #e2e8f0', borderTopColor: '#2563eb',
                                            animation: 'spin 0.7s linear infinite',
                                        }} />
                                        Loading image…
                                    </div>
                                )}
                                {imageError && (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '120px', color: '#94a3b8', fontSize: '0.82rem', flexDirection: 'column', gap: '0.4rem' }}>
                                        <span style={{ fontSize: '1.8rem' }}>🖼️</span>
                                        Image unavailable
                                    </div>
                                )}
                                <img
                                    src={mainImageUrl}
                                    alt="Complaint attachment"
                                    onLoad={() => setImageLoaded(true)}
                                    onError={() => { setImageError(true); setImageLoaded(true); }}
                                    style={{
                                        display: imageError ? 'none' : 'block',
                                        width: '100%',
                                        maxHeight: '340px',
                                        objectFit: 'contain',
                                        borderRadius: '0.6rem',
                                        opacity: imageLoaded ? 1 : 0,
                                        transition: 'opacity 0.3s ease',
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Updates */}
                    <div>
                        <p style={{ margin: '0 0 0.75rem', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            🔄 Updates
                            {complaint.updates?.length > 0 && (
                                <span style={{ background: '#2563eb', color: '#fff', borderRadius: '999px', padding: '0.05rem 0.55rem', fontSize: '0.7rem', fontWeight: 700 }}>
                                    {complaint.updates.length}
                                </span>
                            )}
                        </p>

                        {complaint.updates?.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {complaint.updates.map((update, index) => {
                                    const upImgUrl = update.photoUrl ? getImageUrl(update.photoUrl) : null;
                                    const upState = updateImagesState[update.id] || {};

                                    return (
                                        <div key={update.id} style={{
                                            background: '#f8fafc', border: '1px solid #e2e8f0',
                                            borderRadius: '0.9rem', padding: '1rem 1.1rem',
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                                                <span style={{
                                                    background: '#eff6ff', border: '1px solid #bfdbfe',
                                                    color: '#1d4ed8', borderRadius: '999px',
                                                    padding: '0.2rem 0.65rem', fontSize: '0.7rem', fontWeight: 700,
                                                }}>
                                                    Update #{index + 1}
                                                </span>
                                                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                                                    {formatDate(update.createdAt)}
                                                </span>
                                            </div>

                                            {update.newLocation && (
                                                <div style={{ marginBottom: '0.6rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.6rem', padding: '0.5rem 0.75rem' }}>
                                                    <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>📍 Updated location</p>
                                                    <p style={{ margin: 0, fontWeight: 600, color: '#1e293b', fontSize: '0.83rem', wordBreak: 'break-word' }}>{update.newLocation}</p>
                                                </div>
                                            )}

                                            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.6rem', padding: '0.65rem 0.75rem', marginBottom: upImgUrl ? '0.6rem' : 0 }}>
                                                <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>💬 Comment</p>
                                                <p style={{ margin: 0, color: '#334155', fontSize: '0.85rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{update.comment}</p>
                                            </div>

                                            {upImgUrl && (
                                                <div style={{ marginTop: '0.6rem' }}>
                                                    <p style={{ margin: '0 0 0.4rem', fontSize: '0.72rem', color: '#94a3b8' }}>📷 Additional photo</p>
                                                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.6rem', padding: '0.5rem', overflow: 'hidden' }}>
                                                        {!upState.loaded && !upState.error && (
                                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px', color: '#94a3b8', fontSize: '0.75rem', gap: '0.4rem' }}>
                                                                <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid #e2e8f0', borderTopColor: '#2563eb', animation: 'spin 0.7s linear infinite' }} />
                                                                Loading…
                                                            </div>
                                                        )}
                                                        <img
                                                            src={upImgUrl}
                                                            alt="Update attachment"
                                                            onLoad={() => setUpdateImagesState(prev => ({ ...prev, [update.id]: { loaded: true } }))}
                                                            onError={() => setUpdateImagesState(prev => ({ ...prev, [update.id]: { loaded: true, error: true } }))}
                                                            style={{
                                                                display: upState.error ? 'none' : 'block',
                                                                width: '100%', maxHeight: '200px',
                                                                objectFit: 'contain', borderRadius: '0.4rem',
                                                                opacity: upState.loaded ? 1 : 0,
                                                                transition: 'opacity 0.3s ease',
                                                            }}
                                                        />
                                                        {upState.error && (
                                                            <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.75rem', padding: '0.75rem' }}>Image unavailable</div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div style={{
                                textAlign: 'center', padding: '2rem 1rem',
                                background: '#f8fafc', borderRadius: '0.9rem',
                                border: '1px dashed #cbd5e1',
                                color: '#94a3b8', fontSize: '0.875rem',
                            }}>
                                <span style={{ display: 'block', fontSize: '1.75rem', marginBottom: '0.4rem' }}>📭</span>
                                No updates have been added yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Footer ── */}
                <div style={{
                    padding: '1rem 1.5rem',
                    borderTop: '1px solid #f1f5f9',
                    background: '#fafbfc',
                    display: 'flex', justifyContent: 'flex-end',
                    flexShrink: 0,
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '0.65rem 1.75rem', borderRadius: '0.65rem',
                            background: '#2563eb', color: '#fff',
                            border: 'none', fontWeight: 700, fontSize: '0.9rem',
                            cursor: 'pointer', transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#1d4ed8'}
                        onMouseLeave={e => e.currentTarget.style.background = '#2563eb'}
                    >
                        Close
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

export default ComplaintDetailsModal;