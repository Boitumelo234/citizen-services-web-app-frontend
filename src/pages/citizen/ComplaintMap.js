// ComplaintMap.jsx
import '../../styles/dashboard.css';

function ComplaintMap() {
    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Complaint Map</h1>
            <p className="subtitle">See reported issues across Rustenburg in real time</p>

            <div className="card mt-8">
                <div className="p-6 pt-8">
                    <div className="map-placeholder h-96">
                        <div className="text-center">
                            <p className="text-lg font-medium text-[var(--text-dark)] mb-2">
                                Interactive Map – Coming Soon
                            </p>
                            <p className="text-[var(--text-medium)]">
                                This area will display GPS-tagged complaints with clustering and filters
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-red-500"></div>
                            <span>High Priority</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                            <span>In Progress</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-green-500"></div>
                            <span>Resolved</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                            <span>New</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ComplaintMap;