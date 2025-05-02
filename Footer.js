import React from 'react';
import '../styles/Footer.css';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Newsletter Section */}
        <div className="newsletter-section">
          <div className="newsletter-content">
            <h3>Stay up to date</h3>
            <p>Get updates on new features and announcements.</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button>Subscribe</button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="footer-logo">
              <img src={logo} alt="HomeStock Logo" />
              <span>HomeStock</span>
            </div>
            <p>Making home inventory management effortless.</p>
          </div>

          {/* Links Sections */}
          <div className="footer-links-container">
            <div className="footer-column">
              <h4>Product</h4>
              <Link to="/features">Features</Link>
              <Link to="/pricing">Pricing</Link>
              <Link to="/updates">Updates</Link>
              <Link to="/beta">Beta Program</Link>
            </div>

            <div className="footer-column">
              <h4>Company</h4>
              <Link to="/about">About Us</Link>
              <Link to="/careers">Careers</Link>
              <Link to="/press">Press</Link>
              <Link to="/contact">Contact</Link>
            </div>

            <div className="footer-column">
              <h4>Resources</h4>
              <Link to="/help">Help Center</Link>
              <Link to="/community">Community</Link>
              <Link to="/blog">Blog</Link>
              <Link to="/faqs">FAQs</Link>
            </div>

            <div className="footer-column">
              <h4>Legal</h4>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/cookies">Cookie Policy</Link>
              <Link to="/licenses">Licenses</Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            © 2025 HomeStock. All rights reserved.
          </div>
          <div className="footer-bottom-right">
            <Link to="/privacy">Privacy</Link>
            <span className="divider">|</span>
            <Link to="/terms">Terms</Link>
            <span className="divider">|</span>
            <Link to="/sitemap">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
