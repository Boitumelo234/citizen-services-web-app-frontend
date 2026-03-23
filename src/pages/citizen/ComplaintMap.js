// ComplaintMap.jsx
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import L from 'leaflet';
import '../../styles/dashboard.css';

// Fix default Leaflet marker icon (very common issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function ComplaintMap() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Center on Rustenburg roughly
    const rustenburgCenter = [-25.67, 27.24];
    const defaultZoom = 11;

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                setLoading(true);
                // Change this URL to your real backend endpoint
                const response = await fetch('http://localhost:8080/api/complaints/map', {
                    headers: {
                        'Content-Type': 'application/json',
                        // Add Authorization header if you use JWT
                        // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) throw new Error('Failed to load complaints');

                const data = await response.json();
                setComplaints(data);
            } catch (err) {
                setError(err.message);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchComplaints();
    }, []);

    // Optional: Color by status/priority helper
    const getMarkerColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'high':
            case 'urgent':
            case 'high priority':
                return 'red';
            case 'in progress':
            case 'pending':
                return 'amber';
            case 'resolved':
            case 'closed':
                return 'green';
            case 'new':
            case 'open':
            default:
                return 'blue';
        }
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Complaint Map</h1>
            <p className="subtitle">See reported issues across Rustenburg in real time</p>

            <div className="card mt-8">
                <div className="p-6 pt-8">
                    {loading && (
                        <div className="h-96 flex items-center justify-center">
                            <p>Loading map and complaints...</p>
                        </div>
                    )}

                    {error && (
                        <div className="h-96 flex items-center justify-center text-red-600">
                            <p>Error: {error}</p>
                        </div>
                    )}

                    {!loading && !error && (
                        <div className="h-96 w-full relative">
                            <MapContainer
                                center={rustenburgCenter}
                                zoom={defaultZoom}
                                scrollWheelZoom={true}
                                style={{ height: '100%', width: '100%', borderRadius: '8px' }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                <MarkerClusterGroup
                                    chunkedLoading
                                    maxClusterRadius={80}
                                >
                                    {complaints.map((complaint) => {
                                        if (!complaint.latitude || !complaint.longitude) return null;

                                        const color = getMarkerColor(complaint.priority || complaint.status);

                                        return (
                                            <Marker
                                                key={complaint.id}
                                                position={[complaint.latitude, complaint.longitude]}
                                                // You can also use custom divIcon if you want colored circles
                                                icon={L.divIcon({
                                                    className: `marker-${color}`,
                                                    html: `<div class="w-4 h-4 rounded-full bg-${color}-500 border-2 border-white shadow"></div>`,
                                                    iconSize: [16, 16],
                                                    iconAnchor: [8, 8],
                                                })}
                                            >
                                                <Popup>
                                                    <div className="text-sm min-w-[220px]">
                                                        <h3 className="font-bold">{complaint.title || 'Untitled Complaint'}</h3>
                                                        <p className="text-gray-600 mt-1">{complaint.description?.substring(0, 120)}...</p>
                                                        <div className="mt-2 text-xs grid grid-cols-2 gap-1">
                                                            <span><strong>Status:</strong> {complaint.status || 'N/A'}</span>
                                                            <span><strong>Priority:</strong> {complaint.priority || 'N/A'}</span>
                                                            <span><strong>Date:</strong> {complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                </Popup>
                                            </Marker>
                                        );
                                    })}
                                </MarkerClusterGroup>
                            </MapContainer>
                        </div>
                    )}

                    {/* Legend - keep your nice legend */}
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