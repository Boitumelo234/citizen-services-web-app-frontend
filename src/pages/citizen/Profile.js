// Profile.jsx
import '../../styles/dashboard.css';

function Profile() {
    // Mock user data
    const user = {
        name: 'Boitumelo M.',
        email: 'boitumelo@example.com',
        phone: '+27 82 123 4567',
        address: '123 Mandela Drive, Rustenburg',
        notifications: true
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">My Profile</h1>
            <p className="subtitle">Manage your personal information and preferences</p>

            <div className="card mt-8">
                <div className="p-6 pt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="card-title mb-6">Personal Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-[var(--text-light)]">Full Name</label>
                                    <p className="mt-1 font-medium">{user.name}</p>
                                </div>
                                <div>
                                    <label className="block text-sm text-[var(--text-light)]">Email</label>
                                    <p className="mt-1 font-medium">{user.email}</p>
                                </div>
                                <div>
                                    <label className="block text-sm text-[var(--text-light)]">Phone Number</label>
                                    <p className="mt-1 font-medium">{user.phone}</p>
                                </div>
                                <div>
                                    <label className="block text-sm text-[var(--text-light)]">Address</label>
                                    <p className="mt-1 font-medium">{user.address}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="card-title mb-6">Preferences</h3>
                            <div className="space-y-4">
                                <label className="flex items-center gap-3">
                                    <span>Receive push notifications for updates</span> <input type="checkbox" checked={user.notifications} readOnly />
                                </label>
                                <br />
                                <button className="btn-primary mt-6">
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;