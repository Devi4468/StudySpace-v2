import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import apiRequest from "../services/api";

function Register({ setCurrentPage }) {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const passwordRequirements = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
    special: /[@$!%*?&]/.test(formData.password),
  };

  const passwordValid =
    passwordRequirements.length &&
    passwordRequirements.uppercase &&
    passwordRequirements.lowercase &&
    passwordRequirements.number &&
    passwordRequirements.special;

  const passwordsMatch =
    formData.password === formData.confirmPassword &&
    formData.confirmPassword.length > 0;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordValid) {
      alert(
        "Please create a password that meets all the requirements."
      );
      return;
    }

    if (!passwordsMatch) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const data = await apiRequest(
        "/users/register",
        {
          method: "POST",
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      login(data.user, data.token);

      setCurrentPage("dashboard");
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

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
          <h1>Create your account</h1>

          <p>
            Join StudySpace and start learning together.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>

          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            minLength="2"
            maxLength="50"
            required
          />

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
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {formData.password.length > 0 && (
            <div className="password-requirements">
              <p>Password must contain:</p>

              <div
                className={
                  passwordRequirements.length
                    ? "requirement valid"
                    : "requirement"
                }
              >
                {passwordRequirements.length
                  ? "✓"
                  : "○"}
                At least 8 characters
              </div>

              <div
                className={
                  passwordRequirements.uppercase
                    ? "requirement valid"
                    : "requirement"
                }
              >
                {passwordRequirements.uppercase
                  ? "✓"
                  : "○"}
                One uppercase letter
              </div>

              <div
                className={
                  passwordRequirements.lowercase
                    ? "requirement valid"
                    : "requirement"
                }
              >
                {passwordRequirements.lowercase
                  ? "✓"
                  : "○"}
                One lowercase letter
              </div>

              <div
                className={
                  passwordRequirements.number
                    ? "requirement valid"
                    : "requirement"
                }
              >
                {passwordRequirements.number
                  ? "✓"
                  : "○"}
                One number
              </div>

              <div
                className={
                  passwordRequirements.special
                    ? "requirement valid"
                    : "requirement"
                }
              >
                {passwordRequirements.special
                  ? "✓"
                  : "○"}
                One special character (@ $ ! % * ? &)
              </div>
            </div>
          )}

          <label>Confirm Password</label>

          <input
            type="password"
            name="confirmPassword"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {formData.confirmPassword.length > 0 && (
            <div
              className={
                passwordsMatch
                  ? "password-match valid"
                  : "password-match"
              }
            >
              {passwordsMatch
                ? "✓ Passwords match"
                : "✕ Passwords do not match"}
            </div>
          )}

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={
              loading ||
              !passwordValid ||
              !passwordsMatch
            }
          >
            {loading
              ? "Creating account..."
              : "Create Account"}
          </button>
        </form>

        <div className="auth-switch">
          <span>Already have an account?</span>

          <button
            type="button"
            onClick={() =>
              setCurrentPage("login")
            }
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;