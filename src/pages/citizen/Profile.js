import { useEffect, useMemo, useState } from "react";
import { Camera, CheckCircle2, Mail, MapPin, PencilLine, Phone, Plus, ShieldCheck } from "lucide-react";
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
    const [draft, setDraft] = useState({
        phone: "",
        address: "",
        ward: "",
        profileImageUrl: "",
    });
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const profile = await getProfile();
                const normalized = {
                    email: profile.email || "",
                    phone: profile.phone || "",
                    address: profile.address || "",
                    ward: profile.ward || "",
                    profileImageUrl: profile.profileImageUrl || "",
                };
                setUser(normalized);
                setDraft({
                    phone: normalized.phone,
                    address: normalized.address,
                    ward: normalized.ward,
                    profileImageUrl: normalized.profileImageUrl,
                });
            } catch (err) {
                setError(err.response?.data?.error || "Unable to load profile");
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    const fullName = useMemo(() => {
        const localPart = user.email ? user.email.split("@")[0] : "citizen";
        return localPart
            .split(/[._-]+/)
            .filter(Boolean)
            .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
            .join(" ") || "Citizen";
    }, [user.email]);

    const completion = useMemo(() => {
        const fields = [user.email, user.phone, user.address, user.ward];
        const completed = fields.filter((value) => value && String(value).trim()).length;
        return Math.round((completed / fields.length) * 100);
    }, [user]);

    const avatarSeed = encodeURIComponent(user.email || "citizen");
    const avatarUrl = user.profileImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}&backgroundColor=e2e8f0`;

    const handleChange = (event) => {
        const { name, value } = event.target;
        setDraft((current) => ({ ...current, [name]: value }));
    };

    const handleEdit = () => {
        setDraft({
            phone: user.phone || "",
            address: user.address || "",
            ward: user.ward || "",
            profileImageUrl: user.profileImageUrl || "",
        });
        setSuccess("");
        setEditing(true);
    };

    const handleCancel = () => {
        setDraft({
            phone: user.phone || "",
            address: user.address || "",
            ward: user.ward || "",
            profileImageUrl: user.profileImageUrl || "",
        });
        setEditing(false);
        setError("");
    };

    const handleSave = async () => {
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const updated = await updateProfile({
                ...user,
                ...draft,
            });
            const normalized = {
                email: updated.email || user.email,
                phone: updated.phone || "",
                address: updated.address || "",
                ward: updated.ward || "",
                profileImageUrl: updated.profileImageUrl || "",
            };
            setUser(normalized);
            setDraft({
                phone: normalized.phone,
                address: normalized.address,
                ward: normalized.ward,
                profileImageUrl: normalized.profileImageUrl,
            });
            setEditing(false);
            setSuccess("Profile updated successfully.");
        } catch (err) {
            setError(err.response?.data?.error || "Unable to update profile");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="citizen-v2-page profile-v2-page">
            <section className="citizen-v2-header enhanced">
                <div>
                    <h1>My Profile</h1>
                    <p>Keep your contact details current so municipality updates reach you quickly.</p>
                </div>
                {editing ? (
                    <button className="citizen-v2-primary-btn" type="button" onClick={handleSave} disabled={saving}>
                        <CheckCircle2 size={16} /> {saving ? "Saving..." : "Save Changes"}
                    </button>
                ) : (
                    <button className="citizen-v2-primary-btn" type="button" onClick={handleEdit}>
                        <PencilLine size={16} /> Edit Profile
                    </button>
                )}
            </section>

            {error ? <p className="subtitle" style={{ color: "#dc2626" }}>{error}</p> : null}
            {success ? <p className="subtitle" style={{ color: "#15803d" }}>{success}</p> : null}

            <section className="citizen-v2-main-grid profile-v2-grid">
                <article className="citizen-v2-card profile-hero-card">
                    <div className="profile-hero-top">
                        <div className="profile-avatar-wrap">
                            <img src={avatarUrl} alt={`${fullName} avatar`} className="profile-avatar" />
                            <span className="profile-avatar-badge">
                                <Camera size={14} />
                            </span>
                        </div>
                        <div className="profile-hero-copy">
                            <p className="muted">Citizen account</p>
                            <h2>{loading ? "Loading..." : fullName}</h2>
                            <div className="profile-inline-meta">
                                <span><Mail size={14} /> {user.email || "No email found"}</span>
                                <span><ShieldCheck size={14} /> Verified access</span>
                            </div>
                        </div>
                    </div>

                    <div className="profile-progress-block">
                        <div className="profile-progress-label">
                            <span>Profile completion</span>
                            <strong>{completion}%</strong>
                        </div>
                        <div className="profile-progress-bar">
                            <span style={{ width: `${completion}%` }}></span>
                        </div>
                        <small>Complete your profile to make service updates more accurate.</small>
                    </div>
                </article>

                <article className="citizen-v2-card profile-status-card">
                    <div className="citizen-v2-card-head">
                        <h3>Account Snapshot</h3>
                    </div>
                    <div className="profile-pill-list">
                        <div className="profile-pill-card">
                            <span>Ward</span>
                            <strong>{user.ward || "Not set"}</strong>
                        </div>
                        <div className="profile-pill-card">
                            <span>Phone</span>
                            <strong>{user.phone || "Not set"}</strong>
                        </div>
                        <div className="profile-pill-card">
                            <span>Address</span>
                            <strong>{user.address || "Not set"}</strong>
                        </div>
                    </div>
                </article>
            </section>

            <section className="profile-v2-form-grid">
                <article className="citizen-v2-card">
                    <div className="citizen-v2-card-head">
                        <h3>Contact Information</h3>
                        {editing ? (
                            <button type="button" onClick={handleCancel}>Cancel</button>
                        ) : null}
                    </div>

                    <div className="profile-v2-fields">
                        <div className="profile-v2-field">
                            <label>Email address</label>
                            <div className="profile-v2-static">
                                <Mail size={16} />
                                <span>{user.email || "No email found"}</span>
                            </div>
                        </div>

                        <div className="profile-v2-field">
                            <label>Phone number</label>
                            {editing ? (
                                <div className="profile-v2-input-wrap">
                                    <Phone size={16} />
                                    <input
                                        name="phone"
                                        value={draft.phone}
                                        onChange={handleChange}
                                        placeholder="Add your phone number"
                                    />
                                </div>
                            ) : (
                                <div className="profile-v2-static">
                                    <Phone size={16} />
                                    <span>{user.phone || "Not set"}</span>
                                </div>
                            )}
                        </div>

                        <div className="profile-v2-field">
                            <label>Address</label>
                            {editing ? (
                                <div className="profile-v2-input-wrap">
                                    <MapPin size={16} />
                                    <input
                                        name="address"
                                        value={draft.address}
                                        onChange={handleChange}
                                        placeholder="Add your residential address"
                                    />
                                </div>
                            ) : (
                                <div className="profile-v2-static">
                                    <MapPin size={16} />
                                    <span>{user.address || "Not set"}</span>
                                </div>
                            )}
                        </div>

                        <div className="profile-v2-field">
                            <label>Ward</label>
                            {editing ? (
                                <div className="profile-v2-input-wrap">
                                    <ShieldCheck size={16} />
                                    <input
                                        name="ward"
                                        value={draft.ward}
                                        onChange={handleChange}
                                        placeholder="Enter your ward"
                                    />
                                </div>
                            ) : (
                                <div className="profile-v2-static">
                                    <ShieldCheck size={16} />
                                    <span>{user.ward || "Not set"}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </article>

                <article className="citizen-v2-card">
                    <div className="citizen-v2-card-head">
                        <h3>Profile Preferences</h3>
                    </div>

                    <div className="profile-side-stack">
                        <div className="profile-side-card">
                            <span className="profile-side-label">Avatar Source</span>
                            {editing ? (
                                <input
                                    className="profile-url-input"
                                    name="profileImageUrl"
                                    value={draft.profileImageUrl}
                                    onChange={handleChange}
                                    placeholder="Paste a profile image URL"
                                />
                            ) : (
                                <p>{user.profileImageUrl || "Using generated citizen avatar"}</p>
                            )}
                        </div>

                        <div className="profile-side-card profile-tip-card">
                            <span className="profile-side-label">Profile Tips</span>
                            <ul className="profile-tip-list">
                                <li><Plus size={14} /> Keep your ward accurate for local issue routing.</li>
                                <li><Plus size={14} /> Add a phone number for follow-up calls.</li>
                                <li><Plus size={14} /> Your email remains the main account identifier.</li>
                            </ul>
                        </div>
                    </div>
                </article>
            </section>
        </div>
    );
}

export default Profile;
