import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import "./ResetPassword.css";

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // AUTOMATION: Auto-fill token from URL on page load
    useEffect(() => {
        const urlToken = searchParams.get("token");
        if (urlToken) {
            setToken(urlToken);
            console.log("Token detected in URL:", urlToken); // Debugging for your demo
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:8080/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Reset failed. Please check your token.");
            }

            setMessage("✅ " + data.message);

            // Redirect to home (Login) after 3 seconds
            setTimeout(() => {
                navigate("/");
            }, 3000);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="reset-password-page">
            <div className="reset-card">
                <h2>Create New Password</h2>
                <p className="reset-instruction">
                    Your secure token has been automatically applied. Please enter your new password below.
                </p>

                {/* Feedback Banners */}
                {error && <div className="error-banner" style={{ color: 'red', backgroundColor: '#fee2e2', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>{error}</div>}
                {message && <div className="success-banner" style={{ color: 'green', backgroundColor: '#dcfce7', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>{message} Redirecting to login...</div>}

                <form onSubmit={handleSubmit} className="reset-form">
                    <Input
                        label="Security Token"
                        type="text"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="Waiting for token..."
                        required
                        readOnly // Makes it look more professional since it's auto-filled
                        style={{ backgroundColor: '#f3f4f6' }}
                    />
                    <Input
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter your new password"
                        required
                        disabled={isLoading}
                    />

                    <Button
                        type="submit"
                        text={isLoading ? "Updating..." : "Update Password"}
                        disabled={isLoading || !token || !newPassword}
                    />
                </form>

                <div className="reset-footer" style={{ marginTop: '20px' }}>
                    <button
                        onClick={() => navigate("/")}
                        style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;