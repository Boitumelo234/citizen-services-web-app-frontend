import { useEffect, useState } from "react";
import api from "../../api/api";
import purposeImage from "../../assets/header-image.jpg";
import "./Home.css";
import {
    ClipboardList,
    MapPin,
    Bell,
    Handshake
} from "lucide-react";

// Import components for the modals
import Modal from "../../components/common/Modal";
import Register from "../auth/Register";
import Login from "../auth/Login"; // Added Login import

function Home() {
    // States to control both modals
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    // Switching Logic: Closes one and opens the other
    const openLogin = () => {
        setIsRegisterOpen(false);
        setIsLoginOpen(true);
    };

    const openRegister = () => {
        setIsLoginOpen(false);
        setIsRegisterOpen(true);
    };

    useEffect(() => {
        api.get("/api/test")
            .then(res => {
                console.log("Backend:", res.data.message);
            })
            .catch(err => {
                console.error("Backend error:", err);
            });
    }, []);

    return (
        <div className="home-container">
            {/* HERO SECTION */}
            <section className="hero">
                <div className="hero-overlay">
                    <div className="hero-content">
                        <h1>Rustenburg Citizen Services Platform</h1>
                        <p>
                            A digital platform enabling residents to report municipal issues,
                            track service delivery, and stay informed.
                        </p>

                        <div className="hero-cta">
                            <h2>Get Started Today</h2>
                            <p>Register or log in to report municipal issues.</p>

                            {/* Button opens the Register Modal */}
                            <button onClick={openRegister} className="hero-btn">
                                Create Account
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* PURPOSE SECTION */}
            <section className="section purpose-section">
                <div className="purpose-container">
                    <div className="purpose-image">
                        <img
                            src={purposeImage}
                            alt="Rustenburg Municipality"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/500x400/003366/ffffff?text=Rustenburg+Services';
                            }}
                        />
                    </div>
                    <div className="purpose-text">
                        <h2>Why This Platform Exists</h2>
                        <p>
                            Rustenburg Local Municipality is committed to improving service
                            delivery through digital transformation. This platform provides a
                            central point for citizens to engage with municipal services.
                        </p>
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section className="section features-section">
                <h2>What You Can Do</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon"><ClipboardList size={36} /></div>
                        <h3>Report Issues</h3>
                        <p>Submit municipal service delivery issues online quickly and securely.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon"><MapPin size={36} /></div>
                        <h3>Track Complaints</h3>
                        <p>Monitor the real-time status of your submitted service requests.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon"><Bell size={36} /></div>
                        <h3>Receive Updates</h3>
                        <p>Get official notifications and updates directly from the municipality.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon"><Handshake size={36} /></div>
                        <h3>Engage Transparently</h3>
                        <p>Communicate clearly with relevant municipal departments.</p>
                    </div>
                </div>
            </section>

            {/* PROCESS SECTION */}
            <section className="section process-section">
                <h2>How It Works</h2>
                <div className="process-steps">
                    {[
                        "Create an account or log in",
                        "Select a service category",
                        "Submit your issue with details",
                        "Track progress until resolution"
                    ].map((step, index) => (
                        <div className="process-step" key={index}>
                            <span className="step-number">{index + 1}</span>
                            <p>{step}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* REGISTER MODAL */}
            {isRegisterOpen && (
                <Modal title="Create Citizen Account" onClose={() => setIsRegisterOpen(false)}>
                    <Register
                        onRegisterSuccess={() => setIsRegisterOpen(false)}
                        onSwitchToLogin={openLogin}
                    />
                </Modal>
            )}

            {/* LOGIN MODAL */}
            {isLoginOpen && (
                <Modal title="Account Login" onClose={() => setIsLoginOpen(false)}>
                    <Login
                        onLoginSuccess={() => setIsLoginOpen(false)}
                        onSwitchToRegister={openRegister}
                    />
                </Modal>
            )}
        </div>
    );
}

export default Home;