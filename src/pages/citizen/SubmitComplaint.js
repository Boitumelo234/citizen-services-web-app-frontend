import "../../styles/dashboard.css";
import { Plus } from "lucide-react";
import '../../styles/dashboard.css';
import { useState, useEffect } from 'react';

function SubmitComplaint() {
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
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
            setError('File is too large (max 10 MB)');
            e.target.value = '';
            return;
        }

        setSelectedFile(file);
        setError(null);

        if (file.type.startsWith('image/')) {
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
        const input = document.getElementById('complaint-file-input');
        if (input) input.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        const token = localStorage.getItem('access_token');
        if (!token) {
            setError('Please log in first');
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            const complaintData = { category, location, description };
            formData.append('data', new Blob([JSON.stringify(complaintData)], { type: 'application/json' }));

            if (selectedFile) {
                formData.append('photo', selectedFile);
            }

            const response = await fetch('http://localhost:8080/api/complaints', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
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
            setMessage(`Complaint submitted! Reference: ${data.referenceNumber || '—'}`);

            setCategory('');
            setLocation('');
            setDescription('');
            clearFile();
        } catch (err) {
            setError(err.message || 'Failed to submit complaint');
            console.error('Submission error:', err);
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
                <button className="citizen-v2-primary-btn"><Plus size={16} /> Save Draft</button>
            </section>

            <article className="citizen-v2-card submit-card">
                <div className="form-grid">
                    <label>
                        <span>Category</span>
                        <select>
                            <option>Select category</option>
                            <option>Infrastructure & Roads</option>
                            <option>Water & Sanitation</option>
                            <option>Electricity & Energy</option>
                            <option>Illegal Dumping</option>
                            <option>Other</option>
                        </select>
                    </label>
        <div className="dashboard-container">
            <h1 className="dashboard-title">Submit a Complaint</h1>
            <p className="subtitle">Describe the issue – include photo and location if possible</p>

            <div className="card mt-8">
                <div className="p-6 pt-8">
                    {message && <p className="text-green-600 mb-4 font-medium">{message}</p>}
                    {error && <p className="text-red-600 mb-4">{error}</p>}

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <label className="block text-sm font-medium mb-2">Category</label>
                                <select className="w-full p-3 border rounded-lg" value={category} onChange={(e) => setCategory(e.target.value)} required>
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
                                <label className="block text-sm font-medium mb-2">Location</label>
                                <input
                                    type="text"
                                    placeholder="Enter address or use current location"
                                    className="w-full p-3 border rounded-lg"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                    <label>
                        <span>Location</span>
                        <input type="text" placeholder="Enter address or use current location" />
                    </label>
                </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Description</label>
                            <textarea
                                rows={5}
                                placeholder="Please describe the issue in detail..."
                                className="w-full p-3 border rounded-lg resize-y"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm font-medium mb-2">
                                Attach Photo or Video (optional – max 10 MB)
                            </label>
                            <label
                                htmlFor="complaint-file-input"
                                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition block ${
                                    previewUrl ? 'border-green-400 bg-green-50/40' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'
                                }`}
                            >
                                <input
                                    id="complaint-file-input"
                                    type="file"
                                    accept="image/jpeg,image/png,image/gif,video/mp4,video/quicktime"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />

                                {!selectedFile ? (
                                    <div>
                                        <p className="text-gray-700 font-medium mb-1">Click here or drag & drop</p>
                                        <p className="text-sm text-gray-500">JPG, PNG, GIF, MP4 • max 10 MB</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <p className="text-green-700 font-medium break-all">{selectedFile.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {(selectedFile.size / 1048576).toFixed(2)} MB
                                        </p>
                                        {previewUrl && (
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                className="max-h-48 mx-auto rounded-lg shadow-sm object-contain"
                                            />
                                        )}
                                    </div>
                                )}
                            </label>

                <label className="full-row">
                    <span>Description</span>
                    <textarea rows="6" placeholder="Describe the issue in detail"></textarea>
                </label>

                <div className="upload-box">
                    <p>Click or drag files here</p>
                    <small>Supported: JPG, PNG, MP4 (max 10MB)</small>
                </div>

                <div className="submit-actions">
                    <button className="citizen-v2-primary-btn">Submit Complaint</button>
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

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-8 py-3 rounded-lg font-medium text-white ${
                                    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {loading ? 'Submitting…' : 'Submit Complaint'}
                            </button>
                        </div>
                    </form>
                </div>
            </article>
        </div>
    );
}

export default SubmitComplaint;
