import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.scss";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      {/* Back to Home Button */}
      <button className="back-to-home-button" onClick={() => navigate("/")}>
        Back to Home
      </button>

      <h2>Login</h2>
      <form>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <p className="register-link" onClick={() => navigate("/register")}>
        New? Register
      </p>
      <p
        className="forgot-password"
        onClick={() => navigate("/forgot-password")}
      >
        Forgot Password?
      </p>
    </div>
  );
};

export default Login;
