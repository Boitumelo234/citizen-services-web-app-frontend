import React from 'react';
import "./FAQ.css";
import { HelpCircle } from "lucide-react";

function FAQ() {
    const faqData = [
        {
            question: "Is this platform free to use?",
            answer: "Yes. The platform is provided as a public service by the Rustenburg Local Municipality for all residents and businesses."
        },
        {
            question: "How long does it take to resolve a complaint?",
            answer: "Resolution times depend on the service category. Urgent safety issues are prioritized, while infrastructure projects may take longer."
        },
        {
            question: "Can I track my complaint?",
            answer: "Yes. All submitted complaints can be tracked online in real-time through your personal dashboard."
        },
        {
            question: "Do I need an account?",
            answer: "Yes. An account ensures secure tracking, allows us to send you status updates, and keeps your communication with the municipality private."
        }
    ];

    return (
        <section className="faq-page">
            <div className="faq-header">
                <HelpCircle size={48} className="faq-icon-main" />
                <h2>Frequently Asked Questions</h2>
                <div className="underline"></div>
                <p>Find quick answers to common questions about using the Citizen Services Platform.</p>
            </div>

            <div className="faq-container">
                {faqData.map((item, index) => (
                    <div className="faq-item" key={index}>
                        <h3>{item.question}</h3>
                        <p>{item.answer}</p>
                    </div>
                ))}
            </div>

            <div className="faq-support-box">
                <p>Still have questions? Reach out to us via the contact details in the footer below.</p>
            </div>
        </section>
    );
}

export default FAQ;