// ManageComplaints.jsx
import '../../styles/dashboard.css';

function ManageComplaints() {
    // Mock data – replace with real API data
    const complaints = [
        {
            id: 'RUST-7856',
            citizen: 'Thabo M.',
            category: 'Infrastructure & Roads',
            location: 'Seraleng',
            submitted: '11 min ago',
            status: 'Pending',
            priority: 'High'
        },
        {
            id: 'RUST-7855',
            citizen: 'Lerato K.',
            category: 'Water & Sanitation',
            location: 'Tlhabane',
            submitted: '47 min ago',
            status: 'In Progress',
            priority: 'Medium'
        },
        // ... more items
    ];

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Manage Complaints</h1>
            <p className="subtitle">View, assign and update all incoming service requests</p>

            <div className="card mt-8">
                <div className="p-6 pt-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <h3 className="section-title">Active Queue ({complaints.length})</h3>
                        <div className="flex gap-3">
                            <button className="btn-primary text-sm px-5 py-2">Auto-assign</button>
                            <button className="btn-outline text-sm px-5 py-2">Export CSV</button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Citizen</th>
                                <th>Category</th>
                                <th>Location</th>
                                <th>Submitted</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {complaints.map((c) => (
                                <tr key={c.id}>
                                    <td className="font-medium">{c.id}</td>
                                    <td>{c.citizen}</td>
                                    <td>{c.category}</td>
                                    <td>{c.location}</td>
                                    <td className="text-sm text-[var(--text-light)]">{c.submitted}</td>
                                    <td>
                      <span className={`status-badge status-${c.status.toLowerCase().replace(' ', '')}`}>
                        {c.status}
                      </span>
                                    </td>
                                    <td>
                      <span className={`inline-flex px-3 py-1 text-xs rounded-full font-medium
                        ${c.priority === 'High' ? 'bg-red-100 text-red-800 border-red-200' :
                          c.priority === 'Medium' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                              'bg-green-100 text-green-800 border-green-200'}`}>
                        {c.priority}
                      </span>
                                    </td>
                                    <td className="text-sm">
                                        <button className="text-[var(--primary)] hover:underline mr-3">Assign</button>
                                        <button className="text-[var(--primary)] hover:underline">Update</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-8 text-center text-[var(--text-light)]">
                        Showing {complaints.length} of many • <button className="text-[var(--primary)] hover:underline">Load more</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManageComplaints;