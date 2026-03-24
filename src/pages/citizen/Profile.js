import { useEffect, useState } from "react";
import "../../styles/dashboard.css";
import { getProfile, updateProfile } from "../../services/citizenService";

function Profile() {
    const [user, setUser] = useState({
        email: "",
        phone: "",
        address: "",
        ward: "",
        profileImageUrl: "",
    });
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setUser(await getProfile());
            } catch (err) {
                setError(err.response?.data?.error || "Unable to load profile");
            }
        };

        loadProfile();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUser((current) => ({ ...current, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const updated = await updateProfile(user);
            setUser(updated);
            setEditing(false);
        } catch (err) {
            setError(err.response?.data?.error || "Unable to update profile");
        }
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">My Profile</h1>
            <p className="subtitle">Manage your personal information and preferences</p>
            {error ? <p className="subtitle">{error}</p> : null}

            <div className="card mt-8">
                <div className="p-6 pt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="card-title mb-6">Personal Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-[var(--text-light)]">Full Name</label>
                                    <p className="mt-1 font-medium">{user.email ? user.email.split("@")[0] : "Citizen"}</p>
                                </div>
                                <div>
                                    <label className="block text-sm text-[var(--text-light)]">Email</label>
                                    <p className="mt-1 font-medium">{user.email}</p>
                                </div>
                                <div>
                                    <label className="block text-sm text-[var(--text-light)]">Phone Number</label>
                                    {editing ? (
                                        <input className="mt-1 font-medium" name="phone" value={user.phone || ""} onChange={handleChange} />
                                    ) : (
                                        <p className="mt-1 font-medium">{user.phone || "Not set"}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm text-[var(--text-light)]">Address</label>
                                    {editing ? (
                                        <input className="mt-1 font-medium" name="address" value={user.address || ""} onChange={handleChange} />
                                    ) : (
                                        <p className="mt-1 font-medium">{user.address || "Not set"}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm text-[var(--text-light)]">Ward</label>
                                    {editing ? (
                                        <input className="mt-1 font-medium" name="ward" value={user.ward || ""} onChange={handleChange} />
                                    ) : (
                                        <p className="mt-1 font-medium">{user.ward || "Not set"}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="card-title mb-6">Preferences</h3>
                            <div className="space-y-4">
                                <p className="text-[var(--text-medium)]">Profile image URL is available in the backend model and can be added here when needed.</p>
                                <br />
                                {editing ? (
                                    <button className="btn-primary mt-6" onClick={handleSave}>
                                        Save Profile
                                    </button>
                                ) : (
                                    <button className="btn-primary mt-6" onClick={() => setEditing(true)}>
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
