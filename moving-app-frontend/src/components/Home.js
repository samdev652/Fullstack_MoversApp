import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // Import custom CSS for styling
import movingTruckImage from "../assets/truck.jpg"; // Import the local image

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${movingTruckImage})` }} // Use the imported image
      >
        <div className="hero-content">
          <h1 className="hero-title">Move with Ease, Live with Peace</h1>
          <p className="hero-description">
            Relocating has never been easier. Let us handle the heavy lifting
            while you focus on what matters most.
          </p>
          <Link to="/login" className="get-started-button">
            Get Started
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2 className="testimonials-title">What Our Customers Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p className="testimonial-text">
              "The best moving experience ever! The team was professional and
              efficient."
            </p>
            <p className="testimonial-author">- John Doe</p>
          </div>
          <div className="testimonial-card">
            <p className="testimonial-text">
              "I was amazed by how smooth the process was. Highly recommend!"
            </p>
            <p className="testimonial-author">- Jane Smith</p>
          </div>
          <div className="testimonial-card">
            <p className="testimonial-text">
              "Affordable, reliable, and stress-free. Thank you!"
            </p>
            <p className="testimonial-author">- Mike Johnson</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <h2 className="cta-title">Ready to Move?</h2>
        <p className="cta-description">
          Join thousands of happy customers and experience the best moving
          services today.
        </p>
        <Link to="/login" className="cta-button">
          Get Started
        </Link>
      </section>
    </div>
  );
};

export default Home;
