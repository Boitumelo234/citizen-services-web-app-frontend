// MyComplaints.jsx
import '../../styles/dashboard.css';
import { Link } from "react-router-dom";
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
        const token = localStorage.getItem('access_token');
        if (!token) {
            setError('Please log in to view your complaints');
            setLoading(false);
            return;
        }
        try {
            const res = await fetch('http://localhost:8080/api/complaints', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
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
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-ZA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getImageUrl = (photoUrl) => {
        if (!photoUrl) return null;

        // If it's already a full URL, return it
        if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
            return photoUrl;
        }

        // Extract just the filename from the path
        let filename = photoUrl;
        if (photoUrl.includes('/')) {
            filename = photoUrl.split('/').pop();
        }
        if (photoUrl.includes('\\')) {
            filename = photoUrl.split('\\').pop();
        }

        // Try both endpoints - first try the API endpoint which bypasses security
        return `http://localhost:8080/api/files/${filename}`;
    };

    const handleImageError = (complaintId, imageType = 'main') => {
        setImageErrors(prev => ({ ...prev, [`${complaintId}-${imageType}`]: true }));
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

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">My Complaints</h1>
            <p className="subtitle">Track the status of all your reported issues</p>

            {loading && (
                <div className="text-center py-10">
                    <p className="text-gray-600">Loading your complaints...</p>
                </div>
            )}

            {error && !loading && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {!loading && !error && complaints.length === 0 && (
                <div className="text-center py-10 text-gray-600">
                    <p>You haven't submitted any complaints yet.</p>
                    <Link to="/submit-complaint" className="text-blue-600 hover:underline mt-2 inline-block">
                        Submit your first complaint →
                    </Link>
                </div>
            )}

            {!loading && !error && complaints.length > 0 && (
                <div className="space-y-6 mt-8">
                    {complaints.map((comp) => {
                        const imageUrl = getImageUrl(comp.photoUrl);
                        const hasImageError = imageErrors[`${comp.id}-main`];

                        return (
                            <div key={comp.id} className="card">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold">
                                                {comp.referenceNumber} – {comp.category}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {formatDate(comp.createdAt)}
                                            </p>
                                        </div>
                                        <span className={`status-badge status-${comp.status?.toLowerCase() || 'pending'}`}>
                                            {comp.status || 'Pending'}
                                        </span>
                                    </div>

                                    <p className="text-gray-700 mb-4">{comp.description}</p>

                                    {/* Image section */}
                                    {comp.photoUrl && !hasImageError && (
                                        <div className="mb-4 border border-gray-200 rounded-lg p-2 bg-gray-50">
                                            <img
                                                src={imageUrl}
                                                alt="Complaint attachment"
                                                className="max-w-full h-auto rounded shadow-sm object-contain mx-auto"
                                                style={{ maxHeight: '200px' }}
                                                onError={() => handleImageError(comp.id, 'main')}
                                            />
                                        </div>
                                    )}

                                    {/* Buttons */}
                                    <div className="flex gap-4 mt-4 pt-2 border-t border-gray-100">
                                        <button
                                            className="btn-outline text-sm px-5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                openDetails(comp);
                                            }}
                                        >
                                            View Details
                                        </button>
                                        <button
                                            className="btn-outline text-sm px-5 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                openUpdate(comp);
                                            }}
                                        >
                                            Add Update
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modals */}
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