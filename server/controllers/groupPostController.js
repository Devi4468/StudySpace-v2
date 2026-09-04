const GroupPost = require("../models/GroupPost");
const StudyGroup = require("../models/StudyGroup");

// Get all posts for a specific study group
const getGroupPosts = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await StudyGroup.findById(groupId);

    if (!group) {
      return res.status(404).json({
        message: "Study group not found.",
      });
    }

    const posts = await GroupPost.find({
      group: groupId,
    })
      .populate("author", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error(
      "Get group posts error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch group posts.",
    });
  }
};

// Create a new discussion post
const createGroupPost = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Post content is required.",
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
        memberId.toString() ===
        req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message:
          "Only group members can create discussion posts.",
      });
    }

    const post = await GroupPost.create({
      group: groupId,
      author: req.user._id,
      content: content.trim(),
    });

    const populatedPost =
      await GroupPost.findById(post._id)
        .populate("author", "name email");

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error(
      "Create group post error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to create group post.",
    });
  }
};

// Update your own discussion post
const updateGroupPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Post content is required.",
      });
    }

    const post = await GroupPost.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found.",
      });
    }

    if (
      post.author.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only edit your own posts.",
      });
    }

    post.content = content.trim();

    await post.save();

    const updatedPost =
      await GroupPost.findById(post._id)
        .populate("author", "name email");

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(
      "Update group post error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to update group post.",
    });
  }
};

// Delete your own discussion post
const deleteGroupPost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await GroupPost.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found.",
      });
    }

    if (
      post.author.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only delete your own posts.",
      });
    }

    await GroupPost.findByIdAndDelete(id);

    res.status(200).json({
      message: "Post deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete group post error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to delete group post.",
    });
  }
};

module.exports = {
  getGroupPosts,
  createGroupPost,
  updateGroupPost,
  deleteGroupPost,
};