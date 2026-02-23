// src/pages/auth/Register.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();           // ← this stops page refresh
        console.log("Form submit clicked!"); // ← debug: must appear in console
        console.log("Email:", email, "Password:", password);

        setError("");
        setLoading(true);

        try {
            const response = await fetch("http://127.0.0.1:8000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Registration failed");
            }

            alert("Registration successful! Please log in.");
            navigate("/login");
        } catch (err) {
            console.error("Registration error:", err); // ← debug error
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section style={{ maxWidth: "400px", margin: "2rem auto", padding: "1rem" }}>
            <h2>Register (Citizen)</h2>
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
                    text={loading ? "Registering..." : "Register"}
                    disabled={loading}
                />
            </form>

            <p style={{ marginTop: "1rem" }}>
                Already have an account? <a href="/login">Login here</a>
            </p>
        </section>
    );
}

export default Register;