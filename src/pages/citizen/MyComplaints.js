// MyComplaints.jsx
import '../../styles/dashboard.css';
import {Link} from "react-router-dom";

function MyComplaints() {
    // Mock data – replace with API later
    const complaints = [
        {
            id: 'RUST-7841',
            date: '2026-02-20',
            category: 'Infrastructure & Roads',
            description: 'Large pothole on Nelson Mandela Drive near Shoprite',
            status: 'In Progress'
        },
        {
            id: 'RUST-7832',
            date: '2026-02-18',
            category: 'Water & Sanitation',
            description: 'Burst pipe leaking in front of erf 456',
            status: 'Resolved'
        },
        {
            id: 'RUST-7829',
            date: '2026-02-15',
            category: 'Electricity & Energy',
            description: 'Streetlight not working at corner of Beyers Naude & Bosch',
            status: 'Pending'
        }
    ];

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">My Complaints</h1>
            <p className="subtitle">Track the status of all your reported issues</p>

            <div className="space-y-6 mt-8">
                {complaints.length === 0 ? (
                    <div className="card p-8 text-center">
                        <p className="text-[var(--text-medium)]">You haven't submitted any complaints yet.</p>
                        <Link to="/citizen/submit" className="btn-primary mt-4 inline-block">
                            Submit Your First Complaint
                        </Link>
                        <br />
                    </div>

                ) : (
                    complaints.map((comp) => (
                        <div key={comp.id} className="card">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold">{comp.id} – {comp.category}</h3>
                                        <p className="text-sm text-[var(--text-light)] mt-1">{comp.date}</p>
                                    </div>
                                    <span className={`status-badge status-${comp.status.toLowerCase().replace(' ', '')}`}>
                    {comp.status}
                  </span>
                                </div>
                                <br />
                                <p className="text-[var(--text-dark)]">{comp.description}</p>
                                <div className="mt-6 flex gap-4">
                                    <button className="btn-outline text-sm px-4 py-2">
                                        View Details
                                    </button>
                                    <button className="btn-outline text-sm px-4 py-2">
                                        Add Update
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <br />
            </div>
        </div>
    );
}

export default MyComplaints;