import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import BackButton from "../components/BackButton";

function Settings({ setCurrentPage }) {
  const { user, logout } = useAuth();

  const [notifications, setNotifications] =
    useState(true);

  const [emailNotifications, setEmailNotifications] =
    useState(true);

  const [showPassword, setShowPassword] =
    useState(false);

  const [passwordData, setPasswordData] =
    useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  const [passwordMessage, setPasswordMessage] =
    useState("");

  // =========================
  // Handle Password Input
  // =========================

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });

    setPasswordMessage("");
  };

  // =========================
  // Change Password
  // =========================

  const handleChangePassword = (e) => {
    e.preventDefault();

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      setPasswordMessage(
        "New passwords do not match."
      );

      return;
    }

    if (
      passwordData.newPassword.length < 8
    ) {
      setPasswordMessage(
        "New password must contain at least 8 characters."
      );

      return;
    }

    setPasswordMessage(
      "Password change will be connected to the backend in the security enhancement phase."
    );

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  // =========================
  // Logout
  // =========================

  const handleLogout = () => {
    logout();
    setCurrentPage("login");
  };

  return (
    <div className="settings-page">

      <BackButton
        setCurrentPage={setCurrentPage}
      />

      {/* =========================
          Header
      ========================= */}

      <div className="settings-header">

        <div>
          <p className="page-label">
            APPLICATION SETTINGS
          </p>

          <h1>
            Settings
          </h1>

          <p>
            Manage your account and StudySpace
            preferences.
          </p>
        </div>

      </div>

      {/* =========================
          Account
      ========================= */}

      <section className="settings-section">

        <div className="settings-section-header">

          <div className="settings-section-icon">
            👤
          </div>

          <div>
            <h2>
              Account
            </h2>

            <p>
              Your StudySpace account information.
            </p>
          </div>

        </div>

        <div className="settings-card">

          <div className="settings-profile">

            <div className="settings-avatar">
              {user?.name
                ? user.name
                    .charAt(0)
                    .toUpperCase()
                : "S"}
            </div>

            <div>
              <h3>
                {user?.name ||
                  "Student"}
              </h3>

              <p>
                {user?.email ||
                  "No email available"}
              </p>
            </div>

          </div>

          <div className="settings-info-grid">

            <div className="settings-info-item">

              <span>
                Full Name
              </span>

              <strong>
                {user?.name ||
                  "Student"}
              </strong>

            </div>

            <div className="settings-info-item">

              <span>
                Email Address
              </span>

              <strong>
                {user?.email ||
                  "Not available"}
              </strong>

            </div>

          </div>

        </div>

      </section>

      {/* =========================
          Notifications
      ========================= */}

      <section className="settings-section">

        <div className="settings-section-header">

          <div className="settings-section-icon">
            🔔
          </div>

          <div>
            <h2>
              Notifications
            </h2>

            <p>
              Control how StudySpace keeps you
              informed.
            </p>
          </div>

        </div>

        <div className="settings-card">

          <div className="settings-option">

            <div>

              <h3>
                Notifications
              </h3>

              <p>
                Receive notifications about
                StudySpace activity.
              </p>

            </div>

            <button
              type="button"
              className={
                notifications
                  ? "settings-toggle active"
                  : "settings-toggle"
              }
              onClick={() =>
                setNotifications(
                  !notifications
                )
              }
              aria-label="Toggle notifications"
            >
              <span></span>
            </button>

          </div>

          <div className="settings-divider"></div>

          <div className="settings-option">

            <div>

              <h3>
                Email Notifications
              </h3>

              <p>
                Receive important updates through
                your email.
              </p>

            </div>

            <button
              type="button"
              className={
                emailNotifications
                  ? "settings-toggle active"
                  : "settings-toggle"
              }
              onClick={() =>
                setEmailNotifications(
                  !emailNotifications
                )
              }
              aria-label="Toggle email notifications"
            >
              <span></span>
            </button>

          </div>

        </div>

      </section>

      {/* =========================
          Security
      ========================= */}

      <section className="settings-section">

        <div className="settings-section-header">

          <div className="settings-section-icon">
            🔐
          </div>

          <div>
            <h2>
              Security
            </h2>

            <p>
              Manage your account security.
            </p>
          </div>

        </div>

        <div className="settings-card">

          <form
            onSubmit={handleChangePassword}
          >

            <div className="settings-option-title">
              Change Password
            </div>

            <div className="settings-password-grid">

              <div className="settings-field">

                <label>
                  Current Password
                </label>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="currentPassword"
                  value={
                    passwordData.currentPassword
                  }
                  onChange={
                    handlePasswordChange
                  }
                  placeholder="Enter current password"
                />

              </div>

              <div className="settings-field">

                <label>
                  New Password
                </label>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="newPassword"
                  value={
                    passwordData.newPassword
                  }
                  onChange={
                    handlePasswordChange
                  }
                  placeholder="Enter new password"
                />

              </div>

              <div className="settings-field">

                <label>
                  Confirm New Password
                </label>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={
                    passwordData.confirmPassword
                  }
                  onChange={
                    handlePasswordChange
                  }
                  placeholder="Confirm new password"
                />

              </div>

            </div>

            <label className="show-password-option">

              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) =>
                  setShowPassword(
                    e.target.checked
                  )
                }
              />

              Show passwords

            </label>

            {passwordMessage && (
              <div className="settings-message">
                {passwordMessage}
              </div>
            )}

            <button
              type="submit"
              className="settings-save-btn"
            >
              Update Password
            </button>

          </form>

        </div>

      </section>

      {/* =========================
          Account Actions
      ========================= */}

      <section className="settings-section">

        <div className="settings-section-header">

          <div className="settings-section-icon">
            🚪
          </div>

          <div>
            <h2>
              Account Actions
            </h2>

            <p>
              Manage your current session.
            </p>
          </div>

        </div>

        <div className="settings-card">

          <div className="settings-option">

            <div>

              <h3>
                Logout
              </h3>

              <p>
                Sign out of your StudySpace account
                on this device.
              </p>

            </div>

            <button
              type="button"
              className="settings-logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Settings;