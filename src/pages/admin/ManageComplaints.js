import { useState, useEffect } from 'react';
import '../../styles/dashboard.css';

function ManageComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        const token = localStorage.getItem('access_token');
        try {
            const res = await fetch('http://localhost:8080/api/complaints/admin/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setComplaints(data);
        } catch (err) {
            console.error("Error fetching admin data:", err);
        } finally {
            setLoading(false);
        }
    };

    // --- FUNCTION NAME IS handleStatusUpdate ---
    const handleStatusUpdate = async (id, newStatus) => {
        const token = localStorage.getItem('access_token');

        try {
            const res = await fetch(`http://localhost:8080/api/complaints/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                alert("Status updated successfully!");
                fetchComplaints();
            } else {
                const errorData = await res.json();
                console.error("Update failed:", errorData);
                alert("Failed to update status: " + (errorData.message || "Unknown error"));
            }
        } catch (err) {
            console.error("Network error:", err);
            alert("Server is unreachable. Check if backend is running on 8080.");
        }
    };

    if (loading) return <div className="p-10">Loading Admin Dashboard...</div>;

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Admin: Manage Complaints</h1>

            <div className="card mt-8 overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                    <tr className="bg-gray-50">
                        <th className="p-4">Ref Number</th>
                        <th>Category</th>
                        <th>Location</th>
                        <th>Current Status</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {complaints.map((c) => (
                        <tr key={c.id} className="border-t">
                            <td className="p-4 font-bold">{c.referenceNumber}</td>
                            <td>{c.category}</td>
                            <td>{c.location}</td>
                            <td>
                                <span className={`status-badge status-${c.status.toLowerCase().replace(/\s+/g, '')}`}>
                                    {c.status}
                                </span>
                            </td>
                            <td>
                                {/* CALLING THE CORRECTED NAME HERE ↓ */}
                                <select
                                    className="border rounded p-1 text-sm bg-white"
                                    value={c.status}
                                    onChange={(e) => handleStatusUpdate(c.id, e.target.value)}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Resolved">Resolved</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ManageComplaints;