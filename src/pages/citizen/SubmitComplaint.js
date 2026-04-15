import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import api from "../../api/api";   // ✅ using your configured axios instance
import "../../styles/dashboard.css";

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
            if (previewUrl) URL.revokeObjectURL(previewUrl);
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
        const input = document.getElementById("complaint-file-input");
        if (input) input.value = "";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
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
            // ⚠️ No 'title' field – backend must handle missing title (e.g., set default)
            const complaintData = { category, location, description };
            formData.append("data", new Blob([JSON.stringify(complaintData)], { type: "application/json" }));
            if (selectedFile) {
                formData.append("photo", selectedFile);
            }

            // ✅ Using your api instance (baseURL + token automatically added)
            const response = await api.post("/complaints", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setMessage(`Complaint submitted! Reference: ${response.data.referenceNumber || "-"}`);
            setCategory("");
            setLocation("");
            setDescription("");
            clearFile();
        } catch (err) {
            const backendMessage = err.response?.data?.error || err.response?.data?.message || err.message;
            setError(backendMessage || "Failed to submit complaint");
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
                    <p>Capture an issue with category, location, details and optional media</p>
                </div>
                <button className="citizen-v2-primary-btn" type="button"><Plus size={16} /> Save Draft</button>
            </section>

            {message && <p className="subtitle" style={{ color: "#15803d" }}>{message}</p>}
            {error && <p className="subtitle" style={{ color: "#dc2626" }}>{error}</p>}

            <article className="citizen-v2-card submit-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <label>
                            <span>Category</span>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                                <option value="">Select category</option>
                                <option>Infrastructure & Roads</option>
                                <option>Water & Sanitation</option>
                                <option>Electricity & Energy</option>
                                <option>Illegal Dumping</option>
                                <option>Other</option>
                            </select>
                        </label>

                        <label>
                            <span>Location</span>
                            <input
                                type="text"
                                placeholder="Enter address or use current location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                            />
                        </label>
                    </div>

                    <label className="full-row">
                        <span>Description</span>
                        <textarea
                            rows="6"
                            placeholder="Describe the issue in detail"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </label>

                    <div className="upload-box">
                        <label htmlFor="complaint-file-input" style={{ display: "block", cursor: "pointer" }}>
                            {!selectedFile ? (
                                <>
                                    <p>Click or drag files here</p>
                                    <small>Supported: JPG, PNG, MP4 (max 10MB)</small>
                                </>
                            ) : (
                                <>
                                    <p>{selectedFile.name}</p>
                                    <small>{(selectedFile.size / 1048576).toFixed(2)} MB</small>
                                    {previewUrl && (
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="max-h-48 mx-auto rounded-lg shadow-sm object-contain"
                                            style={{ marginTop: "1rem" }}
                                        />
                                    )}
                                </>
                            )}
                        </label>
                        <input
                            id="complaint-file-input"
                            type="file"
                            accept="image/jpeg,image/png,image/gif,video/mp4,video/quicktime"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        {selectedFile && (
                            <div className="mt-3 text-center">
                                <button
                                    type="button"
                                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                                    onClick={clearFile}
                                >
                                    Remove / Change file
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="submit-actions">
                        <button className="citizen-v2-primary-btn" type="submit" disabled={loading}>
                            {loading ? "Submitting..." : "Submit Complaint"}
                        </button>
                    </div>
                </form>
            </article>
        </div>
    );
}

export default SubmitComplaint;