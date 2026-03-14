// SubmitComplaint.jsx
import '../../styles/dashboard.css';
import { useState } from 'react';

function SubmitComplaint() {
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        const token = localStorage.getItem('access_token'); // ← fixed to match Login.js

        if (!token) {
            setError('Please log in first');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/complaints', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    category,
                    location,
                    description,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit complaint');
            }

            setMessage(`Complaint submitted! Reference: ${data.referenceNumber}`);
            // Optional: clear form
            setCategory('');
            setLocation('');
            setDescription('');
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Submit a Complaint</h1>
            <p className="subtitle">Describe the issue – include photo and location if possible</p>
            <div className="card mt-8">
                <div className="p-6 pt-8">
                    {message && <p style={{ color: 'green', marginBottom: '1rem' }}>{message}</p>}
                    {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <label className="block text-sm font-medium mb-2">Category</label>
                                <select
                                    className="w-full p-3 border border-[var(--border)] rounded-lg"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
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
                                <label className="block text-sm font-medium mb-2">Location</label>
                                <input
                                    type="text"
                                    placeholder="Enter address or use current location"
                                    className="w-full p-3 border border-[var(--border)] rounded-lg"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    required
                                />
                                <p className="text-xs text-[var(--text-light)] mt-2">
                                    GPS location will be automatically captured if permitted
                                </p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium mb-2">Description</label>
                            <textarea
                                rows="5"
                                placeholder="Please describe the issue in detail..."
                                className="w-full p-3 border border-[var(--border)] rounded-lg resize-y"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            ></textarea>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium mb-2">Attach Photo/Video (optional)</label>
                            <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center">
                                <p className="text-[var(--text-medium)]">Click or drag files here</p>
                                <p className="text-xs text-[var(--text-light)] mt-2">Supported: JPG, PNG, MP4 (max 10MB)</p>
                            </div>
                        </div>

                        <div className="mt-10 flex justify-end">
                            <button
                                type="submit"
                                className="btn-primary px-8 py-3"
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : 'Submit Complaint'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SubmitComplaint;