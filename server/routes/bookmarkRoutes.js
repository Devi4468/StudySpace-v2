const express = require("express");

const {
  getBookmarks,
  addBookmark,
  removeBookmark,
  checkBookmark,
} = require("../controllers/bookmarkController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get all bookmarks
router.get("/", protect, getBookmarks);

// Check whether an item is bookmarked
router.get("/check", protect, checkBookmark);

// Add a bookmark
router.post("/", protect, addBookmark);

// Remove a bookmark
router.delete("/", protect, removeBookmark);

module.exports = router;