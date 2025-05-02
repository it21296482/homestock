import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";
import Footer from "../components/Footer";

// 🖼️ Import images from assets
import baseImage from "../assets/Base.jpg";
import ctaImage from "../assets/family.jpg";
import scanImg from "../assets/scan.jpg";
import cloudImg from "../assets/cloud.jpg";
import inventoryImg from "../assets/inventory.jpg";
import expiryImg from "../assets/expiry.jpg";
import listImg from "../assets/list.jpg";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      {/* ✅ Navigation */}
      <nav className="nav">
        <div className="logo">HomeStock</div>
        <div className="nav-links">
          <button onClick={() => navigate("/login")}>Sign In</button>
          <button className="register" onClick={() => navigate("/register")}>
            Get Started
          </button>
        </div>
      </nav>

      {/* ✅ Hero Banner */}
      <header className="hero" style={{ backgroundImage: `url(${baseImage})` }}>
        <div className="word-art">HomeStock</div>
        <div className="hero-text">
          <h1>Manage Your Household Inventory</h1>
          <p>Simplify and streamline your home organization effortlessly.</p>
          <button onClick={() => navigate("/register")}>Get Started</button>
        </div>
      </header>

      {/* ✅ Features Section */}
      <section className="features">
        <h2>Features Overview</h2>
        <div className="features-grid">
          <div className="feature-card">
            <img src={inventoryImg} alt="Inventory" />
            <h3>Inventory Tracking</h3>
            <p>Monitor your pantry items effortlessly with our intuitive tracking system.</p>
            <button>Learn More</button>
          </div>
          <div className="feature-card">
            <img src={expiryImg} alt="Expiry" />
            <h3>Expiry Alerts</h3>
            <p>Get notified before items expire, reducing waste and saving money.</p>
            <button>Learn More</button>
          </div>
          <div className="feature-card">
            <img src={listImg} alt="Shopping List" />
            <h3>Shopping List Sync</h3>
            <p>Easily sync lists to shop smarter and never forget essential items.</p>
            <button>Learn More</button>
          </div>
        </div>
      </section>

      {/* ✅ Why HomeStock */}
      <section className="why-us">
        <h2>Why Choose HomeStock?</h2>
        <div className="why-content">
          <div className="why-text">
            <h3>Scan and Share Your Stock with Ease</h3>
            <p>
              Keep track of all your home materials by scanning and uploading to our platform.
              Share your inventory with others. It's simpler, quicker, and stress-free!
            </p>
            <h3>Access and Edit Anytime Anywhere</h3>
            <p>
              Access your account anytime, anywhere. Our cloud-based solution means your data
              is stored safely and can be edited from any device.
            </p>
          </div>
          <div className="why-images">
            <img src={scanImg} alt="Scan" />
            <img src={cloudImg} alt="Cloud" />
          </div>
        </div>
      </section>

      {/* ✅ CTA Section */}
      <section className="cta">
        <div className="cta-text">
          <h2>Get Organized Today!</h2>
          <p>
            Take control of your household inventory effortlessly. Register or log in now
            to start managing your items with ease!
          </p>
          <button onClick={() => navigate("/register")}>Join for free</button>
        </div>
        <div className="cta-image">
          <img src={ctaImage} alt="Family" />
        </div>
      </section>

      {/* ✅ Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
