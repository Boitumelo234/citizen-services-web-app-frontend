import { useEffect, useState } from "react";
import axios from "axios";

function ManageComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter]);

  const fetchComplaints = () => {
    axios.get("http://localhost:8080/api/admin/complaints", {
      params: { status: statusFilter }
    })
      .then(res => setComplaints(res.data))
      .catch(err => console.error(err));
  };

  const updateStatus = (id, newStatus) => {
    axios.put(`http://localhost:8080/api/admin/complaints/${id}/status`, {
      status: newStatus
    }).then(fetchComplaints);
  };

  return (
    <div>
      <h2>Manage Complaints</h2>

      <select onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="">All</option>
        <option value="PENDING">Pending</option>
        <option value="RESOLVED">Resolved</option>
      </select>

      {complaints.map(c => (
        <div key={c.id}>
          <p>{c.title}</p>
          <p>Status: {c.status}</p>

          <button onClick={() => updateStatus(c.id, "RESOLVED")}>
            Mark Resolved
          </button>
        </div>
      ))}
    </div>
  );
}

export default ManageComplaints;