import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import movingTruckImage from "../assets/truck.jpg";

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${movingTruckImage})` }}
      >
        <div className="hero-content">
          <h1 className="hero-title">Move with Ease, Live with Peace</h1>
          <p className="hero-description">
            Experience seamless relocation with our premium moving services. We
            handle the heavy lifting while you focus on what matters most.
          </p>
          <Link to="/login" className="get-started-button">
            Get Started
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-content">
          <div className="features-header">
            <p className="features-pretitle">Why Choose Us</p>
            <h2 className="features-title">Premium Moving Experience</h2>
            <p className="features-description">
              Designed with care, built for reliability. Every move is handled
              with precision and professionalism.
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3 className="feature-title">Real-Time Tracking</h3>
              <p className="feature-text">
                Track your belongings in real-time with our advanced GPS system.
                Always know where your items are.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3 className="feature-title">Transparent Pricing</h3>
              <p className="feature-text">
                No hidden fees, no surprises. Get instant quotes and flexible
                payment options.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3 className="feature-title">Secure & Insured</h3>
              <p className="feature-text">
                Full insurance coverage and verified professional drivers for
                complete peace of mind.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Fast & Reliable</h3>
              <p className="feature-text">
                Same-day bookings available. We're ready when you are, with 24/7
                customer support.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3 className="feature-title">Verified Professionals</h3>
              <p className="feature-text">
                All drivers are background-checked, trained, and rated by our
                community.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3 className="feature-title">Eco-Friendly</h3>
              <p className="feature-text">
                Optimized routes and modern vehicles reduce our carbon
                footprint. Move sustainably.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">50K+</div>
            <div className="stat-label">Successful Moves</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">98%</div>
            <div className="stat-label">Customer Satisfaction</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Verified Drivers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Support Available</div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="testimonials-content">
          <h2 className="testimonials-title">What Our Customers Say</h2>
          <p className="testimonials-subtitle">
            Join thousands of satisfied customers who trust us with their moves
          </p>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <p className="testimonial-text">
                "The best moving experience ever! The team was professional,
                punctual, and handled everything with care. Highly recommend
                this service!"
              </p>
              <div className="testimonial-footer">
                <div className="testimonial-avatar">JD</div>
                <div className="testimonial-info">
                  <div className="testimonial-author">John Doe</div>
                  <div className="testimonial-role">Business Owner</div>
                  <div className="testimonial-rating">
                    <span className="star">★</span>
                    <span className="star">★</span>
                    <span className="star">★</span>
                    <span className="star">★</span>
                    <span className="star">★</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-text">
                "I was amazed by how smooth the process was. Real-time tracking
                gave me peace of mind throughout the entire move."
              </p>
              <div className="testimonial-footer">
                <div className="testimonial-avatar">JS</div>
                <div className="testimonial-info">
                  <div className="testimonial-author">Jane Smith</div>
                  <div className="testimonial-role">Software Engineer</div>
                  <div className="testimonial-rating">
                    <span className="star">★</span>
                    <span className="star">★</span>
                    <span className="star">★</span>
                    <span className="star">★</span>
                    <span className="star">★</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-text">
                "Affordable, reliable, and stress-free. The transparent pricing
                and excellent customer service exceeded my expectations!"
              </p>
              <div className="testimonial-footer">
                <div className="testimonial-avatar">MJ</div>
                <div className="testimonial-info">
                  <div className="testimonial-author">Mike Johnson</div>
                  <div className="testimonial-role">Marketing Director</div>
                  <div className="testimonial-rating">
                    <span className="star">★</span>
                    <span className="star">★</span>
                    <span className="star">★</span>
                    <span className="star">★</span>
                    <span className="star">★</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Move?</h2>
          <p className="cta-description">
            Join thousands of happy customers and experience the future of
            moving services. Get started in minutes.
          </p>
          <div className="cta-buttons">
            <Link to="/login" className="cta-button cta-button-primary">
              Get Started
            </Link>
            <Link to="/register" className="cta-button cta-button-secondary">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
