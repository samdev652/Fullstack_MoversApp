import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthContext from "../../context/AuthContext";
import "./Register.css"; // Import custom CSS for styling

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    role: "user",
    vehicle_type: "",
    license_plate: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await register(formData);

    setIsLoading(false);

    if (result.success) {
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <div className="register-icon">🚚</div>
          <h2 className="register-title">Create Your Account</h2>
          <p className="register-description">
            Join thousands of users and drivers. Move with ease, live with
            peace.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {/* Full Name Input */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          {/* Phone Number Input */}
          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Phone Number
            </label>
            <input
              id="phone"
              type="text"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          {/* Email Input */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          {/* Role Selection */}
          <div className="form-group">
            <label htmlFor="role" className="form-label">
              Account Type
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="user">Customer</option>
              <option value="driver">Driver</option>
            </select>
          </div>

          {/* Driver-Specific Fields */}
          {formData.role === "driver" && (
            <>
              <div className="form-group">
                <label htmlFor="vehicle_type" className="form-label">
                  Vehicle Type
                </label>
                <select
                  id="vehicle_type"
                  name="vehicle_type"
                  value={formData.vehicle_type}
                  onChange={handleChange}
                  className="form-select"
                  required={formData.role === "driver"}
                >
                  <option value="">Select Vehicle Type</option>
                  <option value="Truck">Truck</option>
                  <option value="Van">Van</option>
                  <option value="SUV">SUV</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="license_plate" className="form-label">
                  License Plate Number
                </label>
                <input
                  id="license_plate"
                  type="text"
                  name="license_plate"
                  placeholder="Enter license plate number"
                  value={formData.license_plate}
                  onChange={handleChange}
                  className="form-input"
                  required={formData.role === "driver"}
                />
              </div>
            </>
          )}

          {/* Submit Button */}
          <button type="submit" className="form-button" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Login Link */}
        <div className="register-link">
          Already have an account?
          <Link to="/login" className="register-link-text">
            Sign In
          </Link>
        </div>

        {/* Terms and Privacy */}
        <div className="register-terms">
          By creating an account, you agree to our{" "}
          <a href="/terms">Terms of Service</a> and{" "}
          <a href="/privacy">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
