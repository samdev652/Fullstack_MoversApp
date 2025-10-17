import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Brand Name */}
        <Link to="/" className="navbar-brand">
          MoveEase
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <div className={`hamburger ${mobileMenuOpen ? "open" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        {/* Navigation Links */}
        <div className={`navbar-links ${mobileMenuOpen ? "open" : ""}`}>
          {!currentUser ? (
            <>
              <Link to="/login" className={`navbar-link ${isActive("/login")}`}>
                Sign In
              </Link>
              <Link to="/register" className="navbar-cta">
                Get Started
              </Link>
            </>
          ) : (
            <>
              {/* Role-specific links */}
              {currentUser.role === "user" && (
                <>
                  <Link
                    to="/user/dashboard"
                    className={`navbar-link ${isActive("/user/dashboard")}`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/user/book-driver"
                    className={`navbar-link ${isActive("/user/book-driver")}`}
                  >
                    Book Move
                  </Link>
                  <Link
                    to="/user/orders"
                    className={`navbar-link ${isActive("/user/orders")}`}
                  >
                    Orders
                  </Link>
                  <Link
                    to="/user/wallet"
                    className={`navbar-link ${isActive("/user/wallet")}`}
                  >
                    Wallet
                  </Link>
                </>
              )}

              {currentUser.role === "driver" && (
                <>
                  <Link
                    to="/driver/dashboard"
                    className={`navbar-link ${isActive("/driver/dashboard")}`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/driver/available-orders"
                    className={`navbar-link ${isActive(
                      "/driver/available-orders"
                    )}`}
                  >
                    Available
                  </Link>
                  <Link
                    to="/driver/orders"
                    className={`navbar-link ${isActive("/driver/orders")}`}
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/driver/wallet"
                    className={`navbar-link ${isActive("/driver/wallet")}`}
                  >
                    Earnings
                  </Link>
                </>
              )}

              {currentUser.role === "admin" && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className={`navbar-link ${isActive("/admin/dashboard")}`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/manage-users"
                    className={`navbar-link ${isActive("/admin/manage-users")}`}
                  >
                    Users
                  </Link>
                  <Link
                    to="/admin/manage-drivers"
                    className={`navbar-link ${isActive(
                      "/admin/manage-drivers"
                    )}`}
                  >
                    Drivers
                  </Link>
                  <Link
                    to="/admin/support-tickets"
                    className={`navbar-link ${isActive(
                      "/admin/support-tickets"
                    )}`}
                  >
                    Support
                  </Link>
                </>
              )}

              {/* Account Dropdown */}
              <div className="account-dropdown" ref={dropdownRef}>
                <button
                  className={`account-dropdown-btn ${
                    dropdownOpen ? "open" : ""
                  }`}
                  onClick={toggleDropdown}
                  aria-expanded={dropdownOpen}
                  aria-label="Account menu"
                >
                  <span>👤</span>
                  {currentUser.username || currentUser.email}
                </button>

                <div
                  className={`account-dropdown-menu ${
                    dropdownOpen ? "show" : ""
                  }`}
                >
                  <Link
                    to={
                      currentUser.role === "user"
                        ? "/user/dashboard"
                        : currentUser.role === "driver"
                        ? "/driver/dashboard"
                        : "/admin/dashboard"
                    }
                    className="dropdown-item"
                  >
                    <span className="dropdown-item-icon">📊</span>
                    My Dashboard
                  </Link>

                  {currentUser.role !== "admin" && (
                    <>
                      <Link
                        to={`/${currentUser.role}/notifications`}
                        className="dropdown-item"
                      >
                        <span className="dropdown-item-icon">🔔</span>
                        Notifications
                      </Link>
                      <Link
                        to={`/${currentUser.role}/wallet`}
                        className="dropdown-item"
                      >
                        <span className="dropdown-item-icon">💳</span>
                        Wallet
                      </Link>
                    </>
                  )}

                  <Link to="/settings" className="dropdown-item">
                    <span className="dropdown-item-icon">⚙️</span>
                    Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="dropdown-item logout"
                  >
                    <span className="dropdown-item-icon">🚪</span>
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
