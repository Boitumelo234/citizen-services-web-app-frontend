import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

function ForgotPassword({ onSwitchToLogin }) {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isRedirecting, setIsRedirecting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        try {
            const response = await fetch("http://localhost:8080/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            if (data.token) {
                setIsRedirecting(true);
                setMessage("✅ Reset token generated successfully! Redirecting you now...");
                setTimeout(() => {
                    navigate(`/reset-password?token=${data.token}`);
                }, 2000);
            } else {
                setMessage(data.message || "Request processed successfully.");
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-modal-content">
            <h3>Reset Password</h3>
            <p>Enter your email and we will generate a secure reset link for you instantly.</p>

            {error && <p className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
            {message && <p className="success-message" style={{ color: 'green', marginBottom: '10px' }}>{message}</p>}

            <form onSubmit={handleSubmit}>
                <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    required
                    disabled={isRedirecting}
                />

                <Button
                    type="submit"
                    text={isRedirecting ? "Redirecting..." : "Generate Reset Link"}
                    disabled={isRedirecting}
                />
            </form>

            <p className="switch-prompt" style={{ marginTop: '20px' }}>
                Remember your password?{" "}
                <span className="auth-link" onClick={onSwitchToLogin} style={{ cursor: 'pointer', color: '#007bff' }}>
                    Login here
                </span>
            </p>

        </div>
    );
}

export default ForgotPassword;