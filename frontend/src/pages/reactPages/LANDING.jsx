import React from "react";
import { Link } from "react-router-dom";
import { FaPaw, FaHome } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import "../pagesStyleSheet/LANDING.css";
import logo2 from "../../assets/logo2.jpeg"
import logo1 from "../../assets/logo1.jpeg"

function LandingPage() {
    return (
        <div id="landing-page">
            {/* Navbar */}
            <div className="div-adjust">
                <nav className="navbar">
                    <div className="logo">
                        <img src={logo2} alt="Adopt Buddy" />
                        <h2>ADOPT BUDDY <FaPaw className="icon" /></h2>
                    </div>
                    <div className="nav-links">
                        <Link to="/sign-up" className="btn">Join Now</Link>
                        <Link to="/login" className="btn-outline">Login</Link>
                    </div>
                </nav>
            </div>

            {/* Hero Section */}
            <main className="hero-section">
                <div className="hero-content">
                    <h1>Find your purr-fect companion today</h1>
                    <p>Trusted shelters. Verified adopters. One loving home away.</p>
                    <div className="cta-buttons">
                        <Link to="/sign-up" className="btn-lg">Join Now</Link>
                        <Link to="/login" className="btn-lg btn-outline">Login</Link>
                    </div>
                    <p className="highlight-text"><FiHeart className="icon" /> Over 100 pets found homes this week!</p>
                </div>
            </main>

            {/* Features Section */}
            <section className="features-section">
                <h2>Why You'll Love Adopt Buddy</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <h4><FaPaw className="icon" /> Pet Listings</h4>
                        <ul>
                            <li>Filter by species, breed, age, and location</li>
                            <li>Instantly find pets that match your vibe</li>
                        </ul>
                    </div>

                    <div className="feature-card">
                        <h4>💖 Matchmaking Algorithm</h4>
                        <ul>
                            <li>Tell us your preferences</li>
                            <li>AI suggests pets tailored to your lifestyle</li>
                        </ul>
                    </div>

                    <div className="feature-card">
                        <h4><FaHome className="icon" />
                        Adoption Requests</h4>
                        <ul>
                            <li>Apply in one click</li>
                            <li>Track your application easily</li>
                            <li>Zero confusing paperwork</li>
                        </ul>
                    </div>

                    <div className="feature-card">
                        <h4>📩 Messaging System</h4>
                        <ul>
                            <li>Chat with verified shelters</li>
                            <li>Ask questions or set up visits within the app</li>
                        </ul>
                    </div>

                    <div className="feature-card">
                        <h4>🏥 Health & Care Info</h4>
                        <ul>
                            <li>Access vaccination & health history</li>
                            <li>Get post-adoption care tips</li>
                        </ul>
                    </div>

                    <div className="feature-card">
                        <h4>📍 Location-Based Search</h4>
                        <ul>
                            <li>Search pets near you</li>
                            <li>Interactive map with live listings</li>
                        </ul>
                    </div>

                </div>
            </section>

            <section className="adoption-preview">
                <h3> Recent 7-Day Adoptions</h3>
                <div className="pet-preview">Coming soon...</div>
                <div className="pet-preview">🐾 Stay tuned for adorable updates!</div>
            </section>
            {/* Footer */}
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

export default LandingPage;
