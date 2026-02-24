// Users.jsx
import '../../styles/dashboard.css';

function Users() {
    // Mock data
    const users = [
        { id: 1, name: 'Boitumelo M.', role: 'Citizen', joined: '2025-11-12', lastActive: 'Today' },
        { id: 2, name: 'Thabo Kgosi', role: 'Agent', joined: '2025-10-03', lastActive: '2 hours ago' },
        { id: 3, name: 'Lerato Ndlovu', role: 'Department Head – Water', joined: '2025-09-28', lastActive: 'Yesterday' },
        { id: 4, name: 'Admin User', role: 'Administrator', joined: '2025-08-15', lastActive: 'Now' },
    ];

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">User Management</h1>
            <p className="subtitle">View and manage registered citizens, agents & administrators</p>

            <div className="card mt-8">
                <div className="p-6 pt-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <h3 className="section-title">Registered Users ({users.length})</h3>
                        <button className="btn-primary text-sm px-6 py-2">
                            Add New User
                        </button>
                    </div>
<br />
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Role</th>
                                <th>Joined</th>
                                <th>Last Active</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className="font-medium">{user.name}</td>
                                    <td>{user.role}</td>
                                    <td className="text-sm text-[var(--text-light)]">{user.joined}</td>
                                    <td className="text-sm text-[var(--text-light)]">{user.lastActive}</td>
                                    <td className="text-sm">
                                        <button className="text-[var(--primary)] hover:underline mr-4">Edit</button>
                                        <button className="text-red-600 hover:underline">Deactivate</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-8 flex justify-between items-center text-sm text-[var(--text-light)]">
                        <span>Showing 1–10 of 342 users</span>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 border rounded hover:bg-gray-50">Previous</button>
                            <button className="px-3 py-1 border rounded bg-[var(--primary)] text-white">1</button>
                            <button className="px-3 py-1 border rounded hover:bg-gray-50">2</button>
                            <button className="px-3 py-1 border rounded hover:bg-gray-50">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Users;