import { Link } from "react-router-dom";

function Sidebar({ role }) {
    return (
        <aside className="sidebar">

            {role === "citizen" && (
                <>
                    <h3>Citizen</h3>
                    <Link to="/citizen">Dashboard</Link>
                    <Link to="/citizen/overview">Overview</Link>
                    <Link to="/citizen/submit">Submit Complaint</Link>
                    <Link to="/citizen/my-complaints">My Complaints</Link>
                    <Link to="/citizen/map">Complaint Map</Link>
                    <Link to="/citizen/notifications">Notifications</Link>
                    <Link to="/citizen/profile">Profile</Link>
                </>
            )}

            {role === "admin" && (
                <>
                    <h3>Admin</h3>
                    <Link to="/admin">Dashboard</Link>
                    <Link to="/admin/overview">Overview</Link>
                    <Link to="/admin/complaints">Manage Complaints</Link>
                    <Link to="/admin/departments">Departments</Link>
                    <Link to="/admin/reports">Reports</Link>
                    <Link to="/admin/users">Users</Link>
                    <Link to="/admin/settings">System Settings</Link>
                </>
            )}

        </aside>
    );
}

export default Sidebar;