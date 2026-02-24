import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./Navbar.css";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo Section */}
                <Link to="/" className="navbar-logo-container">
                    <img
                        src={logo}
                        alt="Rustenburg Municipality Logo"
                        className="navbar-logo"
                    />
                    <span className="navbar-title">Rustenburg Municipality</span>
                </Link>

                {/* Navigation Links */}
                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/services">Services</Link>
                    <Link to="/about">About</Link>
                    <Link to="/contact">Contact</Link>
                    <Link to="/faq">FAQ</Link>

                    <div className="nav-auth-buttons">
                        <Link to="/login" className="nav-btn login-btn">
                            Login
                        </Link>
                        <Link to="/register" className="nav-btn register-btn">
                            Register
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;