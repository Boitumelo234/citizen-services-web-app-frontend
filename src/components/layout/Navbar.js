import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar">
            <h2>Rustenburg Municipality</h2>

            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/services">Services</Link>
                <Link to="/about">About</Link>
                <Link to="/contact">Contact</Link>
                <Link to="/faq">FAQ</Link>

                <Link to="/login" className="nav-btn login-btn">
                    Login
                </Link>

                <Link to="/register" className="nav-btn register-btn">
                    Register
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;