// SystemSettings.jsx
import '../../styles/dashboard.css';

function SystemSettings() {
    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">System Settings</h1>
            <p className="subtitle">Configure platform behavior, notifications & access rules</p>

            <div className="space-y-8 mt-8">
                <div className="card">
                    <div className="p-6 pt-8">
                        <h3 className="section-title">General Settings</h3>
                        <div className="mt-6 space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <label className="font-medium">Auto-routing enabled</label>
                                    <p className="text-sm text-[var(--text-light)]">Automatically assign complaints to departments</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
                                </label>
                            </div>

                            <div className="flex justify-between items-center">
                                <div>
                                    <label className="font-medium">Email notifications for admins</label>
                                    <p className="text-sm text-[var(--text-light)]">Receive daily summary emails</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
<br />
                <div className="card">
                    <div className="p-6 pt-8">
                        <h3 className="section-title">Role Permissions</h3>
                        <p className="text-[var(--text-medium)] mt-4 mb-6">
                            Configure what each role can access and perform
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="border border-[var(--border)] rounded-xl p-5">
                                <h4 className="font-medium mb-3">Agent</h4>
                                <ul className="text-sm space-y-2 text-[var(--text-medium)]">
                                    <li>✓ View & update assigned complaints</li>
                                    <li>✗ View all reports</li>
                                    <li>✗ Manage users</li>
                                </ul>
                            </div>
                            <div className="border border-[var(--border)] rounded-xl p-5">
                                <h4 className="font-medium mb-3">Department Head</h4>
                                <ul className="text-sm space-y-2 text-[var(--text-medium)]">
                                    <li>✓ View department queue</li>
                                    <li>✓ Assign within department</li>
                                    <li>✗ System settings</li>
                                </ul>
                            </div>
                            <div className="border border-[var(--border)] rounded-xl p-5">
                                <h4 className="font-medium mb-3">Administrator</h4>
                                <ul className="text-sm space-y-2 text-[var(--text-medium)]">
                                    <li>✓ Full access</li>
                                    <li>✓ Manage users & roles</li>
                                    <li>✓ System configuration</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SystemSettings;