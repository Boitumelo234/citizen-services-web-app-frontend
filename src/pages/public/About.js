import React from 'react';
import { Target, Eye, Activity, Users, Globe } from "lucide-react";
import "./About.css";

function About() {
    const objectives = [
        {
            icon: <Activity size={28} />,
            text: "Improve response times to service issues"
        },
        {
            icon: <Eye size={28} />,
            text: "Increase transparency and accountability"
        },
        {
            icon: <Target size={28} />,
            text: "Provide real-time service tracking"
        },
        {
            icon: <Users size={28} />,
            text: "Enhance citizen participation"
        }
    ];

    return (
        <section className="about-page">
            <div className="about-header">
                <h2>About the Platform</h2>
                <div className="underline"></div>
                <p className="about-intro">
                    The Citizen Services Platform is an initiative by Rustenburg Local
                    Municipality to modernize the way residents interact with municipal
                    services.
                </p>
            </div>

            <div className="about-content">
                <div className="objectives-section">
                    <h3>Our Core Objectives</h3>
                    <div className="objectives-grid">
                        {objectives.map((obj, index) => (
                            <div className="objective-card" key={index}>
                                <div className="obj-icon">{obj.icon}</div>
                                <p>{obj.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="target-audience">
                    <div className="audience-card">
                        <div className="audience-icon">
                            <Globe size={40} />
                        </div>
                        <div className="audience-text">
                            <h3>Who Can Use This Platform?</h3>
                            <p>
                                All residents, businesses, and stakeholders within the
                                <strong> Rustenburg Local Municipality</strong> jurisdiction.
                                We are committed to inclusive digital access for everyone.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default About;