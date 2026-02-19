import ComplaintCard from "../../components/complaints/ComplaintCard";

function MyComplaints() {
    const complaints = []; // later from API

    return (
        <section>
            <h2>My Complaints</h2>
            {complaints.map(c => (
                <ComplaintCard key={c.id} complaint={c} />
            ))}
        </section>
    );
}

export default MyComplaints;