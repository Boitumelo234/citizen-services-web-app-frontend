import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Register.module.css";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: "",
        email:    "",
        phone:    "",
        password: "",
        confirm:  "",
    });
    const [error,   setError]   = useState("");
    const [loading, setLoading] = useState(false);

    const set = (field) => (e) =>
        setForm((f) => ({ ...f, [field]: e.target.value }));

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (form.password !== form.confirm) {
            setError("Passwords do not match.");
            return;
        }
        if (form.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: form.fullName,
                    email:    form.email,
                    phone:    form.phone,
                    password: form.password,
                    // Role defaults to CITIZEN on the backend
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Registration failed. Please try again.");
                return;
            }

            // Registration successful — redirect to login
            navigate("/login", {
                state: { message: "Account created! You can now log in." }
            });

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
                        <div className={styles.brandSub}>Create a citizen account</div>
                    </div>
                </div>

                <h2 className={styles.title}>Create your account</h2>
                <p className={styles.subtitle}>
                    Register to submit and track service complaints in your area.
                </p>

                {error && <div className={styles.errorBanner}>{error}</div>}

                <form onSubmit={handleRegister} className={styles.form}>
                    <div className={styles.field}>
                        <label className={styles.label}>Full name</label>
                        <input
                            className={styles.input}
                            type="text"
                            placeholder="e.g. Thabo Mokoena"
                            value={form.fullName}
                            onChange={set("fullName")}
                            required
                            autoFocus
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Email address</label>
                        <input
                            className={styles.input}
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={set("email")}
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>
                            Phone number <span className={styles.optional}>(optional)</span>
                        </label>
                        <input
                            className={styles.input}
                            type="tel"
                            placeholder="e.g. 078-555-1234"
                            value={form.phone}
                            onChange={set("phone")}
                        />
                    </div>

                    <div className={styles.twoCol}>
                        <div className={styles.field}>
                            <label className={styles.label}>Password</label>
                            <input
                                className={styles.input}
                                type="password"
                                placeholder="Min. 6 characters"
                                value={form.password}
                                onChange={set("password")}
                                required
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Confirm password</label>
                            <input
                                className={`${styles.input} ${
                                    form.confirm && form.confirm !== form.password
                                        ? styles.inputError
                                        : ""
                                }`}
                                type="password"
                                placeholder="Repeat password"
                                value={form.confirm}
                                onChange={set("confirm")}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.roleNote}>
                        <span className={styles.roleIcon}>👤</span>
                        You will be registered as a <strong>Citizen</strong>. Staff accounts
                        are created by the administrator.
                    </div>

                    <button className={styles.submitBtn} type="submit" disabled={loading}>
                        {loading ? <span className={styles.spinner} /> : "Create account"}
                    </button>
                </form>

                <p className={styles.loginLink}>
                    Already have an account?{" "}
                    <Link to="/login" className={styles.link}>Sign in</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;