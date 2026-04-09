import React from 'react';
import "./Footer.css";

function Footer() {
    return (
        <footer id="contact" className="footer">
            <div className="footer-content">
                <div className="footer-top">
                    <div className="footer-info">
                        <h3>Contact the Municipality</h3>
                        <p>
                            For further assistance or urgent matters, please contact the
                            municipality through our official digital and physical channels.
                        </p>
                    </div>

                    <div className="footer-contact-grid">
                        <div className="contact-item">
                            <strong>Email</strong>
                            <span>support@rustenburg.gov.za</span>
                        </div>
                        <div className="contact-item">
                            <strong>Phone</strong>
                            <span>+27 14 590 3111</span>
                        </div>
                        <div className="contact-item">
                            <strong>Address</strong>
                            <span>Missionary Mpheni House, Rustenburg</span>
                        </div>
                    </div>
                </div>

                <div className="footer-divider"></div>

                <div className="footer-bottom">
                    <p>© 2026 Rustenburg Local Municipality. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;