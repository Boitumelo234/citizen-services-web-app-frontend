// pages/auth/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import "./Login.css";

function Login({ onLoginSuccess, onSwitchToRegister, onSwitchToForgot }) {
    const [email, setEmail]       = useState("");
    const [password, setPassword] = useState("");
    const [error, setError]       = useState("");
    const [loading, setLoading]   = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method:  "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body:    new URLSearchParams({ username: email, password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Login failed");

            // ── Store token ──────────────────────────────────────────
            localStorage.setItem("access_token", data.access_token);

            // ── Decode role ──────────────────────────────────────────
            const decoded = jwtDecode(data.access_token);

            // JWT may carry role in several possible shapes — handle all:
            //   { role: "ADMIN" }
            //   { role: "ROLE_STAFF" }
            //   { authorities: ["ROLE_CITIZEN"] }
            let rawRole = decoded.role
                || decoded.roles
                || (Array.isArray(decoded.authorities) ? decoded.authorities[0] : null)
                || "";

            if (Array.isArray(rawRole)) rawRole = rawRole[0];          // unwrap array
            const role = rawRole.replace("ROLE_", "").toLowerCase();   // normalise

            // ── Store user info for layout display ───────────────────
            // The backend /auth/login response often also returns user info;
            // store whatever is available so StaffLayout can read it.
            const userInfo = {
                email:          decoded.sub || decoded.email || email,
                fullName:       decoded.fullName || decoded.name || "",
                departmentName: decoded.departmentName || decoded.department || "",
                role:           role.toUpperCase(),
            };
            localStorage.setItem("user", JSON.stringify(userInfo));

            if (onLoginSuccess) onLoginSuccess();

            // ── Navigate to the correct home page ────────────────────
            if      (role === "admin")   navigate("/admin/overview");
            else if (role === "staff")   navigate("/staff/dashboard");   // ← was "/staff" (wrong)
            else                         navigate("/citizen");

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
                Don't have an account?{" "}
                <span className="auth-link" onClick={onSwitchToRegister}>Register here</span>
            </p>
        </div>
    );
}

export default Login;