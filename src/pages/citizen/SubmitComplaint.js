import "../../styles/dashboard.css";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";

function SubmitComplaint() {
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            setError("File is too large (max 10 MB)");
            e.target.value = "";
            return;
        }

        setSelectedFile(file);
        setError(null);

        if (file.type.startsWith("image/")) {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
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
        const input = document.getElementById("complaint-file-input");
        if (input) input.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        const token = localStorage.getItem("access_token");
        if (!token) {
            setError("Please log in first");
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            const complaintData = { category, location, description };

            formData.append(
                "data",
                new Blob([JSON.stringify(complaintData)], {
                    type: "application/json",
                })
            );

            if (selectedFile) {
                formData.append("photo", selectedFile);
            }

            const response = await fetch(
                "http://localhost:8080/api/complaints",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch {
                    errorData = {};
                }
                throw new Error(
                    errorData.error ||
                    errorData.message ||
                    `Server responded with status ${response.status}`
                );
            }

            const data = await response.json();
            setMessage(
                `Complaint submitted! Reference: ${
                    data.referenceNumber || "—"
                }`
            );

            setCategory("");
            setLocation("");
            setDescription("");
            clearFile();
        } catch (err) {
            setError(err.message || "Failed to submit complaint");
            console.error("Submission error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="citizen-v2-page">
            <section className="citizen-v2-header enhanced">
                <div>
                    <h1>Submit Complaint</h1>
                    <p>
                        Capture an issue with category, location, details and
                        optional media
                    </p>
                </div>
                <button className="citizen-v2-primary-btn">
                    <Plus size={16} /> Save Draft
                </button>
            </section>

            <article className="citizen-v2-card submit-card">
                <div className="p-6">
                    {message && (
                        <p className="text-green-600 mb-4 font-medium">
                            {message}
                        </p>
                    )}
                    {error && (
                        <p className="text-red-600 mb-4">{error}</p>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Category & Location */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Category
                                </label>
                                <select
                                    className="w-full p-3 border rounded-lg"
                                    value={category}
                                    onChange={(e) =>
                                        setCategory(e.target.value)
                                    }
                                    required
                                >
                                    <option value="">Select category</option>
                                    <option>Pothole / Road Damage</option>
                                    <option>Water Leak / Burst Pipe</option>
                                    <option>Power Outage</option>
                                    <option>Streetlight Fault</option>
                                    <option>Illegal Dumping</option>
                                    <option>Sewer Overflow</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter address or use current location"
                                    className="w-full p-3 border rounded-lg"
                                    value={location}
                                    onChange={(e) =>
                                        setLocation(e.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">
                                Description
                            </label>
                            <textarea
                                rows={5}
                                placeholder="Please describe the issue in detail..."
                                className="w-full p-3 border rounded-lg resize-y"
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                                required
                            />
                        </div>

                        {/* File Upload */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">
                                Attach Photo or Video (optional – max 10 MB)
                            </label>

                            <input
                                id="complaint-file-input"
                                type="file"
                                accept="image/*,video/*"
                                onChange={handleFileChange}
                            />

                            {previewUrl && (
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="max-h-48 mt-4 rounded"
                                />
                            )}

                            {selectedFile && (
                                <button
                                    type="button"
                                    onClick={clearFile}
                                    className="mt-2 text-blue-600 underline"
                                >
                                    Remove file
                                </button>
                            )}
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-6 py-3 rounded-lg text-white ${
                                    loading
                                        ? "bg-gray-400"
                                        : "bg-blue-600 hover:bg-blue-700"
                                }`}
                            >
                                {loading
                                    ? "Submitting..."
                                    : "Submit Complaint"}
                            </button>
                        </div>
                    </form>
                </div>
            </article>
        </div>
    );
}

export default SubmitComplaint;