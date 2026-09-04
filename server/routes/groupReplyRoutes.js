const express = require("express");

const {
  getGroupReplies,
  createGroupReply,
  updateGroupReply,
  deleteGroupReply,
} = require("../controllers/groupReplyController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get all replies for a study group
router.get(
  "/group/:groupId",
  protect,
  getGroupReplies
);

// Create a reply to a discussion post
router.post(
  "/post/:postId",
  protect,
  createGroupReply
);

// Edit your own reply
router.put(
  "/:id",
  protect,
  updateGroupReply
);

// Delete your own reply
router.delete(
  "/:id",
  protect,
  deleteGroupReply
);

module.exports = router;