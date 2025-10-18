import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "./UserSettings.css";

const UserSettings = () => {
  const { currentUser } = useAuth();

  // Active tab state
  const [activeTab, setActiveTab] = useState("profile");

  // Profile Settings
  const [profileData, setProfileData] = useState({
    fullName: currentUser?.name || "John Doe",
    email: currentUser?.email || "john.doe@example.com",
    phone: "+254 712 345 678",
    address: "123 Nairobi Street, Kenya",
    bio: "Frequent mover and logistics enthusiast",
    avatar: null,
  });

  // Account Settings
  const [accountSettings, setAccountSettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorAuth: false,
    loginAlerts: true,
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    bookingUpdates: true,
    promotionalEmails: false,
    weeklyDigest: true,
    priceAlerts: true,
    driverArrival: true,
  });

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    locationSharing: true,
    dataCollection: true,
    personalizedAds: false,
  });

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    defaultPayment: "mpesa",
    autoRecharge: false,
    rechargeAmount: 1000,
    saveCards: true,
    receiptEmail: true,
  });

  // App Settings
  const [appSettings, setAppSettings] = useState({
    language: "english",
    currency: "KES",
    theme: "dark",
    autoUpdate: true,
    analytics: true,
    crashReports: true,
  });

  // Handle Profile Update
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    toast.success("✅ Profile updated successfully!");
  };

  // Handle Password Change
  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (accountSettings.newPassword !== accountSettings.confirmPassword) {
      toast.error("❌ Passwords do not match!");
      return;
    }
    if (accountSettings.newPassword.length < 8) {
      toast.error("❌ Password must be at least 8 characters!");
      return;
    }
    toast.success("✅ Password changed successfully!");
    setAccountSettings({
      ...accountSettings,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  // Handle Notification Settings Save
  const handleNotificationSave = () => {
    toast.success("✅ Notification preferences saved!");
  };

  // Handle Privacy Settings Save
  const handlePrivacySave = () => {
    toast.success("✅ Privacy settings updated!");
  };

  // Handle Payment Settings Save
  const handlePaymentSave = () => {
    toast.success("✅ Payment preferences saved!");
  };

  // Handle App Settings Save
  const handleAppSettingsSave = () => {
    toast.success("✅ App settings updated!");
  };

  // Handle Account Deletion
  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "⚠️ Are you sure you want to delete your account? This action cannot be undone!"
      )
    ) {
      toast.error(
        "Account deletion initiated. You will receive a confirmation email."
      );
    }
  };

  // Handle Avatar Upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, avatar: reader.result });
        toast.success("✅ Avatar uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: "profile", name: "Profile", icon: "👤" },
    { id: "account", name: "Account", icon: "🔐" },
    { id: "notifications", name: "Notifications", icon: "🔔" },
    { id: "privacy", name: "Privacy", icon: "🔒" },
    { id: "payment", name: "Payment", icon: "💳" },
    { id: "app", name: "App Settings", icon: "⚙️" },
  ];

  return (
    <div className="settings-container">
      {/* Hero Header */}
      <div className="settings-hero">
        <div className="settings-hero-content">
          <h1 className="settings-hero-title">⚙️ Settings</h1>
          <p className="settings-hero-subtitle">
            Manage your account, preferences, and application settings
          </p>
        </div>
        <div className="settings-hero-decoration"></div>
      </div>

      {/* Settings Layout */}
      <div className="settings-layout">
        {/* Sidebar Navigation */}
        <div className="settings-sidebar">
          <div className="settings-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`settings-tab ${
                  activeTab === tab.id ? "active" : ""
                }`}
              >
                <span className="settings-tab-icon">{tab.icon}</span>
                <span className="settings-tab-name">{tab.name}</span>
                {activeTab === tab.id && (
                  <span className="settings-tab-indicator"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="settings-content">
          {/* Profile Settings Tab */}
          {activeTab === "profile" && (
            <div className="settings-section" data-section="profile">
              <div className="settings-section-header">
                <h2 className="settings-section-title">
                  👤 Profile Information
                </h2>
                <p className="settings-section-description">
                  Update your personal information and profile picture
                </p>
              </div>

              <form onSubmit={handleProfileUpdate} className="settings-form">
                {/* Avatar Upload */}
                <div className="avatar-upload-section">
                  <div className="avatar-preview">
                    {profileData.avatar ? (
                      <img
                        src={profileData.avatar}
                        alt="Avatar"
                        className="avatar-image"
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        <span className="avatar-placeholder-icon">👤</span>
                      </div>
                    )}
                  </div>
                  <div className="avatar-upload-controls">
                    <label
                      htmlFor="avatar-upload"
                      className="btn-avatar-upload"
                    >
                      📸 Upload Photo
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      style={{ display: "none" }}
                    />
                    <p className="avatar-upload-hint">
                      JPG, PNG or GIF (Max 5MB)
                    </p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      <span className="form-label-icon">📝</span>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          fullName: e.target.value,
                        })
                      }
                      className="form-input"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <span className="form-label-icon">📧</span>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                      className="form-input"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <span className="form-label-icon">📱</span>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          phone: e.target.value,
                        })
                      }
                      className="form-input"
                      placeholder="+254 712 345 678"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <span className="form-label-icon">📍</span>
                      Address
                    </label>
                    <input
                      type="text"
                      value={profileData.address}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          address: e.target.value,
                        })
                      }
                      className="form-input"
                      placeholder="Enter your address"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="form-label-icon">💬</span>
                    Bio
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) =>
                      setProfileData({ ...profileData, bio: e.target.value })
                    }
                    className="form-textarea"
                    rows="4"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <button type="submit" className="btn-save">
                  ✅ Save Changes
                </button>
              </form>
            </div>
          )}

          {/* Account Settings Tab */}
          {activeTab === "account" && (
            <div className="settings-section" data-section="account">
              <div className="settings-section-header">
                <h2 className="settings-section-title">🔐 Account Security</h2>
                <p className="settings-section-description">
                  Manage your password and security preferences
                </p>
              </div>

              {/* Password Change Form */}
              <form onSubmit={handlePasswordChange} className="settings-form">
                <h3 className="form-subtitle">🔑 Change Password</h3>

                <div className="form-group">
                  <label className="form-label">
                    <span className="form-label-icon">🔒</span>
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={accountSettings.currentPassword}
                    onChange={(e) =>
                      setAccountSettings({
                        ...accountSettings,
                        currentPassword: e.target.value,
                      })
                    }
                    className="form-input"
                    placeholder="Enter current password"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="form-label-icon">🔐</span>
                    New Password
                  </label>
                  <input
                    type="password"
                    value={accountSettings.newPassword}
                    onChange={(e) =>
                      setAccountSettings({
                        ...accountSettings,
                        newPassword: e.target.value,
                      })
                    }
                    className="form-input"
                    placeholder="Enter new password (min 8 characters)"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="form-label-icon">✅</span>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={accountSettings.confirmPassword}
                    onChange={(e) =>
                      setAccountSettings({
                        ...accountSettings,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="form-input"
                    placeholder="Confirm new password"
                  />
                </div>

                <button type="submit" className="btn-save">
                  🔄 Update Password
                </button>
              </form>

              {/* Security Options */}
              <div className="settings-form" style={{ marginTop: "30px" }}>
                <h3 className="form-subtitle">🛡️ Security Options</h3>

                <div className="toggle-group">
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-icon">🔐</span>
                      <div>
                        <h4 className="toggle-title">
                          Two-Factor Authentication
                        </h4>
                        <p className="toggle-description">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={accountSettings.twoFactorAuth}
                        onChange={(e) =>
                          setAccountSettings({
                            ...accountSettings,
                            twoFactorAuth: e.target.checked,
                          })
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-icon">🔔</span>
                      <div>
                        <h4 className="toggle-title">Login Alerts</h4>
                        <p className="toggle-description">
                          Get notified when someone logs into your account
                        </p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={accountSettings.loginAlerts}
                        onChange={(e) =>
                          setAccountSettings({
                            ...accountSettings,
                            loginAlerts: e.target.checked,
                          })
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="danger-zone">
                <h3 className="danger-zone-title">⚠️ Danger Zone</h3>
                <p className="danger-zone-description">
                  Once you delete your account, there is no going back. Please
                  be certain.
                </p>
                <button onClick={handleDeleteAccount} className="btn-danger">
                  🗑️ Delete Account
                </button>
              </div>
            </div>
          )}

          {/* Notification Settings Tab */}
          {activeTab === "notifications" && (
            <div className="settings-section" data-section="notifications">
              <div className="settings-section-header">
                <h2 className="settings-section-title">
                  🔔 Notification Preferences
                </h2>
                <p className="settings-section-description">
                  Choose how you want to receive notifications
                </p>
              </div>

              <div className="settings-form">
                <h3 className="form-subtitle">📬 Notification Channels</h3>

                <div className="toggle-group">
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-icon">📧</span>
                      <div>
                        <h4 className="toggle-title">Email Notifications</h4>
                        <p className="toggle-description">
                          Receive notifications via email
                        </p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notificationSettings.emailNotifications}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            emailNotifications: e.target.checked,
                          })
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-icon">💬</span>
                      <div>
                        <h4 className="toggle-title">SMS Notifications</h4>
                        <p className="toggle-description">
                          Receive notifications via SMS
                        </p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notificationSettings.smsNotifications}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            smsNotifications: e.target.checked,
                          })
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-icon">📱</span>
                      <div>
                        <h4 className="toggle-title">Push Notifications</h4>
                        <p className="toggle-description">
                          Receive push notifications on your device
                        </p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notificationSettings.pushNotifications}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            pushNotifications: e.target.checked,
                          })
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <h3 className="form-subtitle" style={{ marginTop: "30px" }}>
                  🎯 Notification Types
                </h3>

                <div className="toggle-group">
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-icon">📦</span>
                      <div>
                        <h4 className="toggle-title">Booking Updates</h4>
                        <p className="toggle-description">
                          Get notified about your booking status
                        </p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notificationSettings.bookingUpdates}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            bookingUpdates: e.target.checked,
                          })
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-icon">🎁</span>
                      <div>
                        <h4 className="toggle-title">Promotional Emails</h4>
                        <p className="toggle-description">
                          Receive special offers and promotions
                        </p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notificationSettings.promotionalEmails}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            promotionalEmails: e.target.checked,
                          })
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-icon">📊</span>
                      <div>
                        <h4 className="toggle-title">Weekly Digest</h4>
                        <p className="toggle-description">
                          Get a weekly summary of your activity
                        </p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notificationSettings.weeklyDigest}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            weeklyDigest: e.target.checked,
                          })
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-icon">💰</span>
                      <div>
                        <h4 className="toggle-title">Price Alerts</h4>
                        <p className="toggle-description">
                          Get notified about price changes and deals
                        </p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notificationSettings.priceAlerts}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            priceAlerts: e.target.checked,
                          })
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-icon">🚗</span>
                      <div>
                        <h4 className="toggle-title">Driver Arrival Alerts</h4>
                        <p className="toggle-description">
                          Get notified when driver is near your location
                        </p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notificationSettings.driverArrival}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            driverArrival: e.target.checked,
                          })
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <button onClick={handleNotificationSave} className="btn-save">
                  ✅ Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* Privacy Settings Tab */}
          {activeTab === "privacy" && (
            <div className="settings-section" data-section="privacy">
              <div className="settings-section-header">
                <h2 className="settings-section-title">🔒 Privacy & Data</h2>
                <p className="settings-section-description">
                  Control your privacy and data sharing preferences
                </p>
              </div>

              <div className="settings-form">
                <h3 className="form-subtitle">👁️ Profile Visibility</h3>

                <div className="radio-group">
                  <label className="radio-item">
                    <input
                      type="radio"
                      name="profileVisibility"
                      value="public"
                      checked={privacySettings.profileVisibility === "public"}
                      onChange={(e) =>
                        setPrivacySettings({
                          ...privacySettings,
                          profileVisibility: e.target.value,
                        })
                      }
                    />
                    <div className="radio-content">
                      <span className="radio-icon">🌍</span>
                      <div>
                        <h4 className="radio-title">Public</h4>
                        <p className="radio-description">
                          Anyone can see your profile
                        </p>
                      </div>
                    </div>
                  </label>

                  <label className="radio-item">
                    <input
                      type="radio"
                      name="profileVisibility"
                      value="private"
                      checked={privacySettings.profileVisibility === "private"}
                      onChange={(e) =>
                        setPrivacySettings({
                          ...privacySettings,
                          profileVisibility: e.target.value,
                        })
                      }
                    />
                    <div className="radio-content">
                      <span className="radio-icon">🔒</span>
                      <div>
                        <h4 className="radio-title">Private</h4>
                        <p className="radio-description">
                          Only you can see your profile
                        </p>
                      </div>
                    </div>
                  </label>
                </div>

                <h3 className="form-subtitle" style={{ marginTop: "30px" }}>
                  📋 Information Sharing
                </h3>

                <div className="toggle-group">
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-icon">📧</span>
                      <div>
                        <h4 className="toggle-title">Show Email Address</h4>
                        <p className="toggle-description">
                          Allow others to see your email address
                        </p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={privacySettings.showEmail}
                        onChange={(e) =>
                          setPrivacySettings({
                            ...privacySettings,
                            showEmail: e.target.checked,
                          })
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-icon">📱</span>
                      <div>
                        <h4 className="toggle-title">Show Phone Number</h4>
                        <p className="toggle-description">
                          Allow others to see your phone number
                        </p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={privacySettings.showPhone}
                        onChange={(e) =>
                          setPrivacySettings({
                            ...privacySettings,
                            showPhone: e.target.checked,
                          })
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-icon">📍</span>
                      <div>
                        <h4 className="toggle-title">Location Sharing</h4>
                        <p className="toggle-description">
                          Share your location with drivers during trips
                        </p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={privacySettings.locationSharing}
                        onChange={(e) =>
                          setPrivacySettings({
                            ...privacySettings,
                            locationSharing: e.target.checked,
                          })
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-icon">📊</span>
                      <div>
                        <h4 className="toggle-title">Data Collection</h4>
                        <p className="toggle-description">
                          Allow us to collect usage data to improve services
                        </p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={privacySettings.dataCollection}
                        onChange={(e) =>
                          setPrivacySettings({
                            ...privacySettings,
                            dataCollection: e.target.checked,
                          })
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-icon">🎯</span>
                      <div>
                        <h4 className="toggle-title">Personalized Ads</h4>
                        <p className="toggle-description">
                          Show ads based on your preferences
                        </p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={privacySettings.personalizedAds}
                        onChange={(e) =>
                          setPrivacySettings({
                            ...privacySettings,
                            personalizedAds: e.target.checked,
                          })
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <button onClick={handlePrivacySave} className="btn-save">
                  ✅ Save Privacy Settings
                </button>
              </div>
            </div>
          )}

          {/* Payment Settings Tab */}
          {activeTab === "payment" && (
            <div className="settings-section" data-section="payment">
              <div className="settings-section-header">
                <h2 className="settings-section-title">💳 Payment Methods</h2>
                <p className="settings-section-description">
                  Manage your payment preferences and methods
                </p>
              </div>

              <div className="settings-form">
                <h3 className="form-subtitle">💰 Default Payment Method</h3>

                <div className="radio-group">
                  <label className="radio-item">
                    <input
                      type="radio"
                      name="defaultPayment"
                      value="mpesa"
                      checked={paymentSettings.defaultPayment === "mpesa"}
                      onChange={(e) =>
                        setPaymentSettings({
                          ...paymentSettings,
                          defaultPayment: e.target.value,
                        })
                      }
                    />
                    <div className="radio-content">
                      <span className="radio-icon">📱</span>
                      <div>
                        <h4 className="radio-title">M-Pesa</h4>
                        <p className="radio-description">
                          Pay using M-Pesa mobile money
                        </p>
                      </div>
                    </div>
                  </label>

                  <label className="radio-item">
                    <input
                      type="radio"
                      name="defaultPayment"
                      value="card"
                      checked={paymentSettings.defaultPayment === "card"}
                      onChange={(e) =>
                        setPaymentSettings({
                          ...paymentSettings,
                          defaultPayment: e.target.value,
                        })
                      }
                    />
                    <div className="radio-content">
                      <span className="radio-icon">💳</span>
                      <div>
                        <h4 className="radio-title">Credit/Debit Card</h4>
                        <p className="radio-description">
                          Pay using saved cards
                        </p>
                      </div>
                    </div>
                  </label>

                  <label className="radio-item">
                    <input
                      type="radio"
                      name="defaultPayment"
                      value="wallet"
                      checked={paymentSettings.defaultPayment === "wallet"}
                      onChange={(e) =>
                        setPaymentSettings({
                          ...paymentSettings,
                          defaultPayment: e.target.value,
                        })
                      }
                    />
                    <div className="radio-content">
                      <span className="radio-icon">👛</span>
                      <div>
                        <h4 className="radio-title">Wallet Balance</h4>
                        <p className="radio-description">
                          Use your wallet balance
                        </p>
                      </div>
                    </div>
                  </label>
                </div>

                <h3 className="form-subtitle" style={{ marginTop: "30px" }}>
                  ⚡ Auto Recharge
                </h3>

                <div className="toggle-group">
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-icon">🔄</span>
                      <div>
                        <h4 className="toggle-title">Enable Auto Recharge</h4>
                        <p className="toggle-description">
                          Automatically recharge when balance is low
                        </p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={paymentSettings.autoRecharge}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            autoRecharge: e.target.checked,
                          })
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                {paymentSettings.autoRecharge && (
                  <div className="form-group" style={{ marginTop: "20px" }}>
                    <label className="form-label">
                      <span className="form-label-icon">💵</span>
                      Recharge Amount (KES)
                    </label>
                    <input
                      type="number"
                      value={paymentSettings.rechargeAmount}
                      onChange={(e) =>
                        setPaymentSettings({
                          ...paymentSettings,
                          rechargeAmount: e.target.value,
                        })
                      }
                      className="form-input"
                      min="100"
                      step="100"
                    />
                  </div>
                )}

                <h3 className="form-subtitle" style={{ marginTop: "30px" }}>
                  🛡️ Payment Security
                </h3>

                <div className="toggle-group">
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-icon">💾</span>
                      <div>
                        <h4 className="toggle-title">Save Card Information</h4>
                        <p className="toggle-description">
                          Securely save cards for faster checkout
                        </p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={paymentSettings.saveCards}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            saveCards: e.target.checked,
                          })
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-icon">🧾</span>
                      <div>
                        <h4 className="toggle-title">Email Receipts</h4>
                        <p className="toggle-description">
                          Receive payment receipts via email
                        </p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={paymentSettings.receiptEmail}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            receiptEmail: e.target.checked,
                          })
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <button onClick={handlePaymentSave} className="btn-save">
                  ✅ Save Payment Settings
                </button>
              </div>
            </div>
          )}

          {/* App Settings Tab */}
          {activeTab === "app" && (
            <div className="settings-section" data-section="app">
              <div className="settings-section-header">
                <h2 className="settings-section-title">⚙️ App Preferences</h2>
                <p className="settings-section-description">
                  Customize your app experience
                </p>
              </div>

              <div className="settings-form">
                <h3 className="form-subtitle">🌍 Language & Region</h3>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      <span className="form-label-icon">🗣️</span>
                      Language
                    </label>
                    <select
                      value={appSettings.language}
                      onChange={(e) =>
                        setAppSettings({
                          ...appSettings,
                          language: e.target.value,
                        })
                      }
                      className="form-select"
                    >
                      <option value="english">English</option>
                      <option value="swahili">Swahili</option>
                      <option value="french">French</option>
                      <option value="spanish">Spanish</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <span className="form-label-icon">💵</span>
                      Currency
                    </label>
                    <select
                      value={appSettings.currency}
                      onChange={(e) =>
                        setAppSettings({
                          ...appSettings,
                          currency: e.target.value,
                        })
                      }
                      className="form-select"
                    >
                      <option value="KES">KES (Kenyan Shilling)</option>
                      <option value="USD">USD (US Dollar)</option>
                      <option value="EUR">EUR (Euro)</option>
                      <option value="GBP">GBP (British Pound)</option>
                    </select>
                  </div>
                </div>

                <h3 className="form-subtitle" style={{ marginTop: "30px" }}>
                  🎨 Appearance
                </h3>

                <div className="radio-group">
                  <label className="radio-item">
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      checked={appSettings.theme === "dark"}
                      onChange={(e) =>
                        setAppSettings({
                          ...appSettings,
                          theme: e.target.value,
                        })
                      }
                    />
                    <div className="radio-content">
                      <span className="radio-icon">🌙</span>
                      <div>
                        <h4 className="radio-title">Dark Mode</h4>
                        <p className="radio-description">
                          Easy on the eyes in low light
                        </p>
                      </div>
                    </div>
                  </label>

                  <label className="radio-item">
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      checked={appSettings.theme === "light"}
                      onChange={(e) =>
                        setAppSettings({
                          ...appSettings,
                          theme: e.target.value,
                        })
                      }
                    />
                    <div className="radio-content">
                      <span className="radio-icon">☀️</span>
                      <div>
                        <h4 className="radio-title">Light Mode</h4>
                        <p className="radio-description">
                          Bright and clean interface
                        </p>
                      </div>
                    </div>
                  </label>

                  <label className="radio-item">
                    <input
                      type="radio"
                      name="theme"
                      value="auto"
                      checked={appSettings.theme === "auto"}
                      onChange={(e) =>
                        setAppSettings({
                          ...appSettings,
                          theme: e.target.value,
                        })
                      }
                    />
                    <div className="radio-content">
                      <span className="radio-icon">🔄</span>
                      <div>
                        <h4 className="radio-title">Auto</h4>
                        <p className="radio-description">
                          Match system preferences
                        </p>
                      </div>
                    </div>
                  </label>
                </div>

                <h3 className="form-subtitle" style={{ marginTop: "30px" }}>
                  🔧 Advanced
                </h3>

                <div className="toggle-group">
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-icon">🔄</span>
                      <div>
                        <h4 className="toggle-title">Auto Update</h4>
                        <p className="toggle-description">
                          Automatically download app updates
                        </p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={appSettings.autoUpdate}
                        onChange={(e) =>
                          setAppSettings({
                            ...appSettings,
                            autoUpdate: e.target.checked,
                          })
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-icon">📊</span>
                      <div>
                        <h4 className="toggle-title">Usage Analytics</h4>
                        <p className="toggle-description">
                          Help us improve by sharing usage data
                        </p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={appSettings.analytics}
                        onChange={(e) =>
                          setAppSettings({
                            ...appSettings,
                            analytics: e.target.checked,
                          })
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-icon">🐛</span>
                      <div>
                        <h4 className="toggle-title">Crash Reports</h4>
                        <p className="toggle-description">
                          Automatically send crash reports
                        </p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={appSettings.crashReports}
                        onChange={(e) =>
                          setAppSettings({
                            ...appSettings,
                            crashReports: e.target.checked,
                          })
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <button onClick={handleAppSettingsSave} className="btn-save">
                  ✅ Save App Settings
                </button>

                {/* App Info */}
                <div className="app-info">
                  <h3 className="form-subtitle">ℹ️ App Information</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Version</span>
                      <span className="info-value">2.0.1</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Build</span>
                      <span className="info-value">20251018</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Last Updated</span>
                      <span className="info-value">Oct 18, 2025</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Developer</span>
                      <span className="info-value">MoveEase Team</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
