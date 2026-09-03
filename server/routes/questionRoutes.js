const express = require("express");

const {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/questionController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  getQuestions
);

router.post(
  "/",
  protect,
  createQuestion
);

router.put(
  "/:id",
  protect,
  updateQuestion
);

router.delete(
  "/:id",
  protect,
  deleteQuestion
);

module.exports = router;