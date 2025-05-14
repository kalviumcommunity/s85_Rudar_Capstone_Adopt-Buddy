import React from "react";
import { Link } from "react-router-dom";
import logo1 from '../../assets/logo1.jpeg';
import '../componentsStyleSheet/FOOTER.css';
function Footer() {
    return (
        <div id="footer">
            <footer className="footer-section">
                <div className="footer-content">
                    <div className="footer-logo">
                        <img src={logo1} alt="Adopt Buddy" />
                        <h3>Adopt Buddy</h3>
                        <p>Connecting paws with people ❤️</p>
                    </div>
                    <div className="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/terms">Terms of Service</Link></li>
                        </ul>
                    </div>
                    <div className="footer-contact">
                        <h4>Contact</h4>
                        <p>Email: XXX</p>
                        <p>Phone: XXX</p>
                    </div>
                    <div className="footer-socials">
                        <h4>Follow Us</h4>
                        <div className="social-icons">
                            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                            <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
                            <a href="#" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
                        </div>
                    </div>
                </div>
                <p className="footer-bottom">© 2025 Adopt Buddy. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Footer;
