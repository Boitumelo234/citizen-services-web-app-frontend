import "../../styles/dashboard.css";
import { Plus } from "lucide-react";

function SubmitComplaint() {
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

                    <label>
                        <span>Location</span>
                        <input type="text" placeholder="Enter address or use current location" />
                    </label>
                </div>

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
                </div>
            </article>
        </div>
    );
}

export default SubmitComplaint;
