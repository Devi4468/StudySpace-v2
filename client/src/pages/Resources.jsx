import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import BackButton from "../components/BackButton";
import apiRequest from "../services/api";

function Resources({
  setCurrentPage,
  selectedSubject,
  setSelectedSubject,
}) {
  const { user } = useAuth();

  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    selectedSubject || "All"
  );

  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] =
    useState(null);

  const [bookmarkedResources, setBookmarkedResources] =
    useState([]);

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    description: "",
    type: "Notes",
    link: "",
  });

  const categories = [
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
  // Fetch Resources
  // =========================

  const fetchResources = async () => {
    try {
      const data = await apiRequest(
        "/resources"
      );

      setResources(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "Error fetching resources:",
        error
      );

      alert(
        error.message ||
          "Could not load resources"
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

      const resourceIds = Array.isArray(data)
        ? data
            .filter(
              (bookmark) =>
                bookmark.resource?._id
            )
            .map(
              (bookmark) =>
                bookmark.resource._id
            )
        : [];

      setBookmarkedResources(resourceIds);
    } catch (error) {
      console.error(
        "Error fetching bookmarks:",
        error
      );
    }
  };

  useEffect(() => {
    fetchResources();
    fetchBookmarks();
  }, []);

  // =========================
  // Update Selected Subject
  // =========================

  useEffect(() => {
    if (selectedSubject) {
      setCategory(selectedSubject);
    }
  }, [selectedSubject]);

  // =========================
  // Handle Bookmark
  // =========================

  const handleBookmark = async (
    resourceId
  ) => {
    const isBookmarked =
      bookmarkedResources.includes(
        resourceId
      );

    try {
      if (isBookmarked) {
        await apiRequest(
          "/bookmarks",
          {
            method: "DELETE",
            body: JSON.stringify({
              resourceId,
            }),
          }
        );

        setBookmarkedResources(
          (currentBookmarks) =>
            currentBookmarks.filter(
              (id) =>
                id !== resourceId
            )
        );
      } else {
        await apiRequest(
          "/bookmarks",
          {
            method: "POST",
            body: JSON.stringify({
              resourceId,
            }),
          }
        );

        setBookmarkedResources(
          (currentBookmarks) => [
            ...currentBookmarks,
            resourceId,
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
  // Handle Form Changes
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // Open Add Form
  // =========================

  const openAddForm = () => {
    setEditingResource(null);

    setFormData({
      title: "",
      subject: "",
      description: "",
      type: "Notes",
      link: "",
    });

    setShowForm(true);
  };

  // =========================
  // Open Edit Form
  // =========================

  const openEditForm = (resource) => {
    setEditingResource(resource);

    setFormData({
      title: resource.title,
      subject: resource.subject,
      description: resource.description,
      type: resource.type,
      link: resource.link || "",
    });

    setShowForm(true);
  };

  // =========================
  // Close Form
  // =========================

  const closeForm = () => {
    setShowForm(false);
    setEditingResource(null);

    setFormData({
      title: "",
      subject: "",
      description: "",
      type: "Notes",
      link: "",
    });
  };

  // =========================
  // Create / Update Resource
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let data;

      const requestData = {
        title: formData.title,
        subject: formData.subject,
        description: formData.description,
        type: formData.type,
        link: formData.link,
      };

      if (editingResource) {
        data = await apiRequest(
          `/resources/${editingResource._id}`,
          {
            method: "PUT",
            body: JSON.stringify(
              requestData
            ),
          }
        );

        setResources(
          (currentResources) =>
            currentResources.map(
              (resource) =>
                resource._id === data._id
                  ? data
                  : resource
            )
        );
      } else {
        data = await apiRequest(
          "/resources",
          {
            method: "POST",
            body: JSON.stringify(
              requestData
            ),
          }
        );

        setResources(
          (currentResources) => [
            data,
            ...currentResources,
          ]
        );
      }

      closeForm();
    } catch (error) {
      console.error(
        "Error saving resource:",
        error
      );

      alert(
        error.message ||
          "Could not save resource"
      );
    }
  };

  // =========================
  // Delete Resource
  // =========================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resource?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await apiRequest(
        `/resources/${id}`,
        {
          method: "DELETE",
        }
      );

      setResources(
        (currentResources) =>
          currentResources.filter(
            (resource) =>
              resource._id !== id
          )
      );

      setBookmarkedResources(
        (currentBookmarks) =>
          currentBookmarks.filter(
            (bookmarkId) =>
              bookmarkId !== id
          )
      );
    } catch (error) {
      console.error(
        "Error deleting resource:",
        error
      );

      alert(
        error.message ||
          "Could not delete resource"
      );
    }
  };

  // =========================
  // Search + Category Filter
  // =========================

  const filteredResources =
    resources.filter((resource) => {
      const searchText =
        search.toLowerCase();

      const matchesSearch =
        resource.title
          .toLowerCase()
          .includes(searchText) ||
        resource.subject
          .toLowerCase()
          .includes(searchText) ||
        resource.description
          .toLowerCase()
          .includes(searchText);

      const matchesCategory =
        category === "All" ||
        resource.subject === category;

      return (
        matchesSearch &&
        matchesCategory
      );
    });

  return (
    <div className="resources-page">

      <BackButton
        setCurrentPage={setCurrentPage}
      />

      {/* =========================
          Header
      ========================= */}

      <div className="resources-header">

        <div>

          <p className="page-label">
            LEARNING LIBRARY
          </p>

          <h1>
            Study Resources
          </h1>

          <p>
            Discover notes, tutorials and
            learning materials shared by
            students.
          </p>

        </div>

        <button
          className="add-resource-btn"
          onClick={openAddForm}
        >
          + Add Resource
        </button>

      </div>

      {/* =========================
          Search
      ========================= */}

      <div className="resource-search">

        <span>
          🔎
        </span>

        <input
          type="text"
          placeholder="Search resources..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* =========================
          Categories
      ========================= */}

      <div className="category-section">

        <h3>
          Browse by subject
        </h3>

        <div className="category-list">

          {categories.map((item) => (

            <button
              key={item}
              className={
                category === item
                  ? "category-btn active"
                  : "category-btn"
              }
              onClick={() => {
                setCategory(item);
                setSelectedSubject(item);
              }}
            >
              {item}
            </button>

          ))}

        </div>

      </div>

      {/* =========================
          Resource Heading
      ========================= */}

      <div className="resource-heading">

        <h2>
          Available Resources
        </h2>

        <span>
          {filteredResources.length} resources
        </span>

      </div>

      {/* =========================
          Resource List
      ========================= */}

      {loading ? (

        <div className="no-results">

          <div>
            ⏳
          </div>

          <h3>
            Loading resources...
          </h3>

        </div>

      ) : filteredResources.length > 0 ? (

        <div className="resource-grid">

          {filteredResources.map(
            (resource) => {

              const uploadedByName =
                resource.uploadedBy?.name ||
                "Student";

              const isOwner =
                resource.uploadedBy?.name ===
                user?.name;

              const isBookmarked =
                bookmarkedResources.includes(
                  resource._id
                );

              return (

                <div
                  className="resource-card"
                  key={resource._id}
                >

                  <div className="resource-card-top">

                    <div className="resource-icon">
                      📄
                    </div>

                    <span className="resource-type">
                      {resource.type}
                    </span>

                  </div>

                  <h3>
                    {resource.title}
                  </h3>

                  <span className="resource-subject">
                    {resource.subject}
                  </span>

                  <p>
                    {resource.description}
                  </p>

                  {/* Resource Link */}

                  {resource.link ? (

                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noreferrer"
                      className="open-resource-btn"
                    >
                      Open Resource →
                    </a>

                  ) : (

                    <button
                      type="button"
                      className="open-resource-btn"
                      disabled
                    >
                      No Resource Link
                    </button>

                  )}

                  {/* Owner */}

                  <div className="resource-owner">

                    Uploaded by{" "}

                    <strong>
                      {uploadedByName}
                    </strong>

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
                        resource._id
                      )
                    }
                  >
                    {isBookmarked
                      ? "🔖 Bookmarked"
                      : "🔖 Bookmark"}
                  </button>

                  {/* Owner Actions */}

                  {isOwner && (

                    <div className="resource-actions">

                      <button
                        type="button"
                        className="edit-resource-btn"
                        onClick={() =>
                          openEditForm(
                            resource
                          )
                        }
                      >
                        ✏️ Edit
                      </button>

                      <button
                        type="button"
                        className="delete-resource-btn"
                        onClick={() =>
                          handleDelete(
                            resource._id
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
            📚
          </div>

          <h3>
            No resources yet
          </h3>

          <p>
            Be the first student to share
            a learning resource.
          </p>

        </div>

      )}

      {/* =========================
          Add / Edit Modal
      ========================= */}

      {showForm && (

        <div className="modal-overlay">

          <div className="resource-modal">

            <div className="modal-header">

              <div>

                <h2>
                  {editingResource
                    ? "Edit Study Resource"
                    : "Add Study Resource"}
                </h2>

                <p>
                  {editingResource
                    ? "Update the resource details."
                    : "Share helpful material with other students."}
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
                Resource Title
              </label>

              <input
                type="text"
                name="title"
                placeholder="Eg: Python Complete Notes"
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
                list="resource-subject-options"
                placeholder="Eg: Python, AWS, Cloud Computing"
                value={formData.subject}
                onChange={handleChange}
                required
              />

              <datalist id="resource-subject-options">

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
                placeholder="Write a short description..."
                rows="4"
                value={
                  formData.description
                }
                onChange={handleChange}
                required
              />

              <label>
                Resource Type
              </label>

              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
              >

                <option>
                  Notes
                </option>

                <option>
                  Tutorial
                </option>

                <option>
                  Video
                </option>

                <option>
                  Article
                </option>

                <option>
                  PDF
                </option>

              </select>

              <label>
                Resource Link
              </label>

              <input
                type="url"
                name="link"
                placeholder="https://example.com"
                value={formData.link}
                onChange={handleChange}
              />

              <div className="logged-in-user">

                <span>
                  Uploading as
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
                  {editingResource
                    ? "Save Changes"
                    : "Add Resource"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Resources;