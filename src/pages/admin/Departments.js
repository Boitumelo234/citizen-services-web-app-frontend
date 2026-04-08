import { useEffect, useState } from "react";
import axios from "axios";

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/api/admin/departments")
      .then(res => setDepartments(res.data));
  }, []);

  const createDepartment = () => {
    axios.post("http://localhost:8080/api/admin/departments", { name })
      .then(() => window.location.reload());
  };

  return (
    <div>
      <h2>Departments</h2>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New Department"
      />
      <button onClick={createDepartment}>Add</button>

      {departments.map(d => (
        <div key={d.id}>
          {d.name} - Complaints: {d.totalComplaints}
        </div>
      ))}
    </div>
  );
}

export default Departments;