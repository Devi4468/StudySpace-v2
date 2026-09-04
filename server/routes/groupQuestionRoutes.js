const express = require("express");

const {
  getGroupQuestions,
  createGroupQuestion,
  updateGroupQuestion,
  deleteGroupQuestion,
  addAnswer,
  updateAnswer,
  deleteAnswer,
} = require("../controllers/groupQuestionController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get all questions for a group
router.get(
  "/group/:groupId",
  protect,
  getGroupQuestions
);

// Create a question in a group
router.post(
  "/group/:groupId",
  protect,
  createGroupQuestion
);

// Edit your own question
router.put(
  "/:id",
  protect,
  updateGroupQuestion
);

// Delete your own question
router.delete(
  "/:id",
  protect,
  deleteGroupQuestion
);

// Add an answer
router.post(
  "/:id/answers",
  protect,
  addAnswer
);

// Edit your own answer
router.put(
  "/:id/answers/:answerId",
  protect,
  updateAnswer
);

// Delete your own answer
router.delete(
  "/:id/answers/:answerId",
  protect,
  deleteAnswer
);

module.exports = router;