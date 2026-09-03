import { useState } from "react";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Resources from "./pages/Resources";
import Questions from "./pages/Questions";
import StudyGroups from "./pages/StudyGroups";
import Profile from "./pages/Profile";
import Bookmarks from "./pages/Bookmarks";
import Settings from "./pages/Settings";

function App() {
  const { user } = useAuth();

  const [currentPage, setCurrentPage] =
    useState(
      user ? "dashboard" : "login"
    );

  const [selectedSubject, setSelectedSubject] =
    useState("All");

  // =========================
  // Not Logged In
  // =========================

  if (!user) {
    if (currentPage === "register") {
      return (
        <Register
          setCurrentPage={setCurrentPage}
        />
      );
    }

    return (
      <Login
        setCurrentPage={setCurrentPage}
      />
    );
  }

  // =========================
  // Logged In Pages
  // =========================

  if (currentPage === "resources") {
    return (
      <Resources
        setCurrentPage={setCurrentPage}
        selectedSubject={selectedSubject}
        setSelectedSubject={
          setSelectedSubject
        }
      />
    );
  }

  if (currentPage === "questions") {
    return (
      <Questions
        setCurrentPage={setCurrentPage}
      />
    );
  }

  if (currentPage === "groups") {
    return (
      <StudyGroups
        setCurrentPage={setCurrentPage}
      />
    );
  }

  if (currentPage === "profile") {
    return (
      <Profile
        setCurrentPage={setCurrentPage}
      />
    );
  }

  if (currentPage === "bookmarks") {
    return (
      <Bookmarks
        setCurrentPage={setCurrentPage}
      />
    );
  }

  if (currentPage === "settings") {
    return (
      <Settings
        setCurrentPage={setCurrentPage}
      />
    );
  }

  // =========================
  // Dashboard
  // =========================

  return (
    <Dashboard
      setCurrentPage={setCurrentPage}
      setSelectedSubject={
        setSelectedSubject
      }
    />
  );
}

export default App;