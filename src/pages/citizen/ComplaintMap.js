import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../../styles/dashboard.css";
import { getMapComplaints } from "../../services/citizenService";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const userPinIcon = L.divIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: #ef4444; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); cursor: pointer; display: flex; align-items: center; justify-content: center;">
            <div style="width: 12px; height: 12px; background-color: white; border-radius: 50%;"></div>
          </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
});

function LocationPicker({ onLocationSelect, selectedLocation }) {
    useMapEvents({
        click(event) {
            const { lat, lng } = event.latlng;
            onLocationSelect({ lat, lng });
        },
    });

    return selectedLocation ? (
        <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={userPinIcon}>
            <Popup>
                <div className="text-sm">
                    <p className="font-semibold text-base">Pinned Location</p>
                    <p className="text-gray-600 mt-1">Latitude: {selectedLocation.lat.toFixed(6)}</p>
                    <p className="text-gray-600">Longitude: {selectedLocation.lng.toFixed(6)}</p>
                </div>
            </Popup>
        </Marker>
    ) : null;
}

function ComplaintForm({ selectedLocation, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        category: "",
        location: "",
        description: "",
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const categories = [
        "Pothole / Road Damage",
        "Water Leak / Burst Pipe",
        "Power Outage",
        "Streetlight Fault",
        "Illegal Dumping",
        "Sewer Overflow",
        "Other",
    ];

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            setError("File is too large (max 10 MB)");
            event.target.value = "";
            return;
        }

        setSelectedFile(file);
        setError(null);

        if (file.type.startsWith("image/")) {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setPreviewUrl(null);
        }
    };

    const clearFile = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        setSelectedFile(null);
        const input = document.getElementById("complaint-file-input-map");
        if (input) input.value = "";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setMessage(null);
        setError(null);

        const token = localStorage.getItem("access_token") || localStorage.getItem("token");
        if (!token) {
            setError("Please log in first. No authentication token found.");
            setSubmitting(false);
            return;
        }

        try {
            const formDataObject = new FormData();
            const complaintData = {
                category: formData.category,
                location: formData.location || `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`,
                description: formData.description,
                latitude: selectedLocation.lat,
                longitude: selectedLocation.lng,
            };

            formDataObject.append("data", new Blob([JSON.stringify(complaintData)], { type: "application/json" }));

            if (selectedFile) {
                formDataObject.append("photo", selectedFile);
            }

            const response = await fetch("http://localhost:8081/api/complaints", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formDataObject,
            });

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch {
                    errorData = {};
                }
                throw new Error(errorData.error || errorData.message || `Server responded with status ${response.status}`);
            }

            const data = await response.json();
            setMessage(`Complaint submitted! Reference: ${data.referenceNumber || "-"}`);
            setTimeout(() => onSubmit(data), 1500);
        } catch (submissionError) {
            console.error("Submission error:", submissionError);
            setError(submissionError.message || "Failed to submit complaint. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" style={{ zIndex: 1000 }}>
            <div className="card overflow-y-auto flex-1" onClick={(event) => event.stopPropagation()} style={{ maxHeight: "95vh" }}>
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Report New Issue</h2>

                    {message ? (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            {message}
                        </div>
                    ) : null}
                    {error ? (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    ) : null}

                    <div className="bg-gray-100 p-3 rounded mb-4">
                        <p className="text-sm text-gray-700">
                            <strong>Selected Location:</strong><br />
                            Lat: {selectedLocation.lat.toFixed(6)}<br />
                            Lng: {selectedLocation.lng.toFixed(6)}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Category *</label>
                            <select
                                required
                                value={formData.category}
                                onChange={(event) => setFormData({ ...formData, category: event.target.value })}
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select category</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Location Name (Optional)</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(event) => setFormData({ ...formData, location: event.target.value })}
                                placeholder="e.g., Main Street, near Shoprite"
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Description *</label>
                            <textarea
                                required
                                rows="4"
                                value={formData.description}
                                onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                                placeholder="Describe the issue in detail..."
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Attach Photo (optional - max 10 MB)</label>
                            <label
                                htmlFor="complaint-file-input-map"
                                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition block ${
                                    previewUrl ? "border-green-400 bg-green-50/40" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/30"
                                }`}
                            >
                                <input
                                    id="complaint-file-input-map"
                                    type="file"
                                    accept="image/jpeg,image/png,image/gif"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />

                                {!selectedFile ? (
                                    <div>
                                        <p className="text-gray-700 font-medium mb-1">Click here to upload photo</p>
                                        <p className="text-sm text-gray-500">JPG, PNG, GIF - max 10 MB</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <p className="text-green-700 font-medium break-all">{selectedFile.name}</p>
                                        <p className="text-sm text-gray-500">{(selectedFile.size / 1048576).toFixed(2)} MB</p>
                                        {previewUrl ? (
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                className="max-h-48 mx-auto rounded-lg shadow-sm object-contain"
                                            />
                                        ) : null}
                                    </div>
                                )}
                            </label>

                            {selectedFile ? (
                                <div className="mt-3 text-center">
                                    <button
                                        type="button"
                                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                                        onClick={clearFile}
                                    >
                                        Remove / Change file
                                    </button>
                                </div>
                            ) : null}
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                {submitting ? "Submitting..." : "Submit Report"}
                            </button>
                            <button
                                type="button"
                                onClick={onCancel}
                                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

function ComplaintMap() {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const rustenburgCenter = [-25.67, 27.24];
    const defaultZoom = 13;

    useEffect(() => {
        const loadComplaints = async () => {
            try {
                const data = await getMapComplaints();
                setComplaints(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.response?.data?.error || "Unable to load map complaints");
            } finally {
                setLoading(false);
            }
        };

        loadComplaints();
    }, []);

    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
        setShowForm(true);
    };

    const handleFormSubmit = async () => {
        try {
            const data = await getMapComplaints();
            setComplaints(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.response?.data?.error || "Unable to refresh map complaints");
        }
        setShowForm(false);
        setSelectedLocation(null);
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setSelectedLocation(null);
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Complaint Map</h1>
            <p className="subtitle">See reported issues across Rustenburg in real time</p>
            {error ? (
                <p className="subtitle" style={{ color: "#dc2626" }}>{error}</p>
            ) : null}

            <div className="card mt-8">
                <div className="p-6 pt-8">
                    <div style={{ height: "600px", width: "100%", borderRadius: "12px", overflow: "hidden", border: "1px solid #e5e7eb" }}>
                        <MapContainer
                            center={rustenburgCenter}
                            zoom={defaultZoom}
                            scrollWheelZoom
                            style={{ height: "100%", width: "100%" }}
                            zoomControl
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {complaints
                                .filter((complaint) => complaint.latitude != null && complaint.longitude != null)
                                .map((complaint) => (
                                    <Marker
                                        key={complaint.id}
                                        position={[complaint.latitude, complaint.longitude]}
                                    >
                                        <Popup>
                                            <div className="text-sm">
                                                <p className="font-semibold text-base">{complaint.referenceNumber}</p>
                                                <p className="mt-1">{complaint.category}</p>
                                                <p className="text-gray-600 mt-1">{complaint.status}</p>
                                                <p className="text-gray-600 mt-1">{complaint.location}</p>
                                                <p className="text-gray-600 mt-2">{complaint.description}</p>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            <LocationPicker onLocationSelect={handleLocationSelect} selectedLocation={selectedLocation} />
                        </MapContainer>
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
                    <p className="subtitle" style={{ marginTop: "1rem", marginBottom: 0 }}>
                        {loading ? "Loading reported issues..." : `${complaints.length} mapped complaints loaded`}
                    </p>
                </div>
            </div>

            {showForm && selectedLocation ? (
                <ComplaintForm
                    selectedLocation={selectedLocation}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                />
            ) : null}
        </div>
    );
}

export default ComplaintMap;

