import { Link } from "react-router-dom";

function Sidebar({ role }) {
    return (
        <aside className="sidebar">
            {role === "citizen" && (
                <>
                    <Link to="/citizen">Dashboard</Link>
                    <Link to="/citizen/submit">Submit Complaint</Link>
                    <Link to="/citizen/my-complaints">My Complaints</Link>
                </>
            )}

            {role === "admin" && (
                <>
                    <Link to="/admin">Dashboard</Link>
                    <Link to="/admin/complaints">Manage Complaints</Link>
                </>
            )}
        </aside>
    );
}

export default Sidebar;