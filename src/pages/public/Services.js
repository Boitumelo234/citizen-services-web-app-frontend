import React from 'react';
import { HardHat, Droplets, Zap, Trash2, ShieldAlert } from "lucide-react";
import "./Services.css";

function Services() {
    const services = [
        {
            icon: <HardHat size={32} />,
            title: "Roads & Infrastructure",
            desc: "Potholes, road damage, and pavement maintenance."
        },
        {
            icon: <Droplets size={32} />,
            title: "Water & Sanitation",
            desc: "Leaks, burst pipes, sewage issues, and water supply."
        },
        {
            icon: <Zap size={32} />,
            title: "Electricity",
            desc: "Power outages, faulty street lights, and electrical hazards."
        },
        {
            icon: <Trash2 size={32} />,
            title: "Waste Management",
            desc: "Missed collections, illegal dumping, and bin requests."
        },
        {
            icon: <ShieldAlert size={32} />,
            title: "Public Safety",
            desc: "Emergency alerts, fire hazards, and community safety."
        }
    ];

    return (
        <section className="services-page">
            <div className="services-header">
                <h2>Municipal Services</h2>
                <p>
                    The following services are officially supported through the Citizen Services Platform.
                    Select a category to learn more or lodge a complaint.
                </p>
            </div>

            <div className="services-grid">
                {services.map((service, index) => (
                    <div className="service-card" key={index}>
                        <div className="service-icon-box">{service.icon}</div>
                        <h3>{service.title}</h3>
                        <p>{service.desc}</p>
                    </div>
                ))}
            </div>

            <div className="services-footer-note">
                <p>Additional services may be added as the platform evolves.</p>
            </div>
        </section>
    );
}

export default Services;