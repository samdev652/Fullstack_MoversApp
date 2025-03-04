import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.scss";

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="register-container">
      {/* Back to Home Button */}
      <button className="back-to-home-button" onClick={() => navigate("/")}>
        Back to Home
      </button>

      <h2>REGISTER FORM</h2>
      <form>
        <input type="text" placeholder="Full Name" required />
        <input type="tel" placeholder="Phone Number" required />
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Register</button>
      </form>
      <p className="login-link" onClick={() => navigate("/login")}>
        Already a member? Login
      </p>
    </div>
  );
};

export default Register;
