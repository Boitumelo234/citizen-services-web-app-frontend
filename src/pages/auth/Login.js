import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import "./Login.css";

function Login({ onLoginSuccess, onSwitchToRegister, onSwitchToForgot }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ username: email, password: password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Login failed");

            localStorage.setItem("access_token", data.access_token);
            const decoded = jwtDecode(data.access_token);
            const role = (decoded.role || "").toLowerCase();

            if (onLoginSuccess) onLoginSuccess();

            if (role === "admin") navigate("/admin");
            else navigate("/citizen");

        } catch (err) {
            console.error("Login error:", err);
            setError(err.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-modal-content">
            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit} className="login-form">
                <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.trim())}
                    placeholder="Enter your email"
                    required
                />

                <Input
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                />

                {/* Updated: Forgot Password link placed before the submit button */}
                <div className="forgot-password-link">
                    <span className="auth-link-small" onClick={onSwitchToForgot}>
                        Forgot Password?
                    </span>
                </div>

                <Button
                    type="submit"
                    text={loading ? "Logging in..." : "Login"}
                    disabled={loading}
                />
            </form>

            <p className="switch-prompt">
                Don't have an account? <span className="auth-link" onClick={onSwitchToRegister}>Register here</span>
            </p>
        </div>
    );
}

export default Login;