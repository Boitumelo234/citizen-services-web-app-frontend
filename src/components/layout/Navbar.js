import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./Navbar.css";
import Modal from "../common/Modal";
import Login from "../../pages/auth/Login";
import Register from "../../pages/auth/Register";
import ForgotPassword from "../../pages/auth/ForgotPassword"; // Ensure this is imported

function Navbar() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isForgotOpen, setIsForgotOpen] = useState(false); // Added state

    const toggleLogin = () => {
        setIsRegisterOpen(false);
        setIsForgotOpen(false); // Close forgot password if open
        setIsLoginOpen(!isLoginOpen);
    };

    const toggleRegister = () => {
        setIsLoginOpen(false);
        setIsForgotOpen(false);
        setIsRegisterOpen(!isRegisterOpen);
    };

    // Added: Function to switch from Login to Forgot Password
    const toggleForgot = () => {
        setIsLoginOpen(false);
        setIsForgotOpen(true);
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    <Link to="/" className="navbar-logo-container">
                        <img src={logo} alt="Logo" className="navbar-logo" />
                        <span className="navbar-title">Rustenburg Municipality</span>
                    </Link>

                    <div className="nav-links">
                        <Link to="/">Home</Link>
                        <Link to="/services">Services</Link>
                        <Link to="/about">About</Link>
                        <a href="#contact">Contact</a>
                        <Link to="/faq">FAQ</Link>
                        <button onClick={toggleLogin} className="nav-btn login-btn">Login</button>
                    </div>
                </div>
            </nav>

            {/* Login Modal */}
            {isLoginOpen && (
                <Modal title="Account Login" onClose={() => setIsLoginOpen(false)}>
                    <Login
                        onLoginSuccess={() => setIsLoginOpen(false)}
                        onSwitchToRegister={toggleRegister}
                        onSwitchToForgot={toggleForgot} // Added: Pass toggleForgot to Login
                    />
                </Modal>
            )}

            {/* Register Modal */}
            {isRegisterOpen && (
                <Modal title="Create Citizen Account" onClose={() => setIsRegisterOpen(false)}>
                    <Register
                        onRegisterSuccess={() => setIsRegisterOpen(false)}
                        onSwitchToLogin={toggleLogin}
                    />
                </Modal>
            )}

            {/* Forgot Password Modal */}
            {isForgotOpen && (
                <Modal title="Reset Password" onClose={() => setIsForgotOpen(false)}>
                    <ForgotPassword onSwitchToLogin={toggleLogin} />
                </Modal>
            )}
        </>
    );
}

export default Navbar;