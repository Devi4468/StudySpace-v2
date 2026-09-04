const express = require("express");

const {
  getGroupPosts,
  createGroupPost,
  updateGroupPost,
  deleteGroupPost,
} = require("../controllers/groupPostController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get all posts for a group
router.get(
  "/group/:groupId",
  protect,
  getGroupPosts
);

// Create a post in a group
router.post(
  "/group/:groupId",
  protect,
  createGroupPost
);

// Edit your own post
router.put(
  "/:id",
  protect,
  updateGroupPost
);

// Delete your own post
router.delete(
  "/:id",
  protect,
  deleteGroupPost
);

module.exports = router;