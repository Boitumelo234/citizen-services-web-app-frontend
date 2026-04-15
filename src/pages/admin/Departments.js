import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/dashboard.css';

function Departments() {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDeptStats = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('access_token');

                const response = await fetch('http://localhost:8080/api/complaints/stats/departments', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Server responded with status: ${response.status}`);
                }

                const data = await response.json();
                console.log("Raw API Response:", data);

                const formattedData = data.map(item => {
                    const categoryName = item.category || item.CATEGORY || "Unknown Category";

                    // --- CAPTURING ALL 4 STATUS TYPES ---
                    const activeCount = item.active ?? item.ACTIVE ?? 0;
                    const pendingCount = item.pending ?? item.PENDING ?? 0;
                    const resolvedCount = item.resolved ?? item.RESOLVED ?? 0;
                    const rejectedCount = item.rejected ?? item.REJECTED ?? 0; // Added Rejected

                    return {
                        id: categoryName.toLowerCase()
                            .replace(/[^a-z0-9]/g, '-')
                            .replace(/-+/g, '-')
                            .replace(/^-|-$/g, ''),
                        name: categoryName,
                        active: Number(activeCount),
                        pending: Number(pendingCount),
                        resolvedToday: Number(resolvedCount),
                        rejected: Number(rejectedCount) // Added to object
                    };
                });

                setDepartments(formattedData);
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Could not load department statistics. Please check your connection.");
            } finally {
                setLoading(false);
            }
        };

        fetchDeptStats();
    }, []);

    if (loading) {
        return (
            <div className="dashboard-container">
                <h1 className="dashboard-title">Loading Statistics...</h1>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-container">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <header className="mb-8">
                <h1 className="dashboard-title">Departments</h1>
                <p className="subtitle">Overview of current workload across municipal departments</p>
            </header>

            {departments.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-lg">
                    <p className="text-gray-500 text-lg font-medium">No department data found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {departments.map((dept) => (
                        <div
                            key={dept.id}
                            className="card cursor-pointer hover:shadow-lg transition-all border-l-4 border-transparent hover:border-[var(--primary)]"
                            onClick={() => navigate(`/complaints?dept=${dept.id}`)}
                        >
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">{dept.name}</h3>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 text-sm">Active (In Progress):</span>
                                        <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                            {dept.active}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 text-sm">Pending:</span>
                                        <span className="font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">
                                            {dept.pending}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 text-sm">Resolved:</span>
                                        <span className="font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                                            {dept.resolvedToday}
                                        </span>
                                    </div>

                                    {/* --- REJECTED SECTION --- */}
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                        <span className="text-gray-500 text-sm">Rejected:</span>
                                        <span className="font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">
                                            {dept.rejected}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Departments;