import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import apiRequest from "../services/api";

function Bookmarks({ setCurrentPage }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // Fetch Bookmarks
  // =========================

  const fetchBookmarks = async () => {
    try {
      const data = await apiRequest(
        "/bookmarks"
      );

      setBookmarks(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "Error fetching bookmarks:",
        error
      );

      alert(
        error.message ||
          "Could not load bookmarks"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  // =========================
  // Remove Bookmark
  // =========================

  const handleRemoveBookmark = async (
    bookmark
  ) => {
    try {
      const requestData =
        bookmark.resource
          ? {
              resourceId:
                bookmark.resource._id,
            }
          : {
              questionId:
                bookmark.question._id,
            };

      await apiRequest(
        "/bookmarks",
        {
          method: "DELETE",
          body: JSON.stringify(
            requestData
          ),
        }
      );

      setBookmarks(
        (currentBookmarks) =>
          currentBookmarks.filter(
            (item) =>
              item._id !== bookmark._id
          )
      );
    } catch (error) {
      console.error(
        "Error removing bookmark:",
        error
      );

      alert(
        error.message ||
          "Could not remove bookmark"
      );
    }
  };

  // =========================
  // Separate Resources
  // =========================

  const resourceBookmarks =
    bookmarks.filter(
      (bookmark) =>
        bookmark.resource
    );

  // =========================
  // Separate Questions
  // =========================

  const questionBookmarks =
    bookmarks.filter(
      (bookmark) =>
        bookmark.question
    );

  // =========================
  // Open Resource
  // =========================

  const handleOpenResource = (
    resource
  ) => {
    if (!resource.link) {
      alert(
        "This resource does not have a link."
      );

      return;
    }

    window.open(
      resource.link,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="bookmarks-page">

      <BackButton
        setCurrentPage={setCurrentPage}
      />

      {/* =========================
          Header
      ========================= */}

      <div className="bookmarks-header">

        <div>
          <p className="page-label">
            YOUR SAVED CONTENT
          </p>

          <h1>
            Bookmarks
          </h1>

          <p>
            Quickly access the resources
            and questions you saved.
          </p>
        </div>

        <div className="bookmarks-count">
          🔖 {bookmarks.length} saved
        </div>

      </div>

      {/* =========================
          Loading
      ========================= */}

      {loading ? (

        <div className="no-results">

          <div>
            ⏳
          </div>

          <h3>
            Loading bookmarks...
          </h3>

        </div>

      ) : bookmarks.length === 0 ? (

        /* =========================
           Empty State
        ========================= */

        <div className="no-results">

          <div>
            🔖
          </div>

          <h3>
            No bookmarks yet
          </h3>

          <p>
            Bookmark resources or questions
            to find them here later.
          </p>

        </div>

      ) : (

        <>

          {/* =========================
              Saved Resources
          ========================= */}

          <section className="bookmark-section">

            <div className="resource-heading">

              <h2>
                📚 Saved Resources
              </h2>

              <span>
                {resourceBookmarks.length}{" "}
                resources
              </span>

            </div>

            {resourceBookmarks.length >
            0 ? (

              <div className="bookmark-resource-list">

                {resourceBookmarks.map(
                  (bookmark) => {

                    const resource =
                      bookmark.resource;

                    return (

                      <div
                        className="bookmark-card"
                        key={bookmark._id}
                      >

                        <div className="bookmark-card-top">

                          <div className="bookmark-type-icon">
                            📚
                          </div>

                          <span className="resource-type">
                            {resource.type}
                          </span>

                        </div>

                        <h3>
                          {resource.title}
                        </h3>

                        <p>
                          {resource.description}
                        </p>

                        <div className="bookmark-meta">

                          <span>
                            📖{" "}
                            {resource.subject}
                          </span>

                          <span>
                            👤{" "}
                            {resource.uploadedBy
                              ?.name ||
                              "Student"}
                          </span>

                        </div>

                        <div className="bookmark-actions">

                          {resource.link && (
                            <button
                              type="button"
                              className="bookmark-open-btn"
                              onClick={() =>
                                handleOpenResource(
                                  resource
                                )
                              }
                            >
                              🔗 Open Resource
                            </button>
                          )}

                          <button
                            type="button"
                            className="bookmark-remove-btn"
                            onClick={() =>
                              handleRemoveBookmark(
                                bookmark
                              )
                            }
                          >
                            🗑️ Remove
                          </button>

                        </div>

                      </div>

                    );
                  }
                )}

              </div>

            ) : (

              <div className="bookmark-empty">
                No saved resources.
              </div>

            )}

          </section>

          {/* =========================
              Saved Questions
          ========================= */}

          <section className="bookmark-section">

            <div className="resource-heading">

              <h2>
                ❓ Saved Questions
              </h2>

              <span>
                {questionBookmarks.length}{" "}
                questions
              </span>

            </div>

            {questionBookmarks.length >
            0 ? (

              <div className="bookmark-question-list">

                {questionBookmarks.map(
                  (bookmark) => {

                    const question =
                      bookmark.question;

                    return (

                      <div
                        className="bookmark-card"
                        key={bookmark._id}
                      >

                        <div className="bookmark-card-top">

                          <div className="bookmark-type-icon">
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

                        <div className="bookmark-meta">

                          <span>
                            👤 Asked by{" "}
                            {question.author
                              ?.name ||
                              "Student"}
                          </span>

                        </div>

                        <div className="bookmark-actions">

                          <button
                            type="button"
                            className="bookmark-remove-btn"
                            onClick={() =>
                              handleRemoveBookmark(
                                bookmark
                              )
                            }
                          >
                            🗑️ Remove
                          </button>

                        </div>

                      </div>

                    );
                  }
                )}

              </div>

            ) : (

              <div className="bookmark-empty">
                No saved questions.
              </div>

            )}

          </section>

        </>

      )}

    </div>
  );
}

export default Bookmarks;