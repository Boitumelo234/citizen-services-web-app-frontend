function ComplaintTable({ complaints, onStatusChange }) {
    return (
        <table>
            <thead>
            <tr>
                <th>Title</th>
                <th>User</th>
                <th>Status</th>
            </tr>
            </thead>
            <tbody>
            {complaints.map(c => (
                <tr key={c.id}>
                    <td>{c.title}</td>
                    <td>{c.user}</td>
                    <td>
                        <select
                            value={c.status}
                            onChange={e => onStatusChange(c.id, e.target.value)}
                        >
                            <option>Pending</option>
                            <option>In Progress</option>
                            <option>Resolved</option>
                        </select>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default ComplaintTable;