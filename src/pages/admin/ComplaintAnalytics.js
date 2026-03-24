import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function ComplaintAnalytics() {

  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/admin/complaints-trend")
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Complaint Trend (Daily)</h2>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#007bff" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ComplaintAnalytics;