function BackButton({ setCurrentPage }) {
  return (
    <button
      type="button"
      className="back-button"
      onClick={() =>
        setCurrentPage("dashboard")
      }
    >
      ← Back to Dashboard
    </button>
  );
}

export default BackButton;