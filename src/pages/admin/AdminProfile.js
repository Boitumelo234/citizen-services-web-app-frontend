import { useState, useEffect } from "react";

function AdminProfile() {
    const adminId = 1; // Replace with actual admin ID or get from auth
    const [formData, setFormData] = useState({
        name: "Admin User",
        email: "",
        phone: "+27 71 234 5678",
        role: "System Administrator"
    });
    const [editing, setEditing] = useState(false);

    // Fetch current admin email on mount
    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/users/${adminId}`);
                if (!response.ok) throw new Error("Failed to fetch user");
                const data = await response.json();
                setFormData(prev => ({ ...prev, email: data.email }));
            } catch (err) {
                console.error(err);
                alert("Error fetching profile ❌");
            }
        };
        fetchAdmin();
    }, [adminId]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/users/${adminId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email }) // only email is updated
            });

            if (!response.ok) throw new Error("Failed to update profile");

            const updatedUser = await response.json();
            setFormData(prev => ({ ...prev, email: updatedUser.email }));
            setEditing(false);
            alert("Profile updated successfully ✅");
        } catch (err) {
            console.error(err);
            alert("Error updating profile ❌");
        }
    };

    return (
        <div className="dashboard-root">
            <div className="dashboard-container">
                <h1 className="dashboard-title">Admin Profile</h1>
                <p className="subtitle">Manage your account details</p>

                <div className="card" style={{ maxWidth: "600px", marginTop: "30px" }}>
                    <div className="p-6">

                        {/* Avatar */}
                        <div style={{ textAlign: "center", marginBottom: "20px" }}>
                            <div style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "50%",
                                background: "var(--primary)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "28px",
                                fontWeight: "bold"
                            }}>
                                {formData.name.charAt(0)}
                            </div>
                        </div>

                        {/* Form */}
                        <div className="space-y-4">
                            <div>
                                <label>Name</label>
                                <input type="text" value={formData.name} disabled className="form-input" />
                            </div>

                            <div>
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    className="form-input"
                                />
                            </div>

                            <div>
                                <label>Phone</label>
                                <input type="text" value={formData.phone} disabled className="form-input" />
                            </div>

                            <div>
                                <label>Role</label>
                                <input type="text" value={formData.role} disabled className="form-input" />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                            {!editing ? (
                                <button onClick={() => setEditing(true)} className="btn-primary">Edit Profile</button>
                            ) : (
                                <>
                                    <button onClick={handleSave} className="btn-primary">Save Changes</button>
                                    <button onClick={() => setEditing(false)} className="btn-outline">Cancel</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminProfile;