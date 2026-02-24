// SubmitComplaint.jsx
import '../../styles/dashboard.css';
// import ComplaintForm from "../../components/complaints/ComplaintForm";  // ← keep if you have it

function SubmitComplaint() {
    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Submit a Complaint</h1>
            <p className="subtitle">Describe the issue – include photo and location if possible</p>

            <div className="card mt-8">
                <div className="p-6 pt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <label className="block text-sm font-medium mb-2">Category</label>
                            <select className="w-full p-3 border border-[var(--border)] rounded-lg">
                                <option>Select category</option>
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
                            />
                            <p className="text-xs text-[var(--text-light)] mt-2">
                                GPS location will be automatically captured if permitted
                            </p>
                        </div>
                    </div>

                    {/* ComplaintForm would go here */}
                    <div className="mt-6">
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea
                            rows="5"
                            placeholder="Please describe the issue in detail..."
                            className="w-full p-3 border border-[var(--border)] rounded-lg resize-y"
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
                        <button className="btn-primary px-8 py-3">
                            Submit Complaint
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SubmitComplaint;