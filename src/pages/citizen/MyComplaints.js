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
    // const [loadedImages, setLoadedImages] = useState({});

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
        return new Date(dateStr).toISOString().split('T')[0];
    };

    const getImageUrl = (photoUrl) => {
        if (!photoUrl) return null;

        // If it's already a full URL, return it
        if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
            return photoUrl;
        }

        // Extract just the filename
        let fileName = photoUrl;
        if (photoUrl.includes('\\')) {
            fileName = photoUrl.split('\\').pop();
        } else if (photoUrl.includes('/')) {
            fileName = photoUrl.split('/').pop();
        }

        // Return a clean URL
        return `http://localhost:8080/uploads/${fileName}`;
    };

    // const handleImageLoad = (complaintId) => {
    //     setLoadedImages(prev => ({ ...prev, [complaintId]: true }));
    // };

    // const handleImageError = (e, complaintId) => {
    //     console.log('Image failed to load:', e.target.src);
    //     e.target.style.display = 'none';
    //     setLoadedImages(prev => ({ ...prev, [complaintId]: false }));
    // };

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
                    {complaints.map((comp) => (
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

                                {/* Image section with fixed height to prevent layout shift */}
                                {/*{comp.photoUrl && (*/}
                                {/*    <div className="mb-4 border border-gray-200 rounded-lg p-2 bg-gray-50" style={{ minHeight: '150px' }}>*/}
                                {/*        {!loadedImages[comp.id] && (*/}
                                {/*            <div className="flex items-center justify-center h-32 bg-gray-100 rounded">*/}
                                {/*                <p className="text-gray-400">Loading image...</p>*/}
                                {/*            </div>*/}
                                {/*        )}*/}
                                {/*        <img*/}
                                {/*            src={getImageUrl(comp.photoUrl)}*/}
                                {/*            alt="Complaint attachment"*/}
                                {/*            className={`max-w-full h-auto rounded shadow-sm object-contain mx-auto transition-opacity duration-300 ${*/}
                                {/*                loadedImages[comp.id] ? 'opacity-100' : 'opacity-0'*/}
                                {/*            }`}*/}
                                {/*            style={{ maxHeight: '200px' }}*/}
                                {/*            onLoad={() => handleImageLoad(comp.id)}*/}
                                {/*            onError={(e) => handleImageError(e, comp.id)}*/}
                                {/*        />*/}
                                {/*    </div>*/}
                                {/*)}*/}

                                {/* Buttons - always visible */}
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
                    ))}
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
                />
            )}
        </div>
    );
}

export default MyComplaints;