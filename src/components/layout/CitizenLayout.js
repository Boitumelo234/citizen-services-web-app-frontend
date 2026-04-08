import Sidebar from "./Sidebar";

function CitizenLayout({ children }) {
    return (
        <div className="dashboard">
            <Sidebar role="citizen" />
            <div className="dashboard-content">{children}</div>
        </div>
    );
}

export default CitizenLayout;