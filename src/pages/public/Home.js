import { useEffect } from "react";
import api from "../../api/api";

function Home() {

    useEffect(() => {
        api.get("/api/test")
            .then(res => {
                console.log("Backend:", res.data.message);
            })
            .catch(err => {
                console.error("Backend error:", err);
            });
    }, []);

    return (
        <>
            {/* HERO */}
            <section className="hero center-text">
                <h1>Rustenburg Citizen Services Platform</h1>
                <p>
                    A digital platform enabling residents to report municipal issues,
                    track service delivery, and stay informed.
                </p>
            </section>

            {/* PURPOSE */}
            <section className="section center-text">
                <h2>Why This Platform Exists</h2>
                <p>
                    Rustenburg Local Municipality is committed to improving service
                    delivery through digital transformation. This platform provides a
                    central point for citizens to engage with municipal services.
                </p>
            </section>

            {/* FEATURES */}
            <section className="section center-text">
                <h2>What You Can Do</h2>
                <ul className="center-list">
                    <li>Report service delivery issues online</li>
                    <li>Track the status of submitted complaints</li>
                    <li>Receive municipal notifications and updates</li>
                    <li>Engage transparently with departments</li>
                </ul>
            </section>

            {/* HOW IT WORKS */}
            <section className="section center-text">
                <h2>How It Works</h2>
                <ol className="center-list">
                    <li>Create an account or log in</li>
                    <li>Select a service category</li>
                    <li>Submit your issue with details</li>
                    <li>Track progress until resolution</li>
                </ol>
            </section>

            {/* CALL TO ACTION */}
            <section className="cta center-text">
                <h2>Get Started Today</h2>
                <p>Register or log in to report municipal issues.</p>
                <a href="/register" className="register-btn">Create Account</a>
            </section>
        </>
    );
}

export default Home;