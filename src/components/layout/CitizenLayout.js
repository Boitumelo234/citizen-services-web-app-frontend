import Sidebar from "./Sidebar";

function CitizenLayout({ children }) {
    return (
        <div className="dashboard citizen-v2-layout">
            <Sidebar role="citizen" />
            <div className="dashboard-content citizen-v2-content">{children}</div>
        </div>
    );
}

export default CitizenLayout;
