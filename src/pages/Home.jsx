import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.scss";
import SearchBar from "../components/SearchBar";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

// Testimonials data
const testimonials = [
  {
    id: 1,
    name: "Martin Hughes",
    quote: "MoveEase made my relocation stress-free and efficient. Highly recommended!",
    image: "./src/assets/Martin.jpg",
  },
  {
    id: 2,
    name: "Janet Jason",
    quote: "The team was professional and handled everything with care. Great service!",
    image: "./src/assets/Janet.jpg",
  },
];

const Home = () => {
  const [distance, setDistance] = useState("");
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();

  const calculateAmount = () => {
    const rate = 2;
    setAmount((distance * rate).toFixed(2));
  };

  const testimonialSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  return (
    <div className="home-container">
      {/* Left Section - Content */}
      <div className="left-section">
        {/* Title */}
        <h1 className="app-title">MoveEase - Relocate with Ease</h1>

        {/* Calculator */}
        <div className="calculator">
          <h2>Calculate Moving Cost</h2>
          <input
            type="number"
            placeholder="Distance (in miles)"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
          />
          <button onClick={calculateAmount}>Calculate</button>
          {amount && <p>Estimated Cost: ${amount}</p>}
        </div>

        {/* SearchBar */}
        <SearchBar
          onSearch={(query) => navigate(`/search?query=${query}`)}
        />

        {/* Animated Get Started Button */}
        <button
          className="get-started-button"
          onClick={() => navigate("/register")}
        >
          Get Started
        </button>

        {/* Testimonials Carousel */}
        <div className="testimonials-section">
          <h2>What People Are Saying</h2>
          <Slider {...testimonialSettings}>
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="testimonial-image"
                />
                <div className="testimonial-content">
                  <h3 className="testimonial-name">{testimonial.name}</h3>
                  <p className="testimonial-quote">"{testimonial.quote}"</p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="right-section">
        <img src="/src/assets/home.jpg" alt="Moving Trucks" />
      </div>

      {/* Login Button */}
      <button className="login-button" onClick={() => navigate("/login")}>
        Login
      </button>
    </div>
  );
};

export default Home;
