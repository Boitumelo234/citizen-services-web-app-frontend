// src/pages/auth/Login.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

function Login() {
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
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    username: email,
                    password: password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Now safely read data.error (because backend returns JSON)
                throw new Error(data.error || "Login failed");
            }

            // Save token
            localStorage.setItem("access_token", data.access_token);

            // Decode to get role (normalize case)
            const decoded = jwtDecode(data.access_token);
            const role = (decoded.role || "").toLowerCase();

            // Redirect based on role
            if (role === "admin") {
                navigate("/admin");
                alert("Welcome Admin!");
            } else {
                navigate("/citizen");
                alert("Welcome Citizen!");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(err.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section style={{ maxWidth: "400px", margin: "2rem auto", padding: "1rem" }}>
            <h2>Login</h2>
            {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.trim())}
                    required
                />
                <Input
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button
                    type="submit"
                    text={loading ? "Logging in..." : "Login"}
                    disabled={loading}
                />
            </form>

            <p style={{ marginTop: "1rem" }}>
                Don't have an account? <a href="/register">Register here</a>
            </p>
        </section>
    );
}

export default Login;