import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useAuth } from "../context/AuthContext";
import BackButton from "../components/BackButton";
import apiRequest from "../services/api";

function Resources({
  setCurrentPage,
  selectedSubject,
  setSelectedSubject,
}) {
  const { user } = useAuth();

  const [resources, setResources] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState(
      selectedSubject || "All"
    );

  const [loading, setLoading] =
    useState(true);

  const [showForm, setShowForm] =
    useState(false);

  const [editingResource, setEditingResource] =
    useState(null);

  const [
    bookmarkedResources,
    setBookmarkedResources,
  ] = useState([]);

  // =========================
  // PDF Upload State
  // =========================

  const [
    resourceSourceType,
    setResourceSourceType,
  ] = useState("link");

  const [
    resourceFile,
    setResourceFile,
  ] = useState(null);

  const [
    resourceUploading,
    setResourceUploading,
  ] = useState(false);

  const resourceFileInputRef =
    useRef(null);

  // =========================
  // Form Data
  // =========================

  const [formData, setFormData] =
    useState({
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
      const data =
        await apiRequest("/resources");

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
      const data =
        await apiRequest("/bookmarks");

      const resourceIds =
        Array.isArray(data)
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

      setBookmarkedResources(
        resourceIds
      );
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
      setCategory(
        selectedSubject
      );
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
      [e.target.name]:
        e.target.value,
    });
  };

  // =========================
  // Handle Source Type
  // =========================

  const handleSourceChange = (
    sourceType
  ) => {
    setResourceSourceType(
      sourceType
    );

    if (sourceType === "link") {
      setResourceFile(null);

      if (
        resourceFileInputRef.current
      ) {
        resourceFileInputRef.current.value =
          "";
      }

      setFormData(
        (current) => ({
          ...current,
          type:
            current.type === "PDF"
              ? "Notes"
              : current.type,
        })
      );
    } else {
      setFormData(
        (current) => ({
          ...current,
          link: "",
          type: "PDF",
        })
      );
    }
  };

  // =========================
  // Handle PDF Selection
  // =========================

  const handleFileChange = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) {
      setResourceFile(null);
      return;
    }

    if (
      file.type !==
      "application/pdf"
    ) {
      alert(
        "Please select a PDF file only."
      );

      e.target.value = "";
      setResourceFile(null);
      return;
    }

    const maxSize =
      10 * 1024 * 1024;

    if (file.size > maxSize) {
      alert(
        "PDF file is too large. Maximum allowed size is 10 MB."
      );

      e.target.value = "";
      setResourceFile(null);
      return;
    }

    setResourceFile(file);
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

    setResourceSourceType(
      "link"
    );

    setResourceFile(null);

    if (
      resourceFileInputRef.current
    ) {
      resourceFileInputRef.current.value =
        "";
    }

    setShowForm(true);
  };

  // =========================
  // Open Edit Form
  // =========================

  const openEditForm = (
    resource
  ) => {
    setEditingResource(resource);

    const isPdf =
      resource.sourceType ===
        "pdf" ||
      resource.type === "PDF";

    setFormData({
      title:
        resource.title || "",
      subject:
        resource.subject || "",
      description:
        resource.description || "",
      type:
        resource.type || "Notes",
      link:
        isPdf
          ? ""
          : resource.link || "",
    });

    setResourceSourceType(
      isPdf
        ? "pdf"
        : "link"
    );

    setResourceFile(null);

    if (
      resourceFileInputRef.current
    ) {
      resourceFileInputRef.current.value =
        "";
    }

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

    setResourceSourceType(
      "link"
    );

    setResourceFile(null);

    if (
      resourceFileInputRef.current
    ) {
      resourceFileInputRef.current.value =
        "";
    }

    setResourceUploading(false);
  };

  // =========================
  // Create / Update Resource
  // =========================

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    if (resourceUploading) {
      return;
    }

    // =========================
    // EDIT EXISTING RESOURCE
    // =========================

    if (editingResource) {
      try {
        const isPdf =
          editingResource.sourceType ===
            "pdf" ||
          editingResource.type ===
            "PDF";

        const requestData = {
          title:
            formData.title.trim(),
          subject:
            formData.subject.trim(),
          description:
            formData.description.trim(),
          type: isPdf
            ? "PDF"
            : formData.type,
          link: isPdf
            ? editingResource.link
            : formData.link.trim(),
        };

        const data =
          await apiRequest(
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
                resource._id ===
                data._id
                  ? data
                  : resource
            )
        );

        closeForm();
      } catch (error) {
        console.error(
          "Error updating resource:",
          error
        );

        alert(
          error.message ||
            "Could not update resource"
        );
      }

      return;
    }

    // =========================
    // VALIDATE NEW RESOURCE
    // =========================

    if (
      !formData.title.trim() ||
      !formData.subject.trim() ||
      !formData.description.trim()
    ) {
      alert(
        "Please fill in all required fields."
      );
      return;
    }

    if (
      resourceSourceType === "link" &&
      !formData.link.trim()
    ) {
      alert(
        "Please enter a resource link."
      );
      return;
    }

    if (
      resourceSourceType === "pdf" &&
      !resourceFile
    ) {
      alert(
        "Please select a PDF file."
      );
      return;
    }

    if (
      resourceSourceType === "pdf" &&
      resourceFile.size >
        10 * 1024 * 1024
    ) {
      alert(
        "PDF file is too large. Maximum allowed size is 10 MB."
      );
      return;
    }

    // =========================
    // CREATE NEW RESOURCE
    // =========================

    try {
      setResourceUploading(true);

      let data;

      if (
        resourceSourceType === "pdf"
      ) {
        const dataToSend =
          new FormData();

        dataToSend.append(
          "title",
          formData.title.trim()
        );

        dataToSend.append(
          "subject",
          formData.subject.trim()
        );

        dataToSend.append(
          "description",
          formData.description.trim()
        );

        dataToSend.append(
          "type",
          "PDF"
        );

        dataToSend.append(
          "file",
          resourceFile
        );

        data =
          await apiRequest(
            "/resources",
            {
              method: "POST",
              body: dataToSend,
            }
          );
      } else {
        const requestData = {
          title:
            formData.title.trim(),
          subject:
            formData.subject.trim(),
          description:
            formData.description.trim(),
          type: formData.type,
          link:
            formData.link.trim(),
        };

        data =
          await apiRequest(
            "/resources",
            {
              method: "POST",
              body: JSON.stringify(
                requestData
              ),
            }
          );
      }

      setResources(
        (currentResources) => [
          data,
          ...currentResources,
        ]
      );

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
    } finally {
      setResourceUploading(false);
    }
  };

  // =========================
  // Delete Resource
  // =========================

  const handleDelete = async (
    id
  ) => {
    const confirmed =
      window.confirm(
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
    resources.filter(
      (resource) => {
        const searchText =
          search.toLowerCase();

        const title =
          resource.title ||
          "";

        const subject =
          resource.subject ||
          "";

        const description =
          resource.description ||
          "";

        const matchesSearch =
          title
            .toLowerCase()
            .includes(searchText) ||
          subject
            .toLowerCase()
            .includes(searchText) ||
          description
            .toLowerCase()
            .includes(searchText);

        const matchesCategory =
          category === "All" ||
          subject === category;

        return (
          matchesSearch &&
          matchesCategory
        );
      }
    );

  return (
    <div className="resources-page">

      <BackButton
        setCurrentPage={
          setCurrentPage
        }
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
            setSearch(
              e.target.value
            )
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

          {categories.map(
            (item) => (

              <button
                key={item}
                className={
                  category === item
                    ? "category-btn active"
                    : "category-btn"
                }
                onClick={() => {
                  setCategory(
                    item
                  );

                  setSelectedSubject(
                    item
                  );
                }}
              >
                {item}
              </button>

            )
          )}

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
          {filteredResources.length}{" "}
          resources
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

      ) : filteredResources.length >
        0 ? (

        <div className="resource-grid">

          {filteredResources.map(
            (resource) => {

              const uploadedByName =
                resource.uploadedBy?.name ||
                "Student";

              const isOwner =
                resource.uploadedBy
                  ?.name === user?.name;

              const isBookmarked =
                bookmarkedResources.includes(
                  resource._id
                );

              const isPdf =
                resource.sourceType ===
                  "pdf" ||
                resource.type === "PDF";

              return (

                <div
                  className="resource-card"
                  key={resource._id}
                >

                  <div className="resource-card-top">

                    <div className="resource-icon">
                      {isPdf
                        ? "📄"
                        : "📚"}
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

                  {/* Open Resource */}

                  {resource.link ? (

                    <a
                      href={
                        resource.link
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="open-resource-btn"
                    >
                      {isPdf
                        ? "📄 Open PDF →"
                        : "🔗 Open Resource →"}
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

        <div
          className="modal-overlay"
          style={{
            overflowY: "auto",
            padding:
              "20px",
            alignItems:
              "flex-start",
          }}
        >

          <div
            className="resource-modal"
            style={{
              width: "100%",
              maxWidth:
                "560px",
              maxHeight:
                "calc(100vh - 40px)",
              overflowY:
                "auto",
              margin:
                "0 auto",
            }}
          >

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
                disabled={
                  resourceUploading
                }
              >
                ✕
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
            >

              {/* Resource Title */}

              <label>
                Resource Title
              </label>

              <input
                type="text"
                name="title"
                placeholder="Eg: Python Complete Notes"
                value={
                  formData.title
                }
                onChange={
                  handleChange
                }
                required
              />

              {/* Subject */}

              <label>
                Subject
              </label>

              <input
                type="text"
                name="subject"
                list="resource-subject-options"
                placeholder="Eg: Python, AWS, Cloud Computing"
                value={
                  formData.subject
                }
                onChange={
                  handleChange
                }
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

              {/* Description */}

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
                onChange={
                  handleChange
                }
                required
              />

              {/* Resource Type */}

              <label>
                Resource Type
              </label>

              <select
                name="type"
                value={
                  resourceSourceType ===
                  "pdf"
                    ? "PDF"
                    : formData.type
                }
                onChange={
                  handleChange
                }
                disabled={
                  resourceSourceType ===
                  "pdf"
                }
              >

                <option value="Notes">
                  Notes
                </option>

                <option value="Tutorial">
                  Tutorial
                </option>

                <option value="Video">
                  Video
                </option>

                <option value="Article">
                  Article
                </option>

                <option value="PDF">
                  PDF
                </option>

              </select>

              {/* =========================
                  Share Type
                  ========================= */}

              {!editingResource && (

                <>
                  <label>
                    How do you want to share it?
                  </label>

                  <div
                    className="resource-source-options"
                    style={{
                      display:
                        "flex",
                      gap: "10px",
                      marginBottom:
                        "15px",
                    }}
                  >

                    <button
                      type="button"
                      onClick={() =>
                        handleSourceChange(
                          "link"
                        )
                      }
                      disabled={
                        resourceUploading
                      }
                      style={{
                        flex: 1,
                        padding:
                          "12px",
                        border:
                          resourceSourceType ===
                          "link"
                            ? "2px solid #2563eb"
                            : "1px solid #d1d5db",
                        borderRadius:
                          "8px",
                        background:
                          resourceSourceType ===
                          "link"
                            ? "#eff6ff"
                            : "#ffffff",
                        cursor:
                          resourceUploading
                            ? "not-allowed"
                            : "pointer",
                        fontWeight:
                          "600",
                      }}
                    >
                      🔗 Share Link
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleSourceChange(
                          "pdf"
                        )
                      }
                      disabled={
                        resourceUploading
                      }
                      style={{
                        flex: 1,
                        padding:
                          "12px",
                        border:
                          resourceSourceType ===
                          "pdf"
                            ? "2px solid #2563eb"
                            : "1px solid #d1d5db",
                        borderRadius:
                          "8px",
                        background:
                          resourceSourceType ===
                          "pdf"
                            ? "#eff6ff"
                            : "#ffffff",
                        cursor:
                          resourceUploading
                            ? "not-allowed"
                            : "pointer",
                        fontWeight:
                          "600",
                      }}
                    >
                      📄 Upload PDF
                    </button>

                  </div>
                </>

              )}

              {/* =========================
                  Link Input
                  ========================= */}

              {(
                editingResource
                  ? editingResource.sourceType !==
                    "pdf"
                  : resourceSourceType ===
                    "link"
              ) && (

                <>
                  <label>
                    Resource Link
                  </label>

                  <input
                    type="url"
                    name="link"
                    placeholder="https://example.com"
                    value={
                      formData.link
                    }
                    onChange={
                      handleChange
                    }
                    required={
                      !editingResource
                    }
                  />
                </>

              )}

              {/* =========================
                  PDF Input
                  ========================= */}

              {!editingResource &&
                resourceSourceType ===
                  "pdf" && (

                  <>
                    <label>
                      Select PDF
                    </label>

                    <input
                      ref={
                        resourceFileInputRef
                      }
                      id="resource-pdf-file"
                      type="file"
                      accept="application/pdf,.pdf"
                      onChange={
                        handleFileChange
                      }
                      disabled={
                        resourceUploading
                      }
                    />

                    <p
                      style={{
                        marginTop:
                          "6px",
                        fontSize:
                          "13px",
                        color:
                          "#6b7280",
                      }}
                    >
                      Maximum PDF size:
                      10 MB
                    </p>

                    {resourceFile && (

                      <div
                        style={{
                          marginTop:
                            "10px",
                          padding:
                            "10px 12px",
                          border:
                            "1px solid #d1d5db",
                          borderRadius:
                            "8px",
                          background:
                            "#f9fafb",
                        }}
                      >
                        📄{" "}

                        <strong>
                          {
                            resourceFile.name
                          }
                        </strong>

                        <span
                          style={{
                            marginLeft:
                              "8px",
                            color:
                              "#6b7280",
                          }}
                        >
                          (
                          {(
                            resourceFile.size /
                            (1024 *
                              1024)
                          ).toFixed(
                            2
                          )}{" "}
                          MB)
                        </span>
                      </div>

                    )}

                    <p
                      style={{
                        marginTop:
                          "8px",
                        fontSize:
                          "12px",
                        color:
                          "#6b7280",
                      }}
                    >
                      💡 Only upload PDFs
                      that you own or have
                      permission to share.
                    </p>
                  </>

                )}

              {/* Existing PDF during edit */}

              {editingResource &&
                (
                  editingResource.sourceType ===
                    "pdf" ||
                  editingResource.type ===
                    "PDF"
                ) && (

                  <div
                    style={{
                      padding:
                        "12px",
                      marginTop:
                        "8px",
                      marginBottom:
                        "15px",
                      border:
                        "1px solid #d1d5db",
                      borderRadius:
                        "8px",
                      background:
                        "#f9fafb",
                    }}
                  >
                    📄 This resource is
                    an uploaded PDF.

                    <br />

                    <a
                      href={
                        editingResource.link
                      }
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display:
                          "inline-block",
                        marginTop:
                          "8px",
                      }}
                    >
                      Open current PDF →
                    </a>

                  </div>

                )}

              {/* Logged in user */}

              <div className="logged-in-user">

                <span>
                  Uploading as
                </span>

                <strong>
                  {user?.name ||
                    "Student"}
                </strong>

              </div>

              {/* Modal Actions */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={
                    closeForm
                  }
                  disabled={
                    resourceUploading
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={
                    resourceUploading
                  }
                >
                  {resourceUploading
                    ? "Uploading..."
                    : editingResource
                    ? "Save Changes"
                    : resourceSourceType ===
                      "pdf"
                    ? "📄 Upload PDF"
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