// MyComplaints.jsx
import '../../styles/dashboard.css';
import {Link} from "react-router-dom";
import { useState, useEffect } from 'react';

function MyComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchComplaints = async () => {
            const token = localStorage.getItem('access_token'); // ← fixed to match Login.js

            if (!token) {
                setError('Please log in to view your complaints');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/api/complaints', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to load complaints');
                }

                const data = await response.json();
                setComplaints(data);
            } catch (err) {
                setError(err.message || 'Could not load complaints');
            } finally {
                setLoading(false);
            }
        };

        fetchComplaints();
    }, []);

    // Format date nicely (optional – matches your previous mock style)
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toISOString().split('T')[0]; // YYYY-MM-DD
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">My Complaints</h1>
            <p className="subtitle">Track the status of all your reported issues</p>
            <div className="space-y-6 mt-8">
                {loading ? (
                    <div className="card p-8 text-center">
                        <p className="text-[var(--text-medium)]">Loading your complaints...</p>
                    </div>
                ) : error ? (
                    <div className="card p-8 text-center">
                        <p style={{ color: 'red' }}>{error}</p>
                    </div>
                ) : complaints.length === 0 ? (
                    <div className="card p-8 text-center">
                        <p className="text-[var(--text-medium)]">You haven't submitted any complaints yet.</p>
                        <Link to="/citizen/submit" className="btn-primary mt-4 inline-block">
                            Submit Your First Complaint
                        </Link>
                        <br />
                    </div>
                ) : (
                    complaints.map((comp) => (
                        <div key={comp.id} className="card">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            {comp.referenceNumber} – {comp.category}
                                        </h3>
                                        <p className="text-sm text-[var(--text-light)] mt-1">
                                            {formatDate(comp.createdAt)}
                                        </p>
                                    </div>
                                    <span className={`status-badge status-${comp.status.toLowerCase()}`}>
                    {comp.status}
                  </span>
                                </div>
                                <br />
                                <p className="text-[var(--text-dark)]">{comp.description}</p>
                                <div className="mt-6 flex gap-4">
                                    <button className="btn-outline text-sm px-4 py-2">View Details</button>
                                    <button className="btn-outline text-sm px-4 py-2">Add Update</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <br />
            </div>
        </div>
    );
}

export default MyComplaints;