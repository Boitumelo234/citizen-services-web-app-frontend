import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/dashboard.css';

function Departments() {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDeptStats = async () => {
            try {
                // For now, using a fallback to mock data if your API isn't ready
                // Replace 'YOUR_API_URL' with your actual backend URL
                const response = await fetch('http://localhost:5000/api/department-stats');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setDepartments(data);
            } catch (error) {
                console.error("Fetch error, using mock data for safety:", error);
                // Fallback mock data so the app doesn't crash during dev
                setDepartments([
                    { id: 'roads', name: 'Infrastructure & Roads', active: 28, pending: 11, resolvedToday: 7 },
                    { id: 'water', name: 'Water & Sanitation', active: 19, pending: 6, resolvedToday: 4 }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchDeptStats();
    }, []);

    if (loading) {
        return <div className="dashboard-container"><h1>Loading Department Data...</h1></div>;
    }

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Departments</h1>
            <p className="subtitle">Overview of current workload across municipal departments</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {departments.map((dept) => (
                    <div
                        key={dept.id}
                        className="card cursor-pointer hover:shadow-lg transition-all border-l-4 border-transparent hover:border-[var(--primary)]"
                        onClick={() => navigate(`/complaints?dept=${dept.id}`)}
                    >
                        <div className="p-6 pt-8">
                            <h3 className="card-title">{dept.name}</h3>
                            <div className="mt-6 space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-[var(--text-medium)]">Active:</span>
                                    <span className="font-medium">{dept.active}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[var(--text-medium)]">Pending:</span>
                                    <span className="font-medium text-[var(--warning)]">{dept.pending}</span>
                                </div>
                                <div className="flex justify-between border-t pt-2">
                                    <span className="text-[var(--text-medium)]">Resolved Today:</span>
                                    <span className="font-medium text-[var(--success)]">{dept.resolvedToday}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Departments; // CRITICAL LINE