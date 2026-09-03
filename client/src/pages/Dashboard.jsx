import { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

function Dashboard({
  setCurrentPage,
  setSelectedSubject,
}) {
  const { user, logout } = useAuth();

  const [showProfileMenu, setShowProfileMenu] =
    useState(false);

  const profileMenuRef = useRef(null);

  const popularTopics = [
    "Python",
    "Data Structures",
    "DBMS",
    "Machine Learning",
    "JavaScript",
    "React",
  ];

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(
          event.target
        )
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const handleTopicClick = (topic) => {
    setSelectedSubject(topic);
    setCurrentPage("resources");
  };

  const handleLogout = () => {
    setShowProfileMenu(false);
    logout();
    setCurrentPage("login");
  };

  const handleProfileClick = () => {
    setShowProfileMenu(false);
    setCurrentPage("profile");
  };

  const handleSettingsClick = () => {
    setShowProfileMenu(false);
    setCurrentPage("settings");
  };

  return (
    <div className="dashboard-layout">
      <Sidebar
        setCurrentPage={setCurrentPage}
       
      />

      <main className="dashboard-main">
        <header className="topbar">
          <div className="topbar-content">
            <h1>
              Hello,{" "}
              <span className="user-name">
                {user?.name || "Student"}
              </span>{" "}
              👋
            </h1>

            <p>Ready to continue learning?</p>
          </div>

          <div
            className="profile-menu-container"
            ref={profileMenuRef}
          >
            <button
              type="button"
              className="profile-circle"
              onClick={() =>
                setShowProfileMenu(
                  !showProfileMenu
                )
              }
              aria-label="Open profile menu"
            >
              {user?.name
                ? user.name
                    .charAt(0)
                    .toUpperCase()
                : "S"}
            </button>

            {showProfileMenu && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-header">
                  <div className="profile-dropdown-avatar">
                    {user?.name
                      ? user.name
                          .charAt(0)
                          .toUpperCase()
                      : "S"}
                  </div>

                  <div>
                    <strong>
                      {user?.name ||
                        "Student"}
                    </strong>

                    <span>
                      {user?.email ||
                        "No email available"}
                    </span>
                  </div>
                </div>

                <div className="profile-dropdown-divider"></div>

                <button
                  type="button"
                  className="profile-dropdown-item"
                  onClick={
                    handleProfileClick
                  }
                >
                  <span>👤</span>
                  Profile
                </button>

                <button
                  type="button"
                  className="profile-dropdown-item"
                  onClick={
                    handleSettingsClick
                  }
                >
                  <span>⚙️</span>
                  Settings
                </button>

                <div className="profile-dropdown-divider"></div>

                <button
                  type="button"
                  className="profile-dropdown-item logout-dropdown-item"
                  onClick={handleLogout}
                >
                  <span>🚪</span>
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <section className="welcome-card">
          <div>
            <p className="small-label">
              WELCOME TO STUDYSPACE
            </p>

            <h2>
              Learn together.
              <br />
              Grow together.
            </h2>

            <p>
              Discover resources, ask questions and
              connect with other students.
            </p>

            <button
              onClick={() => {
                setSelectedSubject("All");
                setCurrentPage("resources");
              }}
            >
              Explore Resources
            </button>
          </div>

          <div className="welcome-icon">
            📖
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <h2>Quick Access</h2>

            <span
              onClick={() => {
                setSelectedSubject("All");
                setCurrentPage("resources");
              }}
              style={{ cursor: "pointer" }}
            >
              View all →
            </span>
          </div>

          <div className="quick-grid">
            <div
              className="feature-card"
              onClick={() => {
                setSelectedSubject("All");
                setCurrentPage("resources");
              }}
            >
              <div className="feature-icon">
                📚
              </div>

              <h3>Resources</h3>

              <p>
                Find notes, tutorials and study materials.
              </p>
            </div>

            <div
              className="feature-card"
              onClick={() =>
                setCurrentPage("questions")
              }
            >
              <div className="feature-icon">
                ❓
              </div>

              <h3>Questions</h3>

              <p>
                Ask questions and learn from other
                students.
              </p>
            </div>

            <div
              className="feature-card"
              onClick={() =>
                setCurrentPage("groups")
              }
            >
              <div className="feature-icon">
                👥
              </div>

              <h3>Study Groups</h3>

              <p>
                Study and collaborate with your peers.
              </p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <h2>Popular Topics</h2>
          </div>

          <div className="topics">
            {popularTopics.map((topic) => (
              <button
                key={topic}
                onClick={() =>
                  handleTopicClick(topic)
                }
              >
                {topic}
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;