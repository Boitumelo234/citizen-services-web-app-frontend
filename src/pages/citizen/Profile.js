import { useState } from "react";

function Profile() {
    const [editing, setEditing] = useState(false);
    const [user, setUser] = useState({
        email: "citizen@example.com",
        phone: "",
        address: "",
        ward: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUser((current) => ({ ...current, [name]: value }));
    };

    return (
        <div className="citizen-page">
            <section className="citizen-page-header">
                <div>
                    <h1>My Profile</h1>
                    <p>Manage your personal details and citizen account preferences.</p>
                </div>
                <button className="citizen-chip" onClick={() => setEditing((current) => !current)}>
                    {editing ? "Close Edit" : "Edit Profile"}
                </button>
            </section>

            <div className="citizen-profile-grid">
                <article className="citizen-panel soft">
                    <div className="citizen-panel-head">
                        <h3>Personal Information</h3>
                    </div>

                    <div className="citizen-profile-field">
                        <label>Full Name</label>
                        <p>{user.email.split("@")[0]}</p>
                    </div>
                    <div className="citizen-profile-field">
                        <label>Email</label>
                        <p>{user.email}</p>
                    </div>
                    <div className="citizen-profile-field">
                        <label>Phone Number</label>
                        {editing ? (
                            <input name="phone" value={user.phone} onChange={handleChange} />
                        ) : (
                            <p>{user.phone || "Not set"}</p>
                        )}
                    </div>
                    <div className="citizen-profile-field">
                        <label>Address</label>
                        {editing ? (
                            <input name="address" value={user.address} onChange={handleChange} />
                        ) : (
                            <p>{user.address || "Not set"}</p>
                        )}
                    </div>
                    <div className="citizen-profile-field">
                        <label>Ward</label>
                        {editing ? (
                            <input name="ward" value={user.ward} onChange={handleChange} />
                        ) : (
                            <p>{user.ward || "Not set"}</p>
                        )}
                    </div>
                </article>

                <article className="citizen-panel soft">
                    <div className="citizen-panel-head">
                        <h3>Preferences</h3>
                    </div>
                    <p className="citizen-muted">
                        Profile details remain local in this UI merge. Existing backend behavior on main has not been changed.
                    </p>
                    <div className="citizen-badge-row" style={{ marginTop: "1rem" }}>
                        <span>Citizen Portal</span>
                        <span>Complaint Tracking</span>
                        <span>Ward Updates</span>
                    </div>
                </article>
            </div>
        </div>
    );
}

export default Profile;
