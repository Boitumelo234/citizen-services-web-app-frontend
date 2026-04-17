import Sidebar from "./Sidebar";
import "../../styles/citizen-ui-merge.css";

function AdminLayout({ children }) {
    return (
        <div className="dashboard admin-ui-shell citizen-v2-layout">
            <Sidebar role="admin" />
            <div className="dashboard-content admin-ui-content citizen-v2-content">{children}</div>
        </div>
    );
}

export default AdminLayout;
