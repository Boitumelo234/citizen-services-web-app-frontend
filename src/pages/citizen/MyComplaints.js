import "../../styles/dashboard.css";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import ComplaintDetailsModal from "../citizen/modal/ComplaintDetailsModal";
import AddUpdateModal from "../citizen/modal/AddUpdateModal";

function MyComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [imageErrors, setImageErrors] = useState({});

    const fetchComplaints = useCallback(async () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            setError("Please log in to view your complaints");
            setLoading(false);
            return;
        }
        try {
            const response = await fetch("http://localhost:8080/api/complaints", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Failed to load complaints");
            const data = await response.json();
            setComplaints(data);
        } catch (fetchError) {
            setError(fetchError.message || "Could not load complaints");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchComplaints();
    }, [fetchComplaints]);

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("en-ZA", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getImageUrl = (photoUrl) => {
        if (!photoUrl) return null;
        if (photoUrl.startsWith("http://") || photoUrl.startsWith("https://")) {
            return photoUrl;
        }

        let filename = photoUrl;
        if (photoUrl.includes("/")) filename = photoUrl.split("/").pop();
        if (photoUrl.includes("\\")) filename = photoUrl.split("\\").pop();
        return `http://localhost:8080/api/files/${filename}`;
    };

    const handleImageError = (complaintId, imageType = "main") => {
        setImageErrors((current) => ({ ...current, [`${complaintId}-${imageType}`]: true }));
    };

    const openDetails = (complaint) => {
        setSelectedComplaint(complaint);
        setShowDetails(true);
        setShowUpdate(false);
    };

    const openUpdate = (complaint) => {
        setSelectedComplaint(complaint);
        setShowUpdate(true);
        setShowDetails(false);
    };

    const closeAll = () => {
        setShowDetails(false);
        setShowUpdate(false);
        setSelectedComplaint(null);
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">My Complaints</h1>
            <p className="subtitle">Track the status of all your reported issues</p>

            {loading ? (
                <div className="text-center py-10">
                    <p className="text-gray-600">Loading your complaints...</p>
                </div>
            ) : null}

            {error && !loading ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            ) : null}

            {!loading && !error && complaints.length === 0 ? (
                <div className="space-y-6 mt-8">
                    <div className="card p-8 text-center">
                        <p className="text-[var(--text-medium)]">You haven't submitted any complaints yet.</p>
                        <Link to="/citizen/submit" className="btn-primary mt-4 inline-block">
                            Submit Your First Complaint
                        </Link>
                        <br />
                    </div>
                </div>
            ) : null}

            {!loading && !error && complaints.length > 0 ? (
                <div className="space-y-6 mt-8">
                    {complaints.map((complaint) => {
                        const imageUrl = getImageUrl(complaint.photoUrl);
                        const hasImageError = imageErrors[`${complaint.id}-main`];
                        return (
                            <div key={complaint.id} className="card">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold">
                                                {complaint.referenceNumber} - {complaint.category}
                                            </h3>
                                            <p className="text-sm text-[var(--text-light)] mt-1">{formatDate(complaint.createdAt)}</p>
                                        </div>
                                        <span className={`status-badge status-${String(complaint.status || "pending").toLowerCase().replace(/\s+/g, "")}`}>
                                            {complaint.status || "Pending"}
                                        </span>
                                    </div>
                                    <br />
                                    <p className="text-[var(--text-dark)]">{complaint.description}</p>
                                    {complaint.photoUrl && !hasImageError ? (
                                        <div className="mb-4 border border-gray-200 rounded-lg p-2 bg-gray-50 mt-4">
                                            <img
                                                src={imageUrl}
                                                alt="Complaint attachment"
                                                className="max-w-full h-auto rounded shadow-sm object-contain mx-auto"
                                                style={{ maxHeight: "200px" }}
                                                onError={() => handleImageError(complaint.id, "main")}
                                            />
                                        </div>
                                    ) : null}
                                    <div className="mt-6 flex gap-4">
                                        <button
                                            className="btn-outline text-sm px-4 py-2"
                                            type="button"
                                            onClick={(event) => {
                                                event.preventDefault();
                                                event.stopPropagation();
                                                openDetails(complaint);
                                            }}
                                        >
                                            View Details
                                        </button>
                                        <button
                                            className="btn-outline text-sm px-4 py-2"
                                            type="button"
                                            onClick={(event) => {
                                                event.preventDefault();
                                                event.stopPropagation();
                                                openUpdate(complaint);
                                            }}
                                        >
                                            Add Update
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <br />
                </div>
            ) : null}

            {showDetails && selectedComplaint ? (
                <ComplaintDetailsModal
                    complaint={selectedComplaint}
                    onClose={closeAll}
                    formatDate={formatDate}
                    getImageUrl={getImageUrl}
                />
            ) : null}

            {showUpdate && selectedComplaint ? (
                <AddUpdateModal
                    complaint={selectedComplaint}
                    onClose={closeAll}
                    onSuccess={fetchComplaints}
                    getImageUrl={getImageUrl}
                />
            ) : null}
        </div>
    );
}

export default MyComplaints;
