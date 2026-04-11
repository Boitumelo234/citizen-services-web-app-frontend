import Sidebar from "./Sidebar";
import "../../styles/citizen-ui-merge.css";

function CitizenLayout({ children }) {
    return (
        <div className="dashboard citizen-ui-shell">
            <Sidebar role="citizen" />
            <div className="dashboard-content citizen-ui-content">{children}</div>
        </div>
    );
}

export default CitizenLayout;
