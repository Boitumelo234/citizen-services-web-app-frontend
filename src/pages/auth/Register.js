import { useState } from "react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import "./Register.css";

// Added onSwitchToLogin to the props here
function Register({ onRegisterSuccess, onSwitchToLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Registration failed");

            alert("Registration successful! You can now log in.");
            if (onRegisterSuccess) onRegisterSuccess();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit} className="register-form">
                <Input
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.trim())}
                    placeholder="name@example.com"
                    required
                />
                <Input
                    label="Create Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    required
                />
                <div className="form-action">
                    <Button
                        type="submit"
                        text={loading ? "Creating Account..." : "Register"}
                        disabled={loading}
                    />
                </div>
            </form>

            <p className="login-prompt">
                Already have an account? <span className="text-link" onClick={onSwitchToLogin}>Login here</span>
            </p>
        </div>
    );
}

export default Register;