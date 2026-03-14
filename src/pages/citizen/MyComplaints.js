// MyComplaints.jsx
import '../../styles/dashboard.css';
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import ComplaintDetailsModal from '../citizen/modal/ComplaintDetailsModal';
import AddUpdateModal from '../citizen/modal/AddUpdateModal';
// import ComplaintDetailsModal from './modals/ComplaintDetailsModal'; // adjust path
// import AddUpdateModal from './modals/AddUpdateModal';             // adjust path

function MyComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);

    useEffect(() => {
        // ... same fetch logic as before ...
        const fetchComplaints = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) {
                setError('Please log in to view your complaints');
                setLoading(false);
                return;
            }

            try {
                const res = await fetch('http://localhost:8080/api/complaints', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (!res.ok) throw new Error('Failed to load complaints');
                const data = await res.json();
                setComplaints(data);
            } catch (err) {
                setError(err.message || 'Could not load complaints');
            } finally {
                setLoading(false);
            }
        };

        fetchComplaints();
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toISOString().split('T')[0];
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

    const handleUpdateSubmit = (comment) => {
        console.log('Would send to backend:', {
            complaintId: selectedComplaint.id,
            comment,
            userEmail: 'current user' // ← you can get from auth context later
        });

        alert(`Update would be sent:\n\n${comment}\n\n(Backend endpoint missing)`);
        closeAll();
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">My Complaints</h1>
            <p className="subtitle">Track the status of all your reported issues</p>

            {/* ... loading / error / empty states same as before ... */}

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

                            <p className="text-gray-700">{comp.description}</p>

                            {comp.photoUrl && (
                                <img
                                    src={`http://localhost:8080${comp.photoUrl}`}
                                    alt="Attachment"
                                    className="mt-4 max-w-full rounded shadow-sm"
                                />
                            )}

                            <div className="mt-6 flex gap-4">
                                <button
                                    className="btn-outline text-sm px-5 py-2"
                                    onClick={() => openDetails(comp)}
                                >
                                    View Details
                                </button>
                                <button
                                    className="btn-outline text-sm px-5 py-2"
                                    onClick={() => openUpdate(comp)}
                                >
                                    Add Update
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showDetails && selectedComplaint && (
                <ComplaintDetailsModal
                    complaint={selectedComplaint}
                    onClose={closeAll}
                    formatDate={formatDate}
                />
            )}

            {showUpdate && selectedComplaint && (
                <AddUpdateModal
                    complaint={selectedComplaint}
                    onClose={closeAll}
                    onSubmit={handleUpdateSubmit}
                />
            )}
        </div>
    );
}

export default MyComplaints;