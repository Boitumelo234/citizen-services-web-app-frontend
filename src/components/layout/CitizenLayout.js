import Sidebar from "./Sidebar";
import "../../styles/citizen-ui-merge.css";

function CitizenLayout({ children }) {
    return (
        <div className="dashboard citizen-ui-shell citizen-v2-layout">
            <Sidebar role="citizen" />
            <div className="dashboard-content citizen-ui-content citizen-v2-content">{children}</div>
        </div>
    );
}

export default CitizenLayout;