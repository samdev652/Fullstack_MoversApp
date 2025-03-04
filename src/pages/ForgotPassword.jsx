import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ForgotPassword.scss";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    // Simulate password reset logic (replace with actual API call)
    setMessage("Password reset successful!");
    setTimeout(() => {
      navigate("/login"); // Redirect to login page after successful reset
    }, 2000);
  };

  return (
    <div className="forgot-password-container">
      {/* Back to Home Button */}
      <button className="back-to-home-button" onClick={() => navigate("/")}>
        Back to Home
      </button>

      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p className="message">{message}</p>}
      <p className="back-to-login" onClick={() => navigate("/login")}>
        Back to Login
      </p>
    </div>
  );
};

export default ForgotPassword;
