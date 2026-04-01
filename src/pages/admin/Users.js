import { useEffect, useState } from "react";
import api from "../../api/api";
import "../../styles/dashboard.css";
import { FaEye } from "react-icons/fa";

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newUser, setNewUser] = useState({
        email: "",
        role: "CITIZEN",
        password: "",
    });
    const [openActionId, setOpenActionId] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;

    const loggedInEmail = localStorage.getItem("email")?.toLowerCase();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get("/api/users");
            setUsers(response.data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await api.delete(`/api/users/${id}`);
            fetchUsers();
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const handleRoleChange = async (id, currentRole) => {
        const newRole = currentRole === "ADMIN" ? "CITIZEN" : "ADMIN";
        try {
            const token = localStorage.getItem("token");
            await api.put(`/api/users/${id}/role`, { role: newRole }, { headers: { Authorization: `Bearer ${token}` } });
            fetchUsers();
        } catch (error) {
            console.error("Role update failed:", error);
        }
    };

    const handleToggleSuspend = async (id) => {
        if (!window.confirm("Toggle suspend status for this user?")) return;
        try {
            await api.put(`/api/users/${id}/suspend`);
            fetchUsers();
        } catch (error) {
            console.error("Toggle suspend failed:", error);
        }
    };

    const toggleDropdown = (id) => {
        setOpenActionId(openActionId === id ? null : id);
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await api.post("/api/users", newUser);
            setNewUser({ email: "", role: "CITIZEN", password: "" });
            setShowForm(false);
            fetchUsers();
        } catch (error) {
            console.error("Failed to add user:", error);
        }
    };

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(users.length / usersPerPage);

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const goToPrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    if (loading) return <p>Loading users...</p>;
    if (!users.length) return <p>No users found</p>;

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">User Management</h1>

            <button
                className="text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 mb-4"
                onClick={() => setShowForm(!showForm)}
            >
                {showForm ? "Cancel" : "Add New User"}
            </button>

            {showForm && (
                <form onSubmit={handleAddUser} className="mb-6 p-4 border rounded">
                    <div className="mb-2">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            required
                            className="ml-2 border px-2 py-1"
                        />
                    </div>
                    <div className="mb-2">
                        <label>Password:</label>
                        <input
                            type="password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            required
                            className="ml-2 border px-2 py-1"
                        />
                    </div>
                    <div className="mb-2">
                        <label>Role:</label>
                        <select
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            className="ml-2 border px-2 py-1"
                        >
                            <option value="CITIZEN">CITIZEN</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </div>
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        Add User
                    </button>
                </form>
            )}

            <div className="card mt-8">
                <div className="p-6 pt-8">
                    <h3 className="section-title">Registered Users ({users.length})</h3>

                    <table className="w-full mt-6">
                        <thead>
                        <tr>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentUsers.map((user) => (
                            <tr key={user.id}>
                                <td>{user.email}</td>
                                <td>
                                        <span style={{ color: user.role === "ADMIN" ? "green" : "gray", fontWeight: "bold" }}>
                                            {user.role}
                                        </span>
                                </td>
                                <td>
                                    {user.suspended ? (
                                        <span className="text-red-600 font-bold">Suspended</span>
                                    ) : (
                                        <span className="text-green-600 font-bold">Active</span>
                                    )}
                                </td>
                                <td className="relative">
                                    {user.email.toLowerCase() !== loggedInEmail && (
                                        <>
                                            <button
                                                onClick={() => toggleDropdown(user.id)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                <FaEye />
                                            </button>

                                            {openActionId === user.id && (
                                                <div className="absolute mt-2 right-0 bg-white border shadow-lg rounded z-10 w-48">
                                                    <button
                                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                                        onClick={() => handleRoleChange(user.id, user.role)}
                                                    >
                                                        {user.role === "ADMIN" ? "Make Citizen" : "Make Admin"}
                                                    </button>

                                                    <button
                                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                                                        onClick={() => handleDelete(user.id)}
                                                    >
                                                        Delete
                                                    </button>

                                                    <button
                                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-yellow-600"
                                                        onClick={() => handleToggleSuspend(user.id)}
                                                    >
                                                        {user.suspended ? "Unsuspend Account" : "Suspend Account"}
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    <div className="flex justify-between mt-4 items-center">
                        <button
                            className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
                            onClick={goToPrevPage}
                            disabled={currentPage === 1}
                        >
                            Prev
                        </button>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Users;