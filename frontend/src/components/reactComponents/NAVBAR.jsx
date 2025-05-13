import React from 'react'
import { Link } from 'react-router-dom';
import '../componentsStyleSheet/NAVBAR.css';
import logo2 from "../../assets/logo2.jpeg" // adjust the path based on your file structure

function Navbar() {
    return (
        <div id="navbar">
          <nav className="navbar">
            <div className="logo">
              <img src={logo2} alt="Adopt Buddy Logo" className="logo-img" />
              Adopt Buddy
            </div>
            <div className="links">
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/privacy">Privacy</Link>
            </div>
          </nav>
        </div>
    );
};

export default Navbar;
