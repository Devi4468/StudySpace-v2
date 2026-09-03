import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import BackButton from "../components/BackButton";
import apiRequest from "../services/api";

function Profile({ setCurrentPage }) {
  const { user } = useAuth();

  const [resources, setResources] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [groups, setGroups] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchProfileData = async () => {
    try {
      const [
        resourcesData,
        questionsData,
        groupsData,
      ] = await Promise.all([
        apiRequest("/resources"),
        apiRequest("/questions"),
        apiRequest("/groups"),
      ]);

      setResources(
        Array.isArray(resourcesData)
          ? resourcesData
          : []
      );

      setQuestions(
        Array.isArray(questionsData)
          ? questionsData
          : []
      );

      setGroups(
        Array.isArray(groupsData)
          ? groupsData
          : []
      );
    } catch (error) {
      console.error(
        "Error fetching profile data:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const userName =
    user?.name || "Student";

  const userEmail =
    user?.email || "No email available";

  // uploadedBy is now a populated User object
  const userResources =
    resources.filter(
      (resource) =>
        resource.uploadedBy?.name ===
        userName
    );

  // author is now a populated User object
  const userQuestions =
    questions.filter(
      (question) =>
        question.author?.name ===
        userName
    );

  // createdBy is now a populated User object
  const createdGroups =
    groups.filter(
      (group) =>
        group.createdBy?.name ===
        userName
    );

  // members is now an array of populated User objects
  const joinedGroups =
    groups.filter((group) =>
      group.members?.some(
        (member) =>
          member.name === userName
      )
    );

  const totalGroups =
    joinedGroups.length;

  const recentResources =
    userResources.slice(0, 3);

  const recentQuestions =
    userQuestions.slice(0, 3);

  return (
    <div className="profile-page">

      <BackButton
        setCurrentPage={setCurrentPage}
      />

      <div className="profile-header">

        <div>

          <p className="page-label">
            MY ACCOUNT
          </p>

          <h1>Profile</h1>

          <p>
            View your StudySpace activity
            and learning contributions.
          </p>

        </div>

      </div>

      <section className="profile-card">

        <div className="profile-main">

          <div className="profile-avatar-large">
            {userName
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="profile-details">

            <h2>
              {userName}
            </h2>

            <p>
              {userEmail}
            </p>

            <span className="profile-role">
              StudySpace Student
            </span>

          </div>

        </div>

      </section>

      <section className="profile-stats">

        <div className="profile-stat-card">

          <div className="profile-stat-icon">
            📚
          </div>

          <div>

            <span>
              Resources
            </span>

            <strong>
              {loading
                ? "..."
                : userResources.length}
            </strong>

          </div>

        </div>

        <div className="profile-stat-card">

          <div className="profile-stat-icon">
            ❓
          </div>

          <div>

            <span>
              Questions
            </span>

            <strong>
              {loading
                ? "..."
                : userQuestions.length}
            </strong>

          </div>

        </div>

        <div className="profile-stat-card">

          <div className="profile-stat-icon">
            👥
          </div>

          <div>

            <span>
              Groups Joined
            </span>

            <strong>
              {loading
                ? "..."
                : totalGroups}
            </strong>

          </div>

        </div>

        <div className="profile-stat-card">

          <div className="profile-stat-icon">
            ⭐
          </div>

          <div>

            <span>
              Groups Created
            </span>

            <strong>
              {loading
                ? "..."
                : createdGroups.length}
            </strong>

          </div>

        </div>

      </section>

      <section className="profile-content-grid">

        <div className="profile-section-card">

          <div className="profile-section-header">

            <div>

              <h2>
                My Resources
              </h2>

              <p>
                Resources you have shared.
              </p>

            </div>

            <span>
              {userResources.length}
            </span>

          </div>

          {loading ? (

            <div className="profile-empty">
              Loading...
            </div>

          ) : recentResources.length > 0 ? (

            <div className="profile-list">

              {recentResources.map(
                (resource) => (

                  <div
                    className="profile-list-item"
                    key={resource._id}
                  >

                    <div className="profile-list-icon">
                      📄
                    </div>

                    <div>

                      <h3>
                        {resource.title}
                      </h3>

                      <p>
                        {resource.subject} •{" "}
                        {resource.type}
                      </p>

                    </div>

                  </div>

                )
              )}

            </div>

          ) : (

            <div className="profile-empty">

              <div>
                📚
              </div>

              <p>
                You haven't shared any
                resources yet.
              </p>

            </div>

          )}

        </div>

        <div className="profile-section-card">

          <div className="profile-section-header">

            <div>

              <h2>
                My Questions
              </h2>

              <p>
                Questions you have asked.
              </p>

            </div>

            <span>
              {userQuestions.length}
            </span>

          </div>

          {loading ? (

            <div className="profile-empty">
              Loading...
            </div>

          ) : recentQuestions.length > 0 ? (

            <div className="profile-list">

              {recentQuestions.map(
                (question) => (

                  <div
                    className="profile-list-item"
                    key={question._id}
                  >

                    <div className="profile-list-icon">
                      ❓
                    </div>

                    <div>

                      <h3>
                        {question.title}
                      </h3>

                      <p>
                        {question.subject}
                      </p>

                    </div>

                  </div>

                )
              )}

            </div>

          ) : (

            <div className="profile-empty">

              <div>
                ❓
              </div>

              <p>
                You haven't asked any
                questions yet.
              </p>

            </div>

          )}

        </div>

      </section>

      <section className="profile-section-card profile-groups-card">

        <div className="profile-section-header">

          <div>

            <h2>
              My Study Groups
            </h2>

            <p>
              Groups you created or joined.
            </p>

          </div>

          <span>
            {joinedGroups.length}
          </span>

        </div>

        {loading ? (

          <div className="profile-empty">
            Loading...
          </div>

        ) : joinedGroups.length > 0 ? (

          <div className="profile-group-list">

            {joinedGroups
              .slice(0, 5)
              .map((group) => {

                const isCreator =
                  group.createdBy?.name ===
                  userName;

                return (
                  <div
                    className="profile-group-item"
                    key={group._id}
                  >

                    <div className="profile-list-icon">
                      👥
                    </div>

                    <div className="profile-group-info">

                      <h3>
                        {group.name}
                      </h3>

                      <p>
                        {group.subject} •{" "}
                        {group.members?.length ||
                          0}{" "}
                        /{" "}
                        {group.maxMembers}{" "}
                        members
                      </p>

                    </div>

                    <span
                      className={
                        isCreator
                          ? "group-owner-badge"
                          : "group-member-badge"
                      }
                    >
                      {isCreator
                        ? "Creator"
                        : "Member"}
                    </span>

                  </div>
                );
              })}

          </div>

        ) : (

          <div className="profile-empty">

            <div>
              👥
            </div>

            <p>
              You haven't joined any study
              groups yet.
            </p>

          </div>

        )}

      </section>

    </div>
  );
}

export default Profile;