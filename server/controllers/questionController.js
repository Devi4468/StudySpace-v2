const Question = require("../models/Question");

// =========================
// Get All Questions
// =========================

const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate("author", "name email")
      .populate("answers.author", "name email")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(questions);
  } catch (error) {
    console.error(
      "Error fetching questions:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch questions",
    });
  }
};

// =========================
// Create Question
// =========================

const createQuestion = async (req, res) => {
  try {
    const {
      title,
      description,
      subject,
      tags,
    } = req.body;

    if (!title || !description || !subject) {
      return res.status(400).json({
        message:
          "Title, description and subject are required",
      });
    }

    const question = await Question.create({
      title,
      description,
      subject,
      tags: Array.isArray(tags) ? tags : [],
      author: req.user._id,
    });

    const populatedQuestion =
      await Question.findById(question._id)
        .populate("author", "name email")
        .populate("answers.author", "name email");

    res.status(201).json(populatedQuestion);
  } catch (error) {
    console.error(
      "Error creating question:",
      error.message
    );

    res.status(500).json({
      message: "Failed to create question",
    });
  }
};

// =========================
// Update Question
// =========================

const updateQuestion = async (req, res) => {
  try {
    const question =
      await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    // Only the creator can edit
    if (
      question.author.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only edit your own questions",
      });
    }

    const {
      title,
      description,
      subject,
      tags,
    } = req.body;

    question.title =
      title ?? question.title;

    question.description =
      description ?? question.description;

    question.subject =
      subject ?? question.subject;

    question.tags =
      Array.isArray(tags)
        ? tags
        : question.tags;

    await question.save();

    const updatedQuestion =
      await Question.findById(question._id)
        .populate("author", "name email")
        .populate("answers.author", "name email");

    res.status(200).json(updatedQuestion);
  } catch (error) {
    console.error(
      "Error updating question:",
      error.message
    );

    res.status(500).json({
      message: "Failed to update question",
    });
  }
};

// =========================
// Delete Question
// =========================

const deleteQuestion = async (req, res) => {
  try {
    const question =
      await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    // Only the creator can delete
    if (
      question.author.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only delete your own questions",
      });
    }

    await question.deleteOne();

    res.status(200).json({
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error(
      "Error deleting question:",
      error.message
    );

    res.status(500).json({
      message: "Failed to delete question",
    });
  }
};

// =========================
// Add Answer
// =========================

const addAnswer = async (req, res) => {
  try {
    const question =
      await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Answer content is required",
      });
    }

    question.answers.push({
      author: req.user._id,
      content: content.trim(),
    });

    await question.save();

    const updatedQuestion =
      await Question.findById(question._id)
        .populate("author", "name email")
        .populate("answers.author", "name email");

    res.status(201).json(updatedQuestion);
  } catch (error) {
    console.error(
      "Error adding answer:",
      error.message
    );

    res.status(500).json({
      message: "Failed to add answer",
    });
  }
};

// =========================
// Update Answer
// =========================

const updateAnswer = async (req, res) => {
  try {
    const question =
      await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    const answer =
      question.answers.id(
        req.params.answerId
      );

    if (!answer) {
      return res.status(404).json({
        message: "Answer not found",
      });
    }

    // Only the answer creator can edit
    if (
      answer.author.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only edit your own answers",
      });
    }

    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Answer content is required",
      });
    }

    answer.content = content.trim();

    await question.save();

    const updatedQuestion =
      await Question.findById(question._id)
        .populate("author", "name email")
        .populate("answers.author", "name email");

    res.status(200).json(updatedQuestion);
  } catch (error) {
    console.error(
      "Error updating answer:",
      error.message
    );

    res.status(500).json({
      message: "Failed to update answer",
    });
  }
};

// =========================
// Delete Answer
// =========================

const deleteAnswer = async (req, res) => {
  try {
    const question =
      await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    const answer =
      question.answers.id(
        req.params.answerId
      );

    if (!answer) {
      return res.status(404).json({
        message: "Answer not found",
      });
    }

    // Only the answer creator can delete
    if (
      answer.author.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only delete your own answers",
      });
    }

    answer.deleteOne();

    await question.save();

    const updatedQuestion =
      await Question.findById(question._id)
        .populate("author", "name email")
        .populate("answers.author", "name email");

    res.status(200).json(updatedQuestion);
  } catch (error) {
    console.error(
      "Error deleting answer:",
      error.message
    );

    res.status(500).json({
      message: "Failed to delete answer",
    });
  }
};

// =========================
// Export
// =========================

module.exports = {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  addAnswer,
  updateAnswer,
  deleteAnswer,
};