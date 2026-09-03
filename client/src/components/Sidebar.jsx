function Sidebar({
  setCurrentPage,
}) {
  const goToDashboard = () => {
    setCurrentPage("dashboard");
  };

  return (
    <aside className="sidebar">

      <button
        type="button"
        className="logo logo-button"
        onClick={goToDashboard}
      >
        <span>📚</span>
        StudySpace
      </button>

      <nav className="sidebar-nav">

        <button
          className="nav-item"
          onClick={() =>
            setCurrentPage("dashboard")
          }
        >
          <span>🏠</span>
          Dashboard
        </button>

        <button
          className="nav-item"
          onClick={() =>
            setCurrentPage("resources")
          }
        >
          <span>📚</span>
          Resources
        </button>

        <button
          className="nav-item"
          onClick={() =>
            setCurrentPage("questions")
          }
        >
          <span>❓</span>
          Questions
        </button>

        <button
          className="nav-item"
          onClick={() =>
            setCurrentPage("groups")
          }
        >
          <span>👥</span>
          Study Groups
        </button>

        <button
          className="nav-item"
          onClick={() =>
            setCurrentPage("bookmarks")
          }
        >
          <span>🔖</span>
          Bookmarks
        </button>

      </nav>

    </aside>
  );
}

export default Sidebar;