// AddUpdateModal.jsx
import { useState, useEffect } from 'react';

function AddUpdateModal({ complaint, onClose, onSuccess }) {
    const [comment, setComment] = useState('');
    const [newLocation, setNewLocation] = useState('');
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
            if (photoPreview) URL.revokeObjectURL(photoPreview);
        };
    }, [photoPreview]);

    // Close on Escape
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (photoPreview) URL.revokeObjectURL(photoPreview);
        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
    };

    const clearFile = () => {
        if (photoPreview) URL.revokeObjectURL(photoPreview);
        setPhotoFile(null);
        setPhotoPreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        setSubmitting(true);
        setErrorMsg(null);

        try {
            const token = localStorage.getItem('access_token');
            if (!token) throw new Error('No authentication token found. Please log in.');

            const formData = new FormData();
            formData.append('comment', comment.trim());
            if (newLocation.trim()) formData.append('newLocation', newLocation.trim());
            if (photoFile) formData.append('photo', photoFile);

            const res = await fetch(`http://localhost:8080/api/complaints/${complaint.id}/updates`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || `Server error (${res.status})`);
            }

            onSuccess?.();
            onClose();
        } catch (err) {
            setErrorMsg(err.message || 'Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

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
                    maxWidth: '540px',
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
                            Add Update
                        </p>
                        <h2 style={{ margin: '0.2rem 0 0', fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                            {complaint?.referenceNumber}
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
                            transition: 'all 0.15s', flexShrink: 0,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#0f172a'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#64748b'; }}
                    >
                        ×
                    </button>
                </div>

                {/* ── Scrollable form body ── */}
                <div style={{ overflowY: 'auto', flex: 1, padding: '1.5rem' }}>
                    <form id="add-update-form" onSubmit={handleSubmit}>

                        {errorMsg && (
                            <div style={{
                                background: '#fff5f5', border: '1px solid #fecaca',
                                borderLeft: '3px solid #ef4444',
                                borderRadius: '0.65rem', padding: '0.75rem 1rem',
                                marginBottom: '1.1rem', color: '#dc2626', fontSize: '0.85rem',
                            }}>
                                {errorMsg}
                            </div>
                        )}

                        {/* Comment */}
                        <div style={{ marginBottom: '1.1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.45rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                                Your comment / update <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <textarea
                                rows={4}
                                required
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                disabled={submitting}
                                placeholder="Describe progress, new observations, or additional details…"
                                style={{
                                    width: '100%', boxSizing: 'border-box',
                                    border: '1px solid #cbd5e1', borderRadius: '0.75rem',
                                    padding: '0.8rem 0.95rem', fontSize: '0.9rem',
                                    color: '#1e293b', background: '#f8fafc',
                                    resize: 'vertical', minHeight: '110px',
                                    outline: 'none', fontFamily: 'inherit',
                                    transition: 'border-color 0.15s',
                                }}
                                onFocus={e => e.target.style.borderColor = '#2563eb'}
                                onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                            />
                        </div>

                        {/* Location */}
                        <div style={{ marginBottom: '1.1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.45rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                                Updated location <span style={{ color: '#94a3b8', fontWeight: 500 }}>(optional)</span>
                            </label>
                            <input
                                type="text"
                                value={newLocation}
                                onChange={(e) => setNewLocation(e.target.value)}
                                disabled={submitting}
                                placeholder="e.g. Corner of Main Rd & Church St"
                                style={{
                                    width: '100%', boxSizing: 'border-box',
                                    border: '1px solid #cbd5e1', borderRadius: '0.75rem',
                                    padding: '0.8rem 0.95rem', fontSize: '0.9rem',
                                    color: '#1e293b', background: '#f8fafc',
                                    outline: 'none', fontFamily: 'inherit',
                                    transition: 'border-color 0.15s',
                                }}
                                onFocus={e => e.target.style.borderColor = '#2563eb'}
                                onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                            />
                        </div>

                        {/* Photo upload */}
                        <div style={{ marginBottom: '0.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.45rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                                Additional photo <span style={{ color: '#94a3b8', fontWeight: 500 }}>(optional)</span>
                            </label>

                            {!photoFile ? (
                                <label
                                    htmlFor="add-update-file-input"
                                    style={{
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                        gap: '0.4rem', padding: '1.5rem',
                                        border: '2px dashed #cbd5e1', borderRadius: '0.9rem',
                                        background: '#f8fafc', cursor: 'pointer',
                                        transition: 'all 0.15s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.background = '#eff6ff'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#f8fafc'; }}
                                >
                                    <span style={{ fontSize: '1.6rem' }}>📷</span>
                                    <span style={{ fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Click to upload photo</span>
                                    <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>JPG, PNG, GIF • max 10 MB</span>
                                    <input
                                        id="add-update-file-input"
                                        type="file"
                                        accept="image/jpeg,image/png,image/gif"
                                        onChange={handleFileChange}
                                        disabled={submitting}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            ) : (
                                <div style={{
                                    border: '1px solid #bbf7d0', background: '#f0fdf4',
                                    borderRadius: '0.9rem', padding: '0.75rem',
                                    position: 'relative',
                                }}>
                                    {photoPreview && (
                                        <img
                                            src={photoPreview}
                                            alt="Preview"
                                            style={{
                                                display: 'block', width: '100%', maxHeight: '200px',
                                                objectFit: 'contain', borderRadius: '0.6rem',
                                                marginBottom: '0.5rem',
                                            }}
                                        />
                                    )}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 600, wordBreak: 'break-all' }}>
                                            ✓ {photoFile.name}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={clearFile}
                                            style={{
                                                background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
                                                borderRadius: '0.45rem', padding: '0.25rem 0.65rem',
                                                fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                                                flexShrink: 0, marginLeft: '0.75rem',
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                {/* ── Footer ── */}
                <div style={{
                    padding: '1rem 1.5rem',
                    borderTop: '1px solid #f1f5f9',
                    background: '#fafbfc',
                    display: 'flex', justifyContent: 'flex-end', gap: '0.65rem',
                    flexShrink: 0,
                }}>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        style={{
                            padding: '0.65rem 1.35rem', borderRadius: '0.65rem',
                            border: '1px solid #e2e8f0', background: '#fff',
                            color: '#475569', fontWeight: 600, fontSize: '0.9rem',
                            cursor: 'pointer', transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="add-update-form"
                        disabled={submitting || !comment.trim()}
                        style={{
                            padding: '0.65rem 1.75rem', borderRadius: '0.65rem',
                            background: submitting || !comment.trim() ? '#86efac' : '#16a34a',
                            color: '#fff', border: 'none',
                            fontWeight: 700, fontSize: '0.9rem',
                            cursor: submitting || !comment.trim() ? 'not-allowed' : 'pointer',
                            transition: 'background 0.15s',
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                        }}
                        onMouseEnter={e => { if (!submitting && comment.trim()) e.currentTarget.style.background = '#15803d'; }}
                        onMouseLeave={e => { if (!submitting && comment.trim()) e.currentTarget.style.background = '#16a34a'; }}
                    >
                        {submitting ? (
                            <>
                                <span style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                                Submitting…
                            </>
                        ) : 'Submit Update'}
                    </button>
                </div>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

export default AddUpdateModal;