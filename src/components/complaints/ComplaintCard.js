function ComplaintCard({ complaint }) {
    return (
        <div className="complaint-card">
            <h4>{complaint.title}</h4>
            <p>{complaint.description}</p>
            <span>Status: {complaint.status}</span>
        </div>
    );
}

export default ComplaintCard;