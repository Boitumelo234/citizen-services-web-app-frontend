// Departments.jsx
import '../../styles/dashboard.css';

function Departments() {
    // Mock data – would come from backend
    const departments = [
        { name: 'Infrastructure & Roads', active: 28, pending: 11, resolvedToday: 7 },
        { name: 'Water & Sanitation', active: 19, pending: 6, resolvedToday: 4 },
        { name: 'Electricity & Energy', active: 15, pending: 5, resolvedToday: 3 },
        { name: 'Solid Waste & Environment', active: 12, pending: 4, resolvedToday: 2 },
        { name: 'Traffic & Transport', active: 9, pending: 3, resolvedToday: 1 },
        { name: 'Public Safety & Emergency', active: 6, pending: 2, resolvedToday: 0 },
        { name: 'Housing, Facilities & Assets', active: 4, pending: 1, resolvedToday: 1 },
        { name: 'Billing & Customer Care', active: 3, pending: 1, resolvedToday: 0 },
    ];

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Departments</h1>
            <p className="subtitle">Overview of current workload across municipal departments</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {departments.map((dept, index) => (
                    <div key={index} className="card">
                        <div className="p-6 pt-8">
                            <h3 className="card-title">{dept.name}</h3>
                            <div className="mt-6 space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-[var(--text-medium)]">Active complaints:</span>
                                    <span className="font-medium">{dept.active}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[var(--text-medium)]">Pending:</span>
                                    <span className="font-medium text-[var(--warning)]">{dept.pending}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[var(--text-medium)]">Resolved today:</span>
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

export default Departments;