function ComplaintTable({ complaints }) {
    return (
        <table border="1" cellPadding="10">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Department</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {complaints && complaints.length > 0 ? (
                    complaints.map((complaint) => (
                        <tr key={complaint.id}>
                            <td>{complaint.id}</td>
                            <td>{complaint.title}</td>
                            <td>{complaint.department}</td>
                            <td>{complaint.status}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4">No complaints found</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

export default ComplaintTable;