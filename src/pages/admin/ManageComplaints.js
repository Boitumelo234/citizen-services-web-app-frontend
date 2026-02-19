import ComplaintTable from "../../components/complaints/ComplaintTable";

function ManageComplaints() {
    const complaints = []; // later from API

    return (
        <section>
            <h2>Manage Complaints</h2>
            <ComplaintTable complaints={complaints} />
        </section>
    );
}

export default ManageComplaints;