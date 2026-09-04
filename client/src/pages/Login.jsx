import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import apiRequest from "../services/api";

function Login({ setCurrentPage }) {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const data = await apiRequest(
        "/users/login",
        {
          method: "POST",
          body: JSON.stringify(formData),
        }
      );

      login(data.user, data.token);

      setCurrentPage("dashboard");
    } catch (error) {
      console.error("Login error:", error);

      alert(
        error.message ||
          "Could not connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span>📚</span>
          StudySpace
        </div>

        <div className="auth-heading">
          <h1>Welcome back</h1>

          <p>
            Login to continue your learning journey.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-switch">
          <span>Don't have an account?</span>

          <button
            type="button"
            onClick={() =>
              setCurrentPage("register")
            }
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;