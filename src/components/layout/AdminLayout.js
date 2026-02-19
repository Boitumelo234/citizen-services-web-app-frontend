import Sidebar from "./Sidebar";

function AdminLayout({ children }) {
    return (
        <div className="dashboard">
            <Sidebar role="admin" />
            <div className="dashboard-content">{children}</div>
        </div>
    );
}

export default AdminLayout;