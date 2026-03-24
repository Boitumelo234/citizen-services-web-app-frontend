import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

function UserOverview() {

  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8080/api/admin/user-overview")
      .then(res => setData(res.data));
  }, []);

  if (!data) return <p>Loading...</p>;

  const roleData = [
    { name: "Admins", value: data.admins },
    { name: "Agents", value: data.agents },
    { name: "Department Users", value: data.departmentUsers }
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>User & Role Overview</h2>

      <p>Total Users: {data.totalUsers}</p>
      <p>Active Users: {data.activeUsers}</p>
      <p>Inactive Users: {data.inactiveUsers}</p>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={roleData} dataKey="value" nameKey="name" label />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default UserOverview;