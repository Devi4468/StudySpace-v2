import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import BackButton from "../components/BackButton";
import apiRequest from "../services/api";

function Questions({ setCurrentPage }) {
  const { user } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] =
    useState("All");

  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] =
    useState(null);

  const [bookmarkedQuestions, setBookmarkedQuestions] =
    useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    tags: "",
  });

  const subjects = [
    "All",
    "Python",
    "Data Structures",
    "DBMS",
    "Machine Learning",
    "React",
    "JavaScript",
    "Java",
    "C++",
    "C Programming",
    "Operating Systems",
    "Computer Networks",
    "Cloud Computing",
    "AWS",
    "Power BI",
    "Data Science",
    "Cyber Security",
  ];

  // =========================
  // Fetch Questions
  // =========================

  const fetchQuestions = async () => {
    try {
      const data = await apiRequest(
        "/questions"
      );

      setQuestions(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "Error fetching questions:",
        error
      );

      alert(
        error.message ||
          "Could not load questions"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Fetch Bookmarks
  // =========================

  const fetchBookmarks = async () => {
    try {
      const data = await apiRequest(
        "/bookmarks"
      );

      const questionIds = Array.isArray(data)
        ? data
            .filter(
              (bookmark) =>
                bookmark.question?._id
            )
            .map(
              (bookmark) =>
                bookmark.question._id
            )
        : [];

      setBookmarkedQuestions(
        questionIds
      );
    } catch (error) {
      console.error(
        "Error fetching bookmarks:",
        error
      );
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchBookmarks();
  }, []);

  // =========================
  // Handle Bookmark
  // =========================

  const handleBookmark = async (
    questionId
  ) => {
    const isBookmarked =
      bookmarkedQuestions.includes(
        questionId
      );

    try {
      if (isBookmarked) {
        await apiRequest(
          "/bookmarks",
          {
            method: "DELETE",
            body: JSON.stringify({
              questionId,
            }),
          }
        );

        setBookmarkedQuestions(
          (currentBookmarks) =>
            currentBookmarks.filter(
              (id) =>
                id !== questionId
            )
        );
      } else {
        await apiRequest(
          "/bookmarks",
          {
            method: "POST",
            body: JSON.stringify({
              questionId,
            }),
          }
        );

        setBookmarkedQuestions(
          (currentBookmarks) => [
            ...currentBookmarks,
            questionId,
          ]
        );
      }
    } catch (error) {
      console.error(
        "Error updating bookmark:",
        error
      );

      alert(
        error.message ||
          "Could not update bookmark"
      );
    }
  };

  // =========================
  // Handle Input Changes
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // Open Add Question Form
  // =========================

  const openAddForm = () => {
    setEditingQuestion(null);

    setFormData({
      title: "",
      description: "",
      subject: "",
      tags: "",
    });

    setShowForm(true);
  };

  // =========================
  // Open Edit Question Form
  // =========================

  const openEditForm = (question) => {
    setEditingQuestion(question);

    setFormData({
      title: question.title,
      description: question.description,
      subject: question.subject,
      tags: Array.isArray(question.tags)
        ? question.tags.join(", ")
        : "",
    });

    setShowForm(true);
  };

  // =========================
  // Close Form
  // =========================

  const closeForm = () => {
    setShowForm(false);
    setEditingQuestion(null);

    setFormData({
      title: "",
      description: "",
      subject: "",
      tags: "",
    });
  };

  // =========================
  // Create / Update Question
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const tags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(
          (tag) => tag.length > 0
        );

      const requestData = {
        title: formData.title,
        description: formData.description,
        subject: formData.subject,
        tags,
      };

      let data;

      if (editingQuestion) {
        data = await apiRequest(
          `/questions/${editingQuestion._id}`,
          {
            method: "PUT",
            body: JSON.stringify(
              requestData
            ),
          }
        );

        setQuestions(
          (currentQuestions) =>
            currentQuestions.map(
              (question) =>
                question._id === data._id
                  ? data
                  : question
            )
        );
      } else {
        data = await apiRequest(
          "/questions",
          {
            method: "POST",
            body: JSON.stringify(
              requestData
            ),
          }
        );

        setQuestions(
          (currentQuestions) => [
            data,
            ...currentQuestions,
          ]
        );
      }

      closeForm();
    } catch (error) {
      console.error(
        "Error saving question:",
        error
      );

      alert(
        error.message ||
          "Could not save question"
      );
    }
  };

  // =========================
  // Delete Question
  // =========================

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this question?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await apiRequest(
        `/questions/${id}`,
        {
          method: "DELETE",
        }
      );

      setQuestions(
        (currentQuestions) =>
          currentQuestions.filter(
            (question) =>
              question._id !== id
          )
      );

      setBookmarkedQuestions(
        (currentBookmarks) =>
          currentBookmarks.filter(
            (questionId) =>
              questionId !== id
          )
      );
    } catch (error) {
      console.error(
        "Error deleting question:",
        error
      );

      alert(
        error.message ||
          "Could not delete question"
      );
    }
  };

  // =========================
  // Filter Questions
  // =========================

  const filteredQuestions =
    questions.filter((question) => {
      const searchText =
        search.toLowerCase();

      const matchesSearch =
        question.title
          .toLowerCase()
          .includes(searchText) ||
        question.description
          .toLowerCase()
          .includes(searchText) ||
        question.subject
          .toLowerCase()
          .includes(searchText) ||
        question.tags?.some((tag) =>
          tag
            .toLowerCase()
            .includes(searchText)
        );

      const matchesSubject =
        selectedSubject === "All" ||
        question.subject ===
          selectedSubject;

      return (
        matchesSearch &&
        matchesSubject
      );
    });

  return (
    <div className="questions-page">

      <BackButton
        setCurrentPage={setCurrentPage}
      />

      {/* =========================
          Header
      ========================= */}

      <div className="questions-header">

        <div>

          <p className="page-label">
            COMMUNITY Q&A
          </p>

          <h1>
            Questions
          </h1>

          <p>
            Ask questions, share knowledge
            and learn from other students.
          </p>

        </div>

        <button
          className="ask-question-btn"
          onClick={openAddForm}
        >
          + Ask Question
        </button>

      </div>

      {/* =========================
          Search
      ========================= */}

      <div className="question-search">

        <span>
          🔎
        </span>

        <input
          type="text"
          placeholder="Search questions..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* =========================
          Subject Categories
      ========================= */}

      <div className="question-category-section">

        <h3>
          Browse by subject
        </h3>

        <div className="category-list">

          {subjects.map((item) => (

            <button
              key={item}
              className={
                selectedSubject === item
                  ? "category-btn active"
                  : "category-btn"
              }
              onClick={() =>
                setSelectedSubject(item)
              }
            >
              {item}
            </button>

          ))}

        </div>

      </div>

      {/* =========================
          Questions Heading
      ========================= */}

      <div className="resource-heading">

        <h2>
          Recent Questions
        </h2>

        <span>
          {filteredQuestions.length} questions
        </span>

      </div>

      {/* =========================
          Questions List
      ========================= */}

      {loading ? (

        <div className="no-results">

          <div>
            ⏳
          </div>

          <h3>
            Loading questions...
          </h3>

        </div>

      ) : filteredQuestions.length > 0 ? (

        <div className="question-list">

          {filteredQuestions.map(
            (question) => {

              const authorName =
                question.author?.name ||
                "Student";

              const isOwner =
                question.author?._id ===
                  user?.id ||
                question.author?._id ===
                  user?._id;

              const isBookmarked =
                bookmarkedQuestions.includes(
                  question._id
                );

              return (

                <div
                  className="question-card"
                  key={question._id}
                >

                  <div className="question-card-header">

                    <div className="question-icon">
                      ❓
                    </div>

                    <span className="question-subject">
                      {question.subject}
                    </span>

                  </div>

                  <h3>
                    {question.title}
                  </h3>

                  <p>
                    {question.description}
                  </p>

                  {/* Tags */}

                  {question.tags &&
                    question.tags.length >
                      0 && (

                    <div className="question-tags">

                      {question.tags.map(
                        (tag, index) => (

                          <span
                            key={`${tag}-${index}`}
                          >
                            #{tag}
                          </span>

                        )
                      )}

                    </div>

                  )}

                  {/* Footer */}

                  <div className="question-footer">

                    <span>
                      Asked by{" "}

                      <strong>
                        {authorName}
                      </strong>
                    </span>

                  </div>

                  {/* Bookmark */}

                  <button
                    type="button"
                    className={
                      isBookmarked
                        ? "bookmark-btn bookmarked"
                        : "bookmark-btn"
                    }
                    onClick={() =>
                      handleBookmark(
                        question._id
                      )
                    }
                  >
                    {isBookmarked
                      ? "🔖 Bookmarked"
                      : "🔖 Bookmark"}
                  </button>

                  {/* Owner Actions */}

                  {isOwner && (

                    <div className="question-actions">

                      <button
                        type="button"
                        className="edit-question-btn"
                        onClick={() =>
                          openEditForm(
                            question
                          )
                        }
                      >
                        ✏️ Edit
                      </button>

                      <button
                        type="button"
                        className="delete-question-btn"
                        onClick={() =>
                          handleDelete(
                            question._id
                          )
                        }
                      >
                        🗑️ Delete
                      </button>

                    </div>

                  )}

                </div>

              );
            }
          )}

        </div>

      ) : (

        <div className="no-results">

          <div>
            ❓
          </div>

          <h3>
            No questions found
          </h3>

          <p>
            Try a different search or ask
            the first question.
          </p>

        </div>

      )}

      {/* =========================
          Add / Edit Question Modal
      ========================= */}

      {showForm && (

        <div className="modal-overlay">

          <div className="resource-modal">

            <div className="modal-header">

              <div>

                <h2>
                  {editingQuestion
                    ? "Edit Question"
                    : "Ask a Question"}
                </h2>

                <p>
                  {editingQuestion
                    ? "Update your question details."
                    : "Ask the StudySpace community for help."}
                </p>

              </div>

              <button
                type="button"
                className="close-btn"
                onClick={closeForm}
              >
                ✕
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
            >

              <label>
                Question Title
              </label>

              <input
                type="text"
                name="title"
                placeholder="Eg: How does JWT authentication work?"
                value={formData.title}
                onChange={handleChange}
                required
              />

              <label>
                Subject
              </label>

              <input
                type="text"
                name="subject"
                list="question-subject-options"
                placeholder="Eg: Python, DBMS, React"
                value={formData.subject}
                onChange={handleChange}
                required
              />

              <datalist id="question-subject-options">

                <option value="Python" />
                <option value="Data Structures" />
                <option value="DBMS" />
                <option value="Machine Learning" />
                <option value="React" />
                <option value="JavaScript" />
                <option value="Java" />
                <option value="C++" />
                <option value="C Programming" />
                <option value="Operating Systems" />
                <option value="Computer Networks" />
                <option value="Cloud Computing" />
                <option value="AWS" />
                <option value="Power BI" />
                <option value="Data Science" />
                <option value="Cyber Security" />

              </datalist>

              <label>
                Description
              </label>

              <textarea
                name="description"
                rows="5"
                placeholder="Explain your question clearly..."
                value={
                  formData.description
                }
                onChange={handleChange}
                required
              />

              <label>
                Tags
              </label>

              <input
                type="text"
                name="tags"
                placeholder="Eg: javascript, react, hooks"
                value={formData.tags}
                onChange={handleChange}
              />

              <div className="logged-in-user">

                <span>
                  Asking as
                </span>

                <strong>
                  {user?.name ||
                    "Student"}
                </strong>

              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="submit-btn"
                >
                  {editingQuestion
                    ? "Save Changes"
                    : "Post Question"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Questions;