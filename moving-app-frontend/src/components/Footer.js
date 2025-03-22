import React from 'react';
import './Footer.css'; // Import the footer styles

const Footer = () => {
  return (
    <footer className="footer">
      <div className="scrolling-text">
        Welcome to Movers, Here we move the world! Contact us <a href="mailto:info@movers.com" className="email-link">info@movers.com</a>. We are movers..
      </div>
    </footer>
  );
};

export default Footer;
