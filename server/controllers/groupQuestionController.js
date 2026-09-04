const GroupQuestion = require("../models/GroupQuestion");
const StudyGroup = require("../models/StudyGroup");

// Get all questions for a study group
const getGroupQuestions = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await StudyGroup.findById(groupId);

    if (!group) {
      return res.status(404).json({
        message: "Study group not found.",
      });
    }

    const isMember = group.members.some(
      (memberId) =>
        memberId.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message:
          "Only group members can view group questions.",
      });
    }

    const questions = await GroupQuestion.find({
      group: groupId,
    })
      .populate("author", "name email")
      .populate("answers.author", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(questions);
  } catch (error) {
    console.error(
      "Get group questions error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch group questions.",
    });
  }
};

// Create a new group question
const createGroupQuestion = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { title, content } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Question title is required.",
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Question content is required.",
      });
    }

    const group = await StudyGroup.findById(groupId);

    if (!group) {
      return res.status(404).json({
        message: "Study group not found.",
      });
    }

    const isMember = group.members.some(
      (memberId) =>
        memberId.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message:
          "Only group members can ask questions.",
      });
    }

    const question = await GroupQuestion.create({
      group: groupId,
      author: req.user._id,
      title: title.trim(),
      content: content.trim(),
    });

    const populatedQuestion =
      await GroupQuestion.findById(question._id)
        .populate("author", "name email")
        .populate("answers.author", "name email");

    res.status(201).json(populatedQuestion);
  } catch (error) {
    console.error(
      "Create group question error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to create group question.",
    });
  }
};

// Update your own group question
const updateGroupQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Question title is required.",
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Question content is required.",
      });
    }

    const question = await GroupQuestion.findById(id);

    if (!question) {
      return res.status(404).json({
        message: "Question not found.",
      });
    }

    if (
      question.author.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only edit your own questions.",
      });
    }

    question.title = title.trim();
    question.content = content.trim();

    await question.save();

    const updatedQuestion =
      await GroupQuestion.findById(question._id)
        .populate("author", "name email")
        .populate("answers.author", "name email");

    res.status(200).json(updatedQuestion);
  } catch (error) {
    console.error(
      "Update group question error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to update group question.",
    });
  }
};

// Delete your own group question
const deleteGroupQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await GroupQuestion.findById(id);

    if (!question) {
      return res.status(404).json({
        message: "Question not found.",
      });
    }

    if (
      question.author.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only delete your own questions.",
      });
    }

    await GroupQuestion.findByIdAndDelete(id);

    res.status(200).json({
      message: "Question deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete group question error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to delete group question.",
    });
  }
};

// Add an answer to a group question
const addAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Answer content is required.",
      });
    }

    const question = await GroupQuestion.findById(id);

    if (!question) {
      return res.status(404).json({
        message: "Question not found.",
      });
    }

    const group = await StudyGroup.findById(
      question.group
    );

    if (!group) {
      return res.status(404).json({
        message: "Study group not found.",
      });
    }

    const isMember = group.members.some(
      (memberId) =>
        memberId.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message:
          "Only group members can answer questions.",
      });
    }

    question.answers.push({
      author: req.user._id,
      content: content.trim(),
    });

    await question.save();

    const updatedQuestion =
      await GroupQuestion.findById(question._id)
        .populate("author", "name email")
        .populate("answers.author", "name email");

    res.status(201).json(updatedQuestion);
  } catch (error) {
    console.error(
      "Add group answer error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to add answer.",
    });
  }
};

// Update your own answer
const updateAnswer = async (req, res) => {
  try {
    const { id, answerId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Answer content is required.",
      });
    }

    const question = await GroupQuestion.findById(id);

    if (!question) {
      return res.status(404).json({
        message: "Question not found.",
      });
    }

    const answer = question.answers.id(answerId);

    if (!answer) {
      return res.status(404).json({
        message: "Answer not found.",
      });
    }

    if (
      answer.author.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only edit your own answers.",
      });
    }

    answer.content = content.trim();

    await question.save();

    const updatedQuestion =
      await GroupQuestion.findById(question._id)
        .populate("author", "name email")
        .populate("answers.author", "name email");

    res.status(200).json(updatedQuestion);
  } catch (error) {
    console.error(
      "Update group answer error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to update answer.",
    });
  }
};

// Delete your own answer
const deleteAnswer = async (req, res) => {
  try {
    const { id, answerId } = req.params;

    const question = await GroupQuestion.findById(id);

    if (!question) {
      return res.status(404).json({
        message: "Question not found.",
      });
    }

    const answer = question.answers.id(answerId);

    if (!answer) {
      return res.status(404).json({
        message: "Answer not found.",
      });
    }

    if (
      answer.author.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only delete your own answers.",
      });
    }

    answer.deleteOne();

    await question.save();

    res.status(200).json({
      message: "Answer deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete group answer error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to delete answer.",
    });
  }
};

module.exports = {
  getGroupQuestions,
  createGroupQuestion,
  updateGroupQuestion,
  deleteGroupQuestion,
  addAnswer,
  updateAnswer,
  deleteAnswer,
};