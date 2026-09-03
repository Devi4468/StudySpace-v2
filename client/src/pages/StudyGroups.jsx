import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import BackButton from "../components/BackButton";
import apiRequest from "../services/api";

function StudyGroups({ setCurrentPage }) {
  const { user } = useAuth();

  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All");

  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingGroup, setEditingGroup] =
    useState(null);

  const [viewingMembers, setViewingMembers] =
    useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    subject: "",
    maxMembers: 10,
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
  // Fetch Groups
  // =========================

  const fetchGroups = async () => {
    try {
      const data = await apiRequest("/groups");

      setGroups(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "Error fetching study groups:",
        error
      );

      alert(
        error.message ||
          "Could not load study groups"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

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
  // Open Create Form
  // =========================

  const openCreateForm = () => {
    setEditingGroup(null);

    setFormData({
      name: "",
      description: "",
      subject: "",
      maxMembers: 10,
    });

    setShowForm(true);
  };

  // =========================
  // Open Edit Form
  // =========================

  const openEditForm = (group) => {
    setEditingGroup(group);

    setFormData({
      name: group.name,
      description: group.description,
      subject: group.subject,
      maxMembers: group.maxMembers,
    });

    setShowForm(true);
  };

  // =========================
  // Close Form
  // =========================

  const closeForm = () => {
    setShowForm(false);
    setEditingGroup(null);

    setFormData({
      name: "",
      description: "",
      subject: "",
      maxMembers: 10,
    });
  };

  // =========================
  // Create / Update Group
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const requestData = {
        name: formData.name,
        description: formData.description,
        subject: formData.subject,
        maxMembers: Number(
          formData.maxMembers
        ),
      };

      let data;

      if (editingGroup) {
        data = await apiRequest(
          `/groups/${editingGroup._id}`,
          {
            method: "PUT",
            body: JSON.stringify(
              requestData
            ),
          }
        );

        setGroups(
          (currentGroups) =>
            currentGroups.map(
              (group) =>
                group._id === data._id
                  ? data
                  : group
            )
        );
      } else {
        data = await apiRequest(
          "/groups",
          {
            method: "POST",
            body: JSON.stringify(
              requestData
            ),
          }
        );

        setGroups(
          (currentGroups) => [
            data,
            ...currentGroups,
          ]
        );
      }

      closeForm();
    } catch (error) {
      console.error(
        "Error saving study group:",
        error
      );

      alert(
        error.message ||
          "Could not save study group"
      );
    }
  };

  // =========================
  // Join Group
  // =========================

  const handleJoinGroup = async (id) => {
    try {
      const data = await apiRequest(
        `/groups/${id}/join`,
        {
          method: "POST",
        }
      );

      setGroups(
        (currentGroups) =>
          currentGroups.map(
            (group) =>
              group._id === data._id
                ? data
                : group
          )
      );

      if (
        viewingMembers &&
        viewingMembers._id === data._id
      ) {
        setViewingMembers(data);
      }
    } catch (error) {
      console.error(
        "Error joining study group:",
        error
      );

      alert(
        error.message ||
          "Could not join group"
      );
    }
  };

  // =========================
  // Leave Group
  // =========================

  const handleLeaveGroup = async (id) => {
    try {
      const data = await apiRequest(
        `/groups/${id}/leave`,
        {
          method: "POST",
        }
      );

      setGroups(
        (currentGroups) =>
          currentGroups.map(
            (group) =>
              group._id === data._id
                ? data
                : group
          )
      );

      if (
        viewingMembers &&
        viewingMembers._id === data._id
      ) {
        setViewingMembers(data);
      }
    } catch (error) {
      console.error(
        "Error leaving study group:",
        error
      );

      alert(
        error.message ||
          "Could not leave group"
      );
    }
  };

  // =========================
  // Delete Group
  // =========================

  const handleDeleteGroup = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this study group?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await apiRequest(
        `/groups/${id}`,
        {
          method: "DELETE",
        }
      );

      setGroups(
        (currentGroups) =>
          currentGroups.filter(
            (group) =>
              group._id !== id
          )
      );

      if (
        viewingMembers &&
        viewingMembers._id === id
      ) {
        setViewingMembers(null);
      }
    } catch (error) {
      console.error(
        "Error deleting study group:",
        error
      );

      alert(
        error.message ||
          "Could not delete study group"
      );
    }
  };

  // =========================
  // Search + Filter
  // =========================

  const filteredGroups =
    groups.filter((group) => {
      const searchText =
        search.toLowerCase();

      const matchesSearch =
        group.name
          .toLowerCase()
          .includes(searchText) ||
        group.description
          .toLowerCase()
          .includes(searchText) ||
        group.subject
          .toLowerCase()
          .includes(searchText);

      const matchesSubject =
        subject === "All" ||
        group.subject === subject;

      return (
        matchesSearch &&
        matchesSubject
      );
    });

  return (
    <div className="groups-page">

      <BackButton
        setCurrentPage={setCurrentPage}
      />

      {/* =========================
          Header
      ========================= */}

      <div className="groups-header">

        <div>

          <p className="page-label">
            COLLABORATIVE LEARNING
          </p>

          <h1>
            Study Groups
          </h1>

          <p>
            Find students who are learning
            together and join a study group.
          </p>

        </div>

        <button
          className="create-group-btn"
          onClick={openCreateForm}
        >
          + Create Group
        </button>

      </div>

      {/* =========================
          Search
      ========================= */}

      <div className="group-search">

        <span>
          🔎
        </span>

        <input
          type="text"
          placeholder="Search study groups..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* =========================
          Subject Filters
      ========================= */}

      <div className="group-category-section">

        <h3>
          Browse by subject
        </h3>

        <div className="category-list">

          {subjects.map((item) => (

            <button
              key={item}
              className={
                subject === item
                  ? "category-btn active"
                  : "category-btn"
              }
              onClick={() =>
                setSubject(item)
              }
            >
              {item}
            </button>

          ))}

        </div>

      </div>

      {/* =========================
          Heading
      ========================= */}

      <div className="resource-heading">

        <h2>
          Available Study Groups
        </h2>

        <span>
          {filteredGroups.length} groups
        </span>

      </div>

      {/* =========================
          Groups
      ========================= */}

      {loading ? (

        <div className="no-results">

          <div>
            ⏳
          </div>

          <h3>
            Loading study groups...
          </h3>

        </div>

      ) : filteredGroups.length > 0 ? (

        <div className="group-grid">

          {filteredGroups.map(
            (group) => {

              const memberCount =
                group.members?.length ||
                0;

              const isFull =
                memberCount >=
                group.maxMembers;

              // members is now an array of User objects
              const isMember =
                group.members?.some(
                  (member) =>
                    member._id ===
                    user?._id ||
                    member.email ===
                    user?.email
                );

              // createdBy is now a User object
              const isCreator =
                group.createdBy?._id ===
                  user?._id ||
                group.createdBy?.email ===
                  user?.email;

              return (

                <div
                  className="group-card"
                  key={group._id}
                >

                  <div className="group-card-top">

                    <div className="group-icon">
                      👥
                    </div>

                    <span className="group-subject">
                      {group.subject}
                    </span>

                  </div>

                  <h3>
                    {group.name}
                  </h3>

                  <p>
                    {group.description}
                  </p>

                  <div className="group-info">

                    <span>
                      👥 {memberCount}/
                      {group.maxMembers}{" "}
                      members
                    </span>

                    <span>
                      By{" "}
                      {group.createdBy?.name ||
                        "Student"}
                    </span>

                  </div>

                  {/* View Members */}

                  <button
                    type="button"
                    className="view-members-btn"
                    onClick={() =>
                      setViewingMembers(
                        group
                      )
                    }
                  >
                    👥 View Members
                  </button>

                  {/* Join / Leave */}

                  {isMember ? (

                    <button
                      type="button"
                      className="leave-group-btn"
                      onClick={() =>
                        handleLeaveGroup(
                          group._id
                        )
                      }
                    >
                      Leave Group
                    </button>

                  ) : (

                    <button
                      type="button"
                      className="join-group-btn"
                      disabled={isFull}
                      onClick={() =>
                        handleJoinGroup(
                          group._id
                        )
                      }
                    >
                      {isFull
                        ? "Group Full"
                        : "Join Group →"}
                    </button>

                  )}

                  {/* Creator Actions */}

                  {isCreator && (

                    <div className="group-actions">

                      <button
                        type="button"
                        className="edit-group-btn"
                        onClick={() =>
                          openEditForm(
                            group
                          )
                        }
                      >
                        ✏️ Edit
                      </button>

                      <button
                        type="button"
                        className="delete-group-btn"
                        onClick={() =>
                          handleDeleteGroup(
                            group._id
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
            👥
          </div>

          <h3>
            No study groups yet
          </h3>

          <p>
            Create the first study group
            and start learning together.
          </p>

        </div>

      )}

      {/* =========================
          Create / Edit Modal
      ========================= */}

      {showForm && (

        <div className="modal-overlay">

          <div className="resource-modal">

            <div className="modal-header">

              <div>

                <h2>
                  {editingGroup
                    ? "Edit Study Group"
                    : "Create Study Group"}
                </h2>

                <p>
                  {editingGroup
                    ? "Update your study group details."
                    : "Create a group and invite other students to learn together."}
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
                Group Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Eg: Python DSA Beginners"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <label>
                Subject
              </label>

              <input
                type="text"
                name="subject"
                list="group-subject-options"
                placeholder="Eg: Python, AWS, Cloud Computing"
                value={formData.subject}
                onChange={handleChange}
                required
              />

              <datalist id="group-subject-options">

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
                placeholder="What will your group study?"
                rows="4"
                value={
                  formData.description
                }
                onChange={handleChange}
                required
              />

              <label>
                Maximum Members
              </label>

              <input
                type="number"
                name="maxMembers"
                min="2"
                max="100"
                value={
                  formData.maxMembers
                }
                onChange={handleChange}
                required
              />

              <div className="logged-in-user">

                <span>
                  Creating as
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
                  {editingGroup
                    ? "Save Changes"
                    : "Create Group"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =========================
          Members Modal
      ========================= */}

      {viewingMembers && (

        <div className="modal-overlay">

          <div className="members-modal">

            <div className="modal-header">

              <div>

                <h2>
                  {viewingMembers.name}
                </h2>

                <p>
                  {viewingMembers.members
                    ?.length || 0}{" "}
                  /{" "}
                  {viewingMembers.maxMembers}{" "}
                  members
                </p>

              </div>

              <button
                type="button"
                className="close-btn"
                onClick={() =>
                  setViewingMembers(
                    null
                  )
                }
              >
                ✕
              </button>

            </div>

            <div className="members-list">

              {viewingMembers.members &&
              viewingMembers.members.length >
                0 ? (

                viewingMembers.members.map(
                  (member) => (

                    <div
                      className="member-item"
                      key={member._id}
                    >

                      <div className="member-avatar">
                        {member.name
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>

                      <span>
                        {member.name}
                      </span>

                    </div>

                  )
                )

              ) : (

                <div className="empty-members">

                  <div>
                    👥
                  </div>

                  <p>
                    No members have joined
                    yet.
                  </p>

                </div>

              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default StudyGroups;