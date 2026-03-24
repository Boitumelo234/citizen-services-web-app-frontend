import ComplaintAnalytics from "./ComplaintAnalytics";

function Reports() {
    return (
        <section>
            <h2>Reports & Analytics</h2>

            <p>Generate monthly and annual reports and monitor complaint trends.</p>

            <hr style={{ margin: "20px 0" }} />

            {/* 🔥 Analytics Section */}
            <ComplaintAnalytics />
        </section>
    );
}

export default Reports;