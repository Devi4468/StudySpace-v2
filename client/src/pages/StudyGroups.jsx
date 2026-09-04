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
  const [editingGroup, setEditingGroup] = useState(null);

  const [viewingMembers, setViewingMembers] = useState(null);

  // =========================
  // Discussion State
  // =========================

  const [viewingDiscussion, setViewingDiscussion] =
    useState(null);

  const [groupPosts, setGroupPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);

  const [postContent, setPostContent] = useState("");
  const [editingPost, setEditingPost] = useState(null);

  // =========================
  // Reply State
  // =========================

  const [groupReplies, setGroupReplies] = useState([]);
  const [repliesLoading, setRepliesLoading] = useState(false);

  const [replyContent, setReplyContent] = useState({});
  const [editingReply, setEditingReply] = useState(null);

  const [editingReplyContent, setEditingReplyContent] =
    useState("");

  const [showReplies, setShowReplies] = useState({});

  // =========================
  // Group Question State
  // =========================

  const [groupQuestions, setGroupQuestions] =
    useState([]);

  const [questionsLoading, setQuestionsLoading] =
    useState(false);

  const [showQuestions, setShowQuestions] =
    useState(false);

  const [questionTitle, setQuestionTitle] =
    useState("");

  const [questionContent, setQuestionContent] =
    useState("");

  const [editingQuestion, setEditingQuestion] =
    useState(null);

  const [editingQuestionTitle, setEditingQuestionTitle] =
    useState("");

  const [editingQuestionContent, setEditingQuestionContent] =
    useState("");

  const [answerContent, setAnswerContent] =
    useState({});

  const [editingAnswer, setEditingAnswer] =
    useState(null);

  const [editingAnswerContent, setEditingAnswerContent] =
    useState("");

  const [showAnswers, setShowAnswers] =
    useState({});

  // =========================
  // Group Resource State
  // =========================

  const [groupResources, setGroupResources] =
    useState([]);

  const [resourcesLoading, setResourcesLoading] =
    useState(false);

  const [showResources, setShowResources] =
    useState(false);

  const [resourceTitle, setResourceTitle] =
    useState("");

  const [resourceDescription, setResourceDescription] =
    useState("");

  const [resourceSubject, setResourceSubject] =
    useState("");

  const [resourceType, setResourceType] =
    useState("Website");

  const [resourceUrl, setResourceUrl] =
    useState("");

  // Link / PDF selection
  const [resourceSourceType, setResourceSourceType] =
    useState("link");

  // Selected PDF file
  const [resourceFile, setResourceFile] =
    useState(null);

  // PDF upload loading state
  const [resourceUploading, setResourceUploading] =
    useState(false);

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

      if (
        viewingDiscussion &&
        viewingDiscussion._id === data._id
      ) {
        setViewingDiscussion(data);
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

      if (
        viewingDiscussion &&
        viewingDiscussion._id === data._id
      ) {
        setViewingDiscussion(data);
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

      if (
        viewingDiscussion &&
        viewingDiscussion._id === id
      ) {
        closeDiscussion();
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
  // Open Discussion
  // =========================

  const openDiscussion = async (group) => {
    setViewingDiscussion(group);

    setGroupPosts([]);
    setGroupReplies([]);
    setGroupQuestions([]);
    setGroupResources([]);

    setPostContent("");
    setEditingPost(null);

    setReplyContent({});
    setEditingReply(null);
    setEditingReplyContent("");
    setShowReplies({});

    setQuestionTitle("");
    setQuestionContent("");
    setEditingQuestion(null);
    setEditingQuestionTitle("");
    setEditingQuestionContent("");
    setAnswerContent({});
    setEditingAnswer(null);
    setEditingAnswerContent("");
    setShowAnswers({});

    setResourceTitle("");
    setResourceDescription("");
    setResourceSubject(group.subject || "");
    setResourceType("Website");
    setResourceUrl("");
    setResourceSourceType("link");
    setResourceFile(null);
    setResourceUploading(false);

    setShowQuestions(false);
    setShowResources(false);

    setPostsLoading(true);
    setRepliesLoading(true);
    setQuestionsLoading(true);
    setResourcesLoading(true);

    try {
      const [
        postsData,
        repliesData,
        questionsData,
        resourcesData,
      ] = await Promise.all([
        apiRequest(
          `/group-posts/group/${group._id}`
        ),
        apiRequest(
          `/group-replies/group/${group._id}`
        ),
        apiRequest(
          `/group-questions/group/${group._id}`
        ),
        apiRequest(
          `/group-resources/group/${group._id}`
        ),
      ]);

      setGroupPosts(
        Array.isArray(postsData)
          ? postsData
          : []
      );

      setGroupReplies(
        Array.isArray(repliesData)
          ? repliesData
          : []
      );

      setGroupQuestions(
        Array.isArray(questionsData)
          ? questionsData
          : []
      );

      setGroupResources(
        Array.isArray(resourcesData)
          ? resourcesData
          : []
      );
    } catch (error) {
      console.error(
        "Error fetching group content:",
        error
      );

      alert(
        error.message ||
          "Could not load group content"
      );
    } finally {
      setPostsLoading(false);
      setRepliesLoading(false);
      setQuestionsLoading(false);
      setResourcesLoading(false);
    }
  };

  // =========================
  // Close Discussion
  // =========================

  const closeDiscussion = () => {
    setViewingDiscussion(null);

    setGroupPosts([]);
    setGroupReplies([]);
    setGroupQuestions([]);
    setGroupResources([]);

    setPostContent("");
    setEditingPost(null);

    setReplyContent({});
    setEditingReply(null);
    setEditingReplyContent("");
    setShowReplies({});

    setQuestionTitle("");
    setQuestionContent("");
    setEditingQuestion(null);
    setEditingQuestionTitle("");
    setEditingQuestionContent("");
    setAnswerContent({});
    setEditingAnswer(null);
    setEditingAnswerContent("");
    setShowAnswers({});

    setResourceTitle("");
    setResourceDescription("");
    setResourceSubject("");
    setResourceType("Website");
    setResourceUrl("");
    setResourceSourceType("link");
    setResourceFile(null);
    setResourceUploading(false);

    setShowQuestions(false);
    setShowResources(false);
  };

  // =========================
  // Create / Update Post
  // =========================

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (!postContent.trim()) {
      return;
    }

    try {
      let data;

      if (editingPost) {
        data = await apiRequest(
          `/group-posts/${editingPost._id}`,
          {
            method: "PUT",
            body: JSON.stringify({
              content:
                postContent.trim(),
            }),
          }
        );

        setGroupPosts(
          (currentPosts) =>
            currentPosts.map(
              (post) =>
                post._id === data._id
                  ? data
                  : post
            )
        );
      } else {
        data = await apiRequest(
          `/group-posts/group/${viewingDiscussion._id}`,
          {
            method: "POST",
            body: JSON.stringify({
              content:
                postContent.trim(),
            }),
          }
        );

        setGroupPosts(
          (currentPosts) => [
            ...currentPosts,
            data,
          ]
        );
      }

      setPostContent("");
      setEditingPost(null);
    } catch (error) {
      console.error(
        "Error saving discussion post:",
        error
      );

      alert(
        error.message ||
          "Could not save post"
      );
    }
  };

  // =========================
  // Start Editing Post
  // =========================

  const startEditingPost = (post) => {
    setEditingPost(post);
    setPostContent(post.content);
  };

  // =========================
  // Cancel Post Edit
  // =========================

  const cancelPostEdit = () => {
    setEditingPost(null);
    setPostContent("");
  };

  // =========================
  // Delete Post
  // =========================

  const handleDeletePost = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this post?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await apiRequest(
        `/group-posts/${id}`,
        {
          method: "DELETE",
        }
      );

      setGroupPosts(
        (currentPosts) =>
          currentPosts.filter(
            (post) =>
              post._id !== id
          )
      );

      setGroupReplies(
        (currentReplies) =>
          currentReplies.filter(
            (reply) =>
              reply.post !== id
          )
      );
    } catch (error) {
      console.error(
        "Error deleting discussion post:",
        error
      );

      alert(
        error.message ||
          "Could not delete post"
      );
    }
  };

  // =========================
  // Toggle Replies
  // =========================

  const toggleReplies = (postId) => {
    setShowReplies(
      (current) => ({
        ...current,
        [postId]: !current[postId],
      })
    );
  };

  // =========================
  // Reply Input Change
  // =========================

  const handleReplyChange = (
    postId,
    value
  ) => {
    setReplyContent(
      (current) => ({
        ...current,
        [postId]: value,
      })
    );
  };

  // =========================
  // Create Reply
  // =========================

  const handleReplySubmit = async (
    e,
    postId
  ) => {
    e.preventDefault();

    const content =
      replyContent[postId]?.trim();

    if (!content) {
      return;
    }

    try {
      const data = await apiRequest(
        `/group-replies/post/${postId}`,
        {
          method: "POST",
          body: JSON.stringify({
            content,
          }),
        }
      );

      setGroupReplies(
        (currentReplies) => [
          ...currentReplies,
          data,
        ]
      );

      setReplyContent(
        (current) => ({
          ...current,
          [postId]: "",
        })
      );

      setShowReplies(
        (current) => ({
          ...current,
          [postId]: true,
        })
      );
    } catch (error) {
      console.error(
        "Error creating reply:",
        error
      );

      alert(
        error.message ||
          "Could not add reply"
      );
    }
  };

  // =========================
  // Start Editing Reply
  // =========================

  const startEditingReply = (reply) => {
    setEditingReply(reply);
    setEditingReplyContent(
      reply.content
    );
  };

  // =========================
  // Cancel Reply Edit
  // =========================

  const cancelReplyEdit = () => {
    setEditingReply(null);
    setEditingReplyContent("");
  };

  // =========================
  // Save Edited Reply
  // =========================

  const handleReplyEditSubmit = async (
    e
  ) => {
    e.preventDefault();

    if (!editingReplyContent.trim()) {
      return;
    }

    try {
      const data = await apiRequest(
        `/group-replies/${editingReply._id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            content:
              editingReplyContent.trim(),
          }),
        }
      );

      setGroupReplies(
        (currentReplies) =>
          currentReplies.map(
            (reply) =>
              reply._id === data._id
                ? data
                : reply
          )
      );

      cancelReplyEdit();
    } catch (error) {
      console.error(
        "Error editing reply:",
        error
      );

      alert(
        error.message ||
          "Could not edit reply"
      );
    }
  };

  // =========================
  // Delete Reply
  // =========================

  const handleDeleteReply = async (
    id
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this reply?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await apiRequest(
        `/group-replies/${id}`,
        {
          method: "DELETE",
        }
      );

      setGroupReplies(
        (currentReplies) =>
          currentReplies.filter(
            (reply) =>
              reply._id !== id
          )
      );
    } catch (error) {
      console.error(
        "Error deleting reply:",
        error
      );

      alert(
        error.message ||
          "Could not delete reply"
      );
    }
  };

  // =========================
  // Toggle Questions
  // =========================

  const toggleQuestions = () => {
    setShowQuestions(
      (current) => !current
    );

    setShowResources(false);
  };

  // =========================
  // Toggle Resources
  // =========================

  const toggleResources = () => {
    setShowResources(
      (current) => !current
    );

    setShowQuestions(false);
  };

  // =========================
  // Create Group Question
  // =========================

  const handleQuestionSubmit = async (
    e
  ) => {
    e.preventDefault();

    if (
      !questionTitle.trim() ||
      !questionContent.trim()
    ) {
      return;
    }

    try {
      const data = await apiRequest(
        `/group-questions/group/${viewingDiscussion._id}`,
        {
          method: "POST",
          body: JSON.stringify({
            title:
              questionTitle.trim(),
            content:
              questionContent.trim(),
          }),
        }
      );

      setGroupQuestions(
        (currentQuestions) => [
          data,
          ...currentQuestions,
        ]
      );

      setQuestionTitle("");
      setQuestionContent("");
    } catch (error) {
      console.error(
        "Error creating group question:",
        error
      );

      alert(
        error.message ||
          "Could not ask question"
      );
    }
  };

  // =========================
  // Start Editing Question
  // =========================

  const startEditingQuestion = (
    question
  ) => {
    setEditingQuestion(question);

    setEditingQuestionTitle(
      question.title
    );

    setEditingQuestionContent(
      question.content
    );
  };

  // =========================
  // Cancel Question Edit
  // =========================

  const cancelQuestionEdit = () => {
    setEditingQuestion(null);
    setEditingQuestionTitle("");
    setEditingQuestionContent("");
  };

  // =========================
  // Save Edited Question
  // =========================

  const handleQuestionEditSubmit =
    async (e) => {
      e.preventDefault();

      if (
        !editingQuestionTitle.trim() ||
        !editingQuestionContent.trim()
      ) {
        return;
      }

      try {
        const data = await apiRequest(
          `/group-questions/${editingQuestion._id}`,
          {
            method: "PUT",
            body: JSON.stringify({
              title:
                editingQuestionTitle.trim(),
              content:
                editingQuestionContent.trim(),
            }),
          }
        );

        setGroupQuestions(
          (currentQuestions) =>
            currentQuestions.map(
              (question) =>
                question._id === data._id
                  ? data
                  : question
            )
        );

        cancelQuestionEdit();
      } catch (error) {
        console.error(
          "Error editing group question:",
          error
        );

        alert(
          error.message ||
            "Could not edit question"
        );
      }
    };

  // =========================
  // Delete Question
  // =========================

  const handleDeleteQuestion = async (
    id
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this question?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await apiRequest(
        `/group-questions/${id}`,
        {
          method: "DELETE",
        }
      );

      setGroupQuestions(
        (currentQuestions) =>
          currentQuestions.filter(
            (question) =>
              question._id !== id
          )
      );
    } catch (error) {
      console.error(
        "Error deleting group question:",
        error
      );

      alert(
        error.message ||
          "Could not delete question"
      );
    }
  };

  // =========================
  // Toggle Answers
  // =========================

  const toggleAnswers = (questionId) => {
    setShowAnswers(
      (current) => ({
        ...current,
        [questionId]:
          !current[questionId],
      })
    );
  };

  // =========================
  // Answer Input Change
  // =========================

  const handleAnswerChange = (
    questionId,
    value
  ) => {
    setAnswerContent(
      (current) => ({
        ...current,
        [questionId]: value,
      })
    );
  };

  // =========================
  // Add Answer
  // =========================

  const handleAnswerSubmit = async (
    e,
    questionId
  ) => {
    e.preventDefault();

    const content =
      answerContent[questionId]?.trim();

    if (!content) {
      return;
    }

    try {
      const data = await apiRequest(
        `/group-questions/${questionId}/answers`,
        {
          method: "POST",
          body: JSON.stringify({
            content,
          }),
        }
      );

      setGroupQuestions(
        (currentQuestions) =>
          currentQuestions.map(
            (question) =>
              question._id ===
              data._id
                ? data
                : question
          )
      );

      setAnswerContent(
        (current) => ({
          ...current,
          [questionId]: "",
        })
      );

      setShowAnswers(
        (current) => ({
          ...current,
          [questionId]: true,
        })
      );
    } catch (error) {
      console.error(
        "Error adding answer:",
        error
      );

      alert(
        error.message ||
          "Could not add answer"
      );
    }
  };

  // =========================
  // Start Editing Answer
  // =========================

  const startEditingAnswer = (
    questionId,
    answer
  ) => {
    setEditingAnswer({
      questionId,
      answerId: answer._id,
    });

    setEditingAnswerContent(
      answer.content
    );
  };

  // =========================
  // Cancel Answer Edit
  // =========================

  const cancelAnswerEdit = () => {
    setEditingAnswer(null);
    setEditingAnswerContent("");
  };

  // =========================
  // Save Edited Answer
  // =========================

  const handleAnswerEditSubmit =
    async (e) => {
      e.preventDefault();

      if (!editingAnswerContent.trim()) {
        return;
      }

      try {
        const data = await apiRequest(
          `/group-questions/${editingAnswer.questionId}/answers/${editingAnswer.answerId}`,
          {
            method: "PUT",
            body: JSON.stringify({
              content:
                editingAnswerContent.trim(),
            }),
          }
        );

        setGroupQuestions(
          (currentQuestions) =>
            currentQuestions.map(
              (question) =>
                question._id === data._id
                  ? data
                  : question
            )
        );

        cancelAnswerEdit();
      } catch (error) {
        console.error(
          "Error editing answer:",
          error
        );

        alert(
          error.message ||
            "Could not edit answer"
        );
      }
    };

  // =========================
  // Delete Answer
  // =========================

  const handleDeleteAnswer = async (
    questionId,
    answerId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this answer?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await apiRequest(
        `/group-questions/${questionId}/answers/${answerId}`,
        {
          method: "DELETE",
        }
      );

      setGroupQuestions(
        (currentQuestions) =>
          currentQuestions.map(
            (question) => {
              if (
                question._id !==
                questionId
              ) {
                return question;
              }

              return {
                ...question,
                answers:
                  question.answers.filter(
                    (answer) =>
                      answer._id !==
                      answerId
                  ),
              };
            }
          )
      );
    } catch (error) {
      console.error(
        "Error deleting answer:",
        error
      );

      alert(
        error.message ||
          "Could not delete answer"
      );
    }
  };

  // =========================
  // Handle Resource Source Change
  // =========================

  const handleResourceSourceChange = (
    sourceType
  ) => {
    setResourceSourceType(sourceType);

    if (sourceType === "link") {
      setResourceFile(null);
    } else {
      setResourceUrl("");
      setResourceType("PDF");
    }
  };

  // =========================
  // Handle PDF Selection
  // =========================

  const handleResourceFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setResourceFile(null);
      return;
    }

    // Check file type
    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      alert(
        "Please select a PDF file only."
      );

      e.target.value = "";
      setResourceFile(null);
      return;
    }

    // Maximum 10 MB
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
  // Create Group Resource
  // =========================

  const handleResourceSubmit = async (
    e
  ) => {
    e.preventDefault();

    if (resourceUploading) {
      return;
    }

    if (
      !resourceTitle.trim() ||
      !resourceSubject.trim()
    ) {
      return;
    }

    // Validate link
    if (
      resourceSourceType === "link" &&
      !resourceUrl.trim()
    ) {
      alert(
        "Please enter a resource link."
      );

      return;
    }

    // Validate PDF
    if (
      resourceSourceType === "pdf" &&
      !resourceFile
    ) {
      alert(
        "Please select a PDF file."
      );

      return;
    }

    // Final PDF size validation
    if (
      resourceSourceType === "pdf" &&
      resourceFile &&
      resourceFile.size >
        10 * 1024 * 1024
    ) {
      alert(
        "PDF file is too large. Maximum allowed size is 10 MB."
      );

      return;
    }

    try {
      setResourceUploading(true);

      // FormData is required for PDF upload.
      const dataToSend = new FormData();

      dataToSend.append(
        "title",
        resourceTitle.trim()
      );

      dataToSend.append(
        "description",
        resourceDescription.trim()
      );

      dataToSend.append(
        "subject",
        resourceSubject.trim()
      );

      if (
        resourceSourceType === "pdf"
      ) {
        // Backend expects the field name "file".
        dataToSend.append(
          "file",
          resourceFile
        );
      } else {
        // Normal link resource
        dataToSend.append(
          "resourceType",
          resourceType
        );

        dataToSend.append(
          "url",
          resourceUrl.trim()
        );
      }

      const data = await apiRequest(
        `/group-resources/group/${viewingDiscussion._id}`,
        {
          method: "POST",
          body: dataToSend,
        }
      );

      // Add new resource to the top
      setGroupResources(
        (currentResources) => [
          data,
          ...currentResources,
        ]
      );

      // Reset form
      setResourceTitle("");
      setResourceDescription("");
      setResourceSubject(
        viewingDiscussion.subject || ""
      );
      setResourceType("Website");
      setResourceUrl("");
      setResourceSourceType("link");
      setResourceFile(null);

      // Clear browser file input
      const fileInput =
        document.getElementById(
          "group-resource-pdf"
        );

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error(
        "Error sharing group resource:",
        error
      );

      alert(
        error.message ||
          "Could not share resource"
      );
    } finally {
      setResourceUploading(false);
    }
  };

  // =========================
  // Delete Group Resource
  // =========================

  const handleDeleteResource = async (
    id
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this shared resource?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await apiRequest(
        `/group-resources/${id}`,
        {
          method: "DELETE",
        }
      );

      setGroupResources(
        (currentResources) =>
          currentResources.filter(
            (resource) =>
              resource._id !== id
          )
      );
    } catch (error) {
      console.error(
        "Error deleting group resource:",
        error
      );

      alert(
        error.message ||
          "Could not delete resource"
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

              const isMember =
                group.members?.some(
                  (member) =>
                    member._id ===
                      user?._id ||
                    member.email ===
                      user?.email
                );

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

                  {/* Discussion */}

                  {isMember && (

                    <button
                      type="button"
                      className="group-discussion-btn"
                      onClick={() =>
                        openDiscussion(group)
                      }
                    >
                      💬 Discussion
                    </button>

                  )}

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

      {/* =========================
          Discussion Modal
      ========================= */}

      {viewingDiscussion && (

        <div className="modal-overlay">

          <div className="discussion-modal">

            <div className="modal-header">

              <div>

                <p className="page-label">
                  GROUP COLLABORATION
                </p>

                <h2>
                  {viewingDiscussion.name}
                </h2>

                <p>
                  Discuss topics, ask doubts
                  and learn together.
                </p>

              </div>

              <button
                type="button"
                className="close-btn"
                onClick={closeDiscussion}
              >
                ✕
              </button>

            </div>

            {/* =========================
                Discussion / Questions / Resources Tabs
            ========================= */}

            <div className="group-content-tabs">

              <button
                type="button"
                className={
                  !showQuestions &&
                  !showResources
                    ? "group-content-tab active"
                    : "group-content-tab"
                }
                onClick={() => {
                  setShowQuestions(false);
                  setShowResources(false);
                }}
              >
                💬 Discussion
              </button>

              <button
                type="button"
                className={
                  showQuestions
                    ? "group-content-tab active"
                    : "group-content-tab"
                }
                onClick={toggleQuestions}
              >
                ❓ Questions
              </button>

              <button
                type="button"
                className={
                  showResources
                    ? "group-content-tab active"
                    : "group-content-tab"
                }
                onClick={toggleResources}
              >
                📚 Resources
              </button>

            </div>

            {/* =========================
                Discussion Content
            ========================= */}

            {!showQuestions &&
              !showResources && (

              <div className="discussion-content">

                <form
                  className="discussion-post-form"
                  onSubmit={handlePostSubmit}
                >

                  <textarea
                    placeholder={
                      editingPost
                        ? "Edit your post..."
                        : "Share something with your study group..."
                    }
                    rows="3"
                    value={postContent}
                    onChange={(e) =>
                      setPostContent(
                        e.target.value
                      )
                    }
                    maxLength={2000}
                  />

                  <div className="discussion-form-footer">

                    <span>
                      {postContent.length}/2000
                    </span>

                    <div>

                      {editingPost && (

                        <button
                          type="button"
                          className="cancel-post-btn"
                          onClick={
                            cancelPostEdit
                          }
                        >
                          Cancel
                        </button>

                      )}

                      <button
                        type="submit"
                        className="submit-post-btn"
                        disabled={
                          !postContent.trim()
                        }
                      >
                        {editingPost
                          ? "Save Post"
                          : "Post"}
                      </button>

                    </div>

                  </div>

                </form>

                <div className="discussion-posts">

                  {postsLoading ? (

                    <div className="discussion-empty">

                      <div>
                        ⏳
                      </div>

                      <h3>
                        Loading discussion...
                      </h3>

                    </div>

                  ) : groupPosts.length >
                    0 ? (

                    groupPosts.map(
                      (post) => {

                        const isAuthor =
                          post.author?._id ===
                            user?._id ||
                          post.author?.email ===
                            user?.email;

                        const postReplies =
                          groupReplies.filter(
                            (reply) =>
                              reply.post ===
                                post._id ||
                              reply.post?._id ===
                                post._id
                          );

                        const isRepliesVisible =
                          showReplies[
                            post._id
                          ];

                        return (

                          <div
                            className="discussion-post-card"
                            key={post._id}
                          >

                            <div className="discussion-post-header">

                              <div className="discussion-author">

                                <div className="discussion-avatar">
                                  {post.author?.name
                                    ?.charAt(0)
                                    .toUpperCase() ||
                                    "S"}
                                </div>

                                <div>

                                  <strong>
                                    {post.author
                                      ?.name ||
                                      "Student"}
                                  </strong>

                                  <span>
                                    {new Date(
                                      post.createdAt
                                    ).toLocaleString()}
                                  </span>

                                </div>

                              </div>

                              {isAuthor && (

                                <div className="discussion-post-actions">

                                  <button
                                    type="button"
                                    onClick={() =>
                                      startEditingPost(
                                        post
                                      )
                                    }
                                  >
                                    ✏️
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeletePost(
                                        post._id
                                      )
                                    }
                                  >
                                    🗑️
                                  </button>

                                </div>

                              )}

                            </div>

                            <p className="discussion-post-content">
                              {post.content}
                            </p>

                            <div className="reply-toggle-row">

                              <button
                                type="button"
                                className="reply-toggle-btn"
                                onClick={() =>
                                  toggleReplies(
                                    post._id
                                  )
                                }
                              >
                                💬{" "}
                                {postReplies.length}{" "}
                                {postReplies.length ===
                                1
                                  ? "Reply"
                                  : "Replies"}{" "}
                                {isRepliesVisible
                                  ? "▲"
                                  : "▼"}
                              </button>

                            </div>

                            {isRepliesVisible && (

                              <div className="replies-section">

                                {repliesLoading ? (

                                  <div className="replies-loading">
                                    Loading replies...
                                  </div>

                                ) : postReplies.length >
                                  0 ? (

                                  <div className="replies-list">

                                    {postReplies.map(
                                      (reply) => {

                                        const isReplyAuthor =
                                          reply.author?._id ===
                                            user?._id ||
                                          reply.author?.email ===
                                            user?.email;

                                        const isEditing =
                                          editingReply?._id ===
                                          reply._id;

                                        return (

                                          <div
                                            className="reply-card"
                                            key={reply._id}
                                          >

                                            <div className="reply-header">

                                              <div className="reply-author">

                                                <div className="reply-avatar">
                                                  {reply.author?.name
                                                    ?.charAt(0)
                                                    .toUpperCase() ||
                                                    "S"}
                                                </div>

                                                <div>

                                                  <strong>
                                                    {reply.author
                                                      ?.name ||
                                                      "Student"}
                                                  </strong>

                                                  <span>
                                                    {new Date(
                                                      reply.createdAt
                                                    ).toLocaleString()}
                                                  </span>

                                                </div>

                                              </div>

                                              {isReplyAuthor &&
                                                !isEditing && (

                                                  <div className="reply-actions">

                                                    <button
                                                      type="button"
                                                      onClick={() =>
                                                        startEditingReply(
                                                          reply
                                                        )
                                                      }
                                                    >
                                                      ✏️
                                                    </button>

                                                    <button
                                                      type="button"
                                                      onClick={() =>
                                                        handleDeleteReply(
                                                          reply._id
                                                        )
                                                      }
                                                    >
                                                      🗑️
                                                    </button>

                                                  </div>

                                                )}

                                            </div>

                                            {isEditing ? (

                                              <form
                                                className="reply-edit-form"
                                                onSubmit={
                                                  handleReplyEditSubmit
                                                }
                                              >

                                                <textarea
                                                  value={
                                                    editingReplyContent
                                                  }
                                                  onChange={(
                                                    e
                                                  ) =>
                                                    setEditingReplyContent(
                                                      e
                                                        .target
                                                        .value
                                                    )
                                                  }
                                                  maxLength={
                                                    1000
                                                  }
                                                  rows="2"
                                                />

                                                <div className="reply-edit-actions">

                                                  <button
                                                    type="button"
                                                    className="cancel-reply-btn"
                                                    onClick={
                                                      cancelReplyEdit
                                                    }
                                                  >
                                                    Cancel
                                                  </button>

                                                  <button
                                                    type="submit"
                                                    className="save-reply-btn"
                                                    disabled={
                                                      !editingReplyContent.trim()
                                                    }
                                                  >
                                                    Save
                                                  </button>

                                                </div>

                                              </form>

                                            ) : (

                                              <p className="reply-content">
                                                {
                                                  reply.content
                                                }
                                              </p>

                                            )}

                                          </div>

                                        );
                                      }
                                    )}

                                  </div>

                                ) : (

                                  <p className="no-replies">
                                    No replies yet. Be the
                                    first to reply.
                                  </p>

                                )}

                                <form
                                  className="reply-form"
                                  onSubmit={(e) =>
                                    handleReplySubmit(
                                      e,
                                      post._id
                                    )
                                  }
                                >

                                  <textarea
                                    placeholder="Write a reply..."
                                    rows="2"
                                    value={
                                      replyContent[
                                        post._id
                                      ] || ""
                                    }
                                    onChange={(e) =>
                                      handleReplyChange(
                                        post._id,
                                        e.target.value
                                      )
                                    }
                                    maxLength={1000}
                                  />

                                  <div className="reply-form-footer">

                                    <span>
                                      {(
                                        replyContent[
                                          post._id
                                        ] || ""
                                      ).length}
                                      /1000
                                    </span>

                                    <button
                                      type="submit"
                                      className="submit-reply-btn"
                                      disabled={
                                        !(
                                          replyContent[
                                            post._id
                                          ] || ""
                                        ).trim()
                                      }
                                    >
                                      Reply
                                    </button>

                                  </div>

                                </form>

                              </div>

                            )}

                          </div>

                        );
                      }
                    )

                  ) : (

                    <div className="discussion-empty">

                      <div>
                        💬
                      </div>

                      <h3>
                        No posts yet
                      </h3>

                      <p>
                        Be the first member to
                        start the discussion.
                      </p>

                    </div>

                  )}

                </div>

              </div>

            )}

            {/* =========================
                Questions Content
            ========================= */}

            {showQuestions && (

              <div className="group-questions-content">

                <form
                  className="group-question-form"
                  onSubmit={
                    handleQuestionSubmit
                  }
                >

                  <div className="question-form-title">

                    <span>
                      ❓
                    </span>

                    <div>

                      <h3>
                        Ask a Question
                      </h3>

                      <p>
                        Share a doubt with your
                        study group.
                      </p>

                    </div>

                  </div>

                  <input
                    type="text"
                    placeholder="Question title, e.g. How does normalization work?"
                    value={questionTitle}
                    onChange={(e) =>
                      setQuestionTitle(
                        e.target.value
                      )
                    }
                    maxLength={200}
                    required
                  />

                  <textarea
                    placeholder="Explain your question or doubt..."
                    rows="4"
                    value={questionContent}
                    onChange={(e) =>
                      setQuestionContent(
                        e.target.value
                      )
                    }
                    maxLength={2000}
                    required
                  />

                  <div className="question-form-footer">

                    <span>
                      {questionContent.length}/2000
                    </span>

                    <button
                      type="submit"
                      className="submit-question-btn"
                      disabled={
                        !questionTitle.trim() ||
                        !questionContent.trim()
                      }
                    >
                      Ask Question
                    </button>

                  </div>

                </form>

                <div className="group-questions-list">

                  {questionsLoading ? (

                    <div className="discussion-empty">

                      <div>
                        ⏳
                      </div>

                      <h3>
                        Loading questions...
                      </h3>

                    </div>

                  ) : groupQuestions.length >
                    0 ? (

                    groupQuestions.map(
                      (question) => {

                        const isQuestionAuthor =
                          question.author?._id ===
                            user?._id ||
                          question.author?.email ===
                            user?.email;

                        const questionAnswers =
                          question.answers || [];

                        const isAnswersVisible =
                          showAnswers[
                            question._id
                          ];

                        const isEditingQuestion =
                          editingQuestion?._id ===
                          question._id;

                        return (

                          <div
                            className="group-question-card"
                            key={question._id}
                          >

                            <div className="question-header">

                              <div className="question-author">

                                <div className="question-avatar">
                                  {question.author?.name
                                    ?.charAt(0)
                                    .toUpperCase() ||
                                    "S"}
                                </div>

                                <div>

                                  <strong>
                                    {question.author
                                      ?.name ||
                                      "Student"}
                                  </strong>

                                  <span>
                                    {new Date(
                                      question.createdAt
                                    ).toLocaleString()}
                                  </span>

                                </div>

                              </div>

                              {isQuestionAuthor &&
                                !isEditingQuestion && (

                                  <div className="question-actions">

                                    <button
                                      type="button"
                                      onClick={() =>
                                        startEditingQuestion(
                                          question
                                        )
                                      }
                                    >
                                      ✏️
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDeleteQuestion(
                                          question._id
                                        )
                                      }
                                    >
                                      🗑️
                                    </button>

                                  </div>

                                )}

                            </div>

                            {isEditingQuestion ? (

                              <form
                                className="question-edit-form"
                                onSubmit={
                                  handleQuestionEditSubmit
                                }
                              >

                                <input
                                  type="text"
                                  value={
                                    editingQuestionTitle
                                  }
                                  onChange={(e) =>
                                    setEditingQuestionTitle(
                                      e.target.value
                                    )
                                  }
                                  maxLength={200}
                                />

                                <textarea
                                  value={
                                    editingQuestionContent
                                  }
                                  onChange={(e) =>
                                    setEditingQuestionContent(
                                      e.target.value
                                    )
                                  }
                                  maxLength={2000}
                                  rows="4"
                                />

                                <div className="question-edit-actions">

                                  <button
                                    type="button"
                                    className="cancel-question-btn"
                                    onClick={
                                      cancelQuestionEdit
                                    }
                                  >
                                    Cancel
                                  </button>

                                  <button
                                    type="submit"
                                    className="save-question-btn"
                                    disabled={
                                      !editingQuestionTitle.trim() ||
                                      !editingQuestionContent.trim()
                                    }
                                  >
                                    Save Changes
                                  </button>

                                </div>

                              </form>

                            ) : (

                              <>

                                <h3 className="question-title">
                                  {question.title}
                                </h3>

                                <p className="question-content">
                                  {question.content}
                                </p>

                              </>

                            )}

                            {!isEditingQuestion && (

                              <div className="answer-toggle-row">

                                <button
                                  type="button"
                                  className="answer-toggle-btn"
                                  onClick={() =>
                                    toggleAnswers(
                                      question._id
                                    )
                                  }
                                >
                                  💬{" "}
                                  {questionAnswers.length}{" "}
                                  {questionAnswers.length ===
                                  1
                                    ? "Answer"
                                    : "Answers"}{" "}
                                  {isAnswersVisible
                                    ? "▲"
                                    : "▼"}
                                </button>

                              </div>

                            )}

                            {isAnswersVisible &&
                              !isEditingQuestion && (

                                <div className="answers-section">

                                  {questionAnswers.length >
                                  0 ? (

                                    <div className="answers-list">

                                      {questionAnswers.map(
                                        (answer) => {

                                          const isAnswerAuthor =
                                            answer.author?._id ===
                                              user?._id ||
                                            answer.author?.email ===
                                              user?.email;

                                          const isEditingAnswer =
                                            editingAnswer?.questionId ===
                                              question._id &&
                                            editingAnswer?.answerId ===
                                              answer._id;

                                          return (

                                            <div
                                              className="answer-card"
                                              key={
                                                answer._id
                                              }
                                            >

                                              <div className="answer-header">

                                                <div className="answer-author">

                                                  <div className="answer-avatar">
                                                    {answer.author?.name
                                                      ?.charAt(
                                                        0
                                                      )
                                                      .toUpperCase() ||
                                                      "S"}
                                                  </div>

                                                  <div>

                                                    <strong>
                                                      {answer.author
                                                        ?.name ||
                                                        "Student"}
                                                    </strong>

                                                    <span>
                                                      {new Date(
                                                        answer.createdAt
                                                      ).toLocaleString()}
                                                    </span>

                                                  </div>

                                                </div>

                                                {isAnswerAuthor &&
                                                  !isEditingAnswer && (

                                                    <div className="answer-actions">

                                                      <button
                                                        type="button"
                                                        onClick={() =>
                                                          startEditingAnswer(
                                                            question._id,
                                                            answer
                                                          )
                                                        }
                                                      >
                                                        ✏️
                                                      </button>

                                                      <button
                                                        type="button"
                                                        onClick={() =>
                                                          handleDeleteAnswer(
                                                            question._id,
                                                            answer._id
                                                          )
                                                        }
                                                      >
                                                        🗑️
                                                      </button>

                                                    </div>

                                                  )}

                                              </div>

                                              {isEditingAnswer ? (

                                                <form
                                                  className="answer-edit-form"
                                                  onSubmit={
                                                    handleAnswerEditSubmit
                                                  }
                                                >

                                                  <textarea
                                                    value={
                                                      editingAnswerContent
                                                    }
                                                    onChange={(
                                                      e
                                                    ) =>
                                                      setEditingAnswerContent(
                                                        e
                                                          .target
                                                          .value
                                                      )
                                                    }
                                                    maxLength={
                                                      1000
                                                    }
                                                    rows="3"
                                                  />

                                                  <div className="answer-edit-actions">

                                                    <button
                                                      type="button"
                                                      className="cancel-answer-btn"
                                                      onClick={
                                                        cancelAnswerEdit
                                                      }
                                                    >
                                                      Cancel
                                                    </button>

                                                    <button
                                                      type="submit"
                                                      className="save-answer-btn"
                                                      disabled={
                                                        !editingAnswerContent.trim()
                                                      }
                                                    >
                                                      Save
                                                    </button>

                                                  </div>

                                                </form>

                                              ) : (

                                                <p className="answer-content">
                                                  {
                                                    answer.content
                                                  }
                                                </p>

                                              )}

                                            </div>

                                          );
                                        }
                                      )}

                                    </div>

                                  ) : (

                                    <p className="no-answers">
                                      No answers yet. Help
                                      your group member!
                                    </p>

                                  )}

                                  <form
                                    className="answer-form"
                                    onSubmit={(e) =>
                                      handleAnswerSubmit(
                                        e,
                                        question._id
                                      )
                                    }
                                  >

                                    <textarea
                                      placeholder="Write an answer..."
                                      rows="2"
                                      value={
                                        answerContent[
                                          question._id
                                        ] || ""
                                      }
                                      onChange={(e) =>
                                        handleAnswerChange(
                                          question._id,
                                          e.target.value
                                        )
                                      }
                                      maxLength={1000}
                                    />

                                    <div className="answer-form-footer">

                                      <span>
                                        {(
                                          answerContent[
                                            question._id
                                          ] || ""
                                        ).length}
                                        /1000
                                      </span>

                                      <button
                                        type="submit"
                                        className="submit-answer-btn"
                                        disabled={
                                          !(
                                            answerContent[
                                              question._id
                                            ] || ""
                                          ).trim()
                                        }
                                      >
                                        Answer
                                      </button>

                                    </div>

                                  </form>

                                </div>

                              )}

                          </div>

                        );
                      }
                    )

                  ) : (

                    <div className="discussion-empty">

                      <div>
                        ❓
                      </div>

                      <h3>
                        No questions yet
                      </h3>

                      <p>
                        Ask the first question and
                        help your group learn together.
                      </p>

                    </div>

                  )}

                </div>

              </div>

            )}

            {/* =========================
                Resources Content
            ========================= */}

            {showResources && (

              <div className="group-resources-content">

                {/* Share Resource Form */}

                <form
                  className="group-resource-form"
                  onSubmit={
                    handleResourceSubmit
                  }
                >

                  <div className="resource-form-title">

                    <span>
                      📚
                    </span>

                    <div>

                      <h3>
                        Share a Resource
                      </h3>

                      <p>
                        Share notes, videos, websites
                        or PDF study material with your
                        group.
                      </p>

                    </div>

                  </div>

                  {/* Resource Title */}

                  <input
                    type="text"
                    placeholder="Resource title, e.g. DBMS Normalization Notes"
                    value={resourceTitle}
                    onChange={(e) =>
                      setResourceTitle(
                        e.target.value
                      )
                    }
                    maxLength={200}
                    required
                  />

                  {/* Description */}

                  <textarea
                    placeholder="Short description (optional)"
                    rows="3"
                    value={resourceDescription}
                    onChange={(e) =>
                      setResourceDescription(
                        e.target.value
                      )
                    }
                    maxLength={1000}
                  />

                  {/* Subject + Resource Type */}

                  <div className="resource-form-row">

                    <input
                      type="text"
                      placeholder="Subject, e.g. DBMS"
                      value={resourceSubject}
                      onChange={(e) =>
                        setResourceSubject(
                          e.target.value
                        )
                      }
                      required
                    />

                    <select
                      value={resourceType}
                      onChange={(e) =>
                        setResourceType(
                          e.target.value
                        )
                      }
                      disabled={
                        resourceSourceType ===
                        "pdf"
                      }
                    >

                      <option value="Notes">
                        Notes
                      </option>

                      <option value="Video">
                        Video
                      </option>

                      <option value="Article">
                        Article
                      </option>

                      <option value="Website">
                        Website
                      </option>

                      <option value="PDF">
                        PDF
                      </option>

                      <option value="Other">
                        Other
                      </option>

                    </select>

                  </div>

                  {/* =========================
                      Link / PDF Choice
                  ========================= */}

                  <div className="resource-source-selector">

                    <button
                      type="button"
                      className={
                        resourceSourceType === "link"
                          ? "resource-source-btn active"
                          : "resource-source-btn"
                      }
                      onClick={() =>
                        handleResourceSourceChange(
                          "link"
                        )
                      }
                    >
                      🔗 Share Link
                    </button>

                    <button
                      type="button"
                      className={
                        resourceSourceType === "pdf"
                          ? "resource-source-btn active"
                          : "resource-source-btn"
                      }
                      onClick={() =>
                        handleResourceSourceChange(
                          "pdf"
                        )
                      }
                    >
                      📄 Upload PDF
                    </button>

                  </div>

                  {/* =========================
                      Link Input
                  ========================= */}

                  {resourceSourceType === "link" && (

                    <input
                      type="url"
                      placeholder="Paste resource link, e.g. https://..."
                      value={resourceUrl}
                      onChange={(e) =>
                        setResourceUrl(
                          e.target.value
                        )
                      }
                      required
                    />

                  )}

                  {/* =========================
                      PDF Input
                  ========================= */}

                  {resourceSourceType === "pdf" && (

                    <div className="resource-pdf-upload">

                      <label
                        htmlFor="group-resource-pdf"
                        className="resource-pdf-label"
                      >
                        📄 Choose PDF file
                      </label>

                      <input
                        id="group-resource-pdf"
                        type="file"
                        accept="application/pdf,.pdf"
                        onChange={
                          handleResourceFileChange
                        }
                      />

                      <p className="resource-pdf-help">
                        Maximum file size: 10 MB.
                        Only PDF files are allowed.
                      </p>

                      {resourceFile && (

                        <div className="selected-pdf-info">

                          <span>
                            📄{" "}
                            {resourceFile.name}
                          </span>

                          <span>
                            {(
                              resourceFile.size /
                              (1024 * 1024)
                            ).toFixed(2)}{" "}
                            MB
                          </span>

                        </div>

                      )}

                    </div>

                  )}

                  {/* =========================
                      Submit
                  ========================= */}

                  <div className="resource-form-footer">

                    <span>
                      {resourceDescription.length}/1000
                    </span>

                    <button
                      type="submit"
                      className="submit-resource-btn"
                      disabled={
                        resourceUploading ||
                        !resourceTitle.trim() ||
                        !resourceSubject.trim() ||
                        (
                          resourceSourceType ===
                            "link" &&
                          !resourceUrl.trim()
                        ) ||
                        (
                          resourceSourceType ===
                            "pdf" &&
                          !resourceFile
                        )
                      }
                    >
                      {resourceUploading
                        ? "Uploading..."
                        : resourceSourceType ===
                          "pdf"
                        ? "📄 Upload PDF"
                        : "📚 Share Resource"}
                    </button>

                  </div>

                  {/* PDF Permission Notice */}

                  {resourceSourceType === "pdf" && (

                    <p className="resource-upload-note">
                      💡 Only upload PDFs that you own
                      or have permission to share.
                    </p>

                  )}

                </form>

                {/* =========================
                    Shared Resources
                ========================= */}

                <div className="group-resources-list">

                  {resourcesLoading ? (

                    <div className="discussion-empty">

                      <div>
                        ⏳
                      </div>

                      <h3>
                        Loading resources...
                      </h3>

                    </div>

                  ) : groupResources.length >
                    0 ? (

                    groupResources.map(
                      (resource) => {

                        const isResourceAuthor =
                          resource.sharedBy?._id ===
                            user?._id ||
                          resource.sharedBy?.email ===
                            user?.email;

                        return (

                          <div
                            className="group-resource-card"
                            key={resource._id}
                          >

                            <div className="group-resource-header">

                              <div className="group-resource-icon">
                                {resource.sourceType ===
                                "pdf"
                                  ? "📄"
                                  : "📚"}
                              </div>

                              <div className="group-resource-main">

                                <div className="group-resource-title-row">

                                  <h3>
                                    {resource.title}
                                  </h3>

                                  <span className="group-resource-type">
                                    {resource.resourceType}
                                  </span>

                                </div>

                                <div className="group-resource-meta">

                                  <span>
                                    📖{" "}
                                    {resource.subject}
                                  </span>

                                  <span>
                                    👤{" "}
                                    {resource.sharedBy?.name ||
                                      "Student"}
                                  </span>

                                  <span>
                                    🕒{" "}
                                    {new Date(
                                      resource.createdAt
                                    ).toLocaleString()}
                                  </span>

                                </div>

                              </div>

                              {isResourceAuthor && (

                                <button
                                  type="button"
                                  className="delete-resource-btn"
                                  onClick={() =>
                                    handleDeleteResource(
                                      resource._id
                                    )
                                  }
                                >
                                  🗑️
                                </button>

                              )}

                            </div>

                            {resource.description && (

                              <p className="group-resource-description">
                                {resource.description}
                              </p>

                            )}

                            <div className="group-resource-link-row">

                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="open-resource-btn"
                              >
                                {resource.sourceType ===
                                "pdf"
                                  ? "📄 Open PDF →"
                                  : "🔗 Open Resource →"}
                              </a>

                            </div>

                          </div>

                        );
                      }
                    )

                  ) : (

                    <div className="discussion-empty">

                      <div>
                        📚
                      </div>

                      <h3>
                        No resources yet
                      </h3>

                      <p>
                        Share the first study resource
                        with your group.
                      </p>

                    </div>

                  )}

                </div>

              </div>

            )}

          </div>

        </div>

      )}

    </div>
  );
}

export default StudyGroups;