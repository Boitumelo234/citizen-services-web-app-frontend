import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Login.module.css";

function Login() {
    const navigate   = useNavigate();
    const [email,    setEmail]    = useState("");
    const [password, setPassword] = useState("");
    const [error,    setError]    = useState("");
    const [loading,  setLoading]  = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                `http://localhost:8080/api/auth/login?username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
                { method: "POST" }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Invalid email or password");
                return;
            }

            const token = data.access_token;
            localStorage.setItem("token", token);

            // Decode role from JWT payload
            const payload = JSON.parse(atob(token.split(".")[1]));
            const role    = payload.role;
            localStorage.setItem("role", role);

            // Redirect based on role
            if (role === "ADMIN")        navigate("/admin/overview");
            else if (role === "STAFF")   navigate("/staff");
            else                         navigate("/citizen");

        } catch {
            setError("Cannot connect to server. Make sure the backend is running on port 8080.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <div className={styles.brand}>
                    <div className={styles.logo}>RM</div>
                    <div>
                        <div className={styles.brandName}>Rustenburg Municipality</div>
                        <div className={styles.brandSub}>Citizen Services Portal</div>
                    </div>
                </div>

                <h2 className={styles.title}>Sign in to your account</h2>

                {error && <div className={styles.errorBanner}>{error}</div>}

                <form onSubmit={handleLogin} className={styles.form}>
                    <div className={styles.field}>
                        <label className={styles.label}>Email address</label>
                        <input
                            className={styles.input}
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Password</label>
                        <input
                            className={styles.input}
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button className={styles.submitBtn} type="submit" disabled={loading}>
                        {loading ? <span className={styles.spinner} /> : "Sign in"}
                    </button>
                </form>

                <p className={styles.registerLink}>
                    Don't have an account?{" "}
                    <Link to="/register" className={styles.link}>Register here</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;