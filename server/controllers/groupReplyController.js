const GroupReply = require("../models/GroupReply");
const GroupPost = require("../models/GroupPost");
const StudyGroup = require("../models/StudyGroup");

// Get all replies for a study group's posts
const getGroupReplies = async (req, res) => {
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
        message: "Only group members can view replies.",
      });
    }

    const posts = await GroupPost.find({
      group: groupId,
    }).select("_id");

    const postIds = posts.map((post) => post._id);

    const replies = await GroupReply.find({
      post: { $in: postIds },
    })
      .populate("author", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json(replies);
  } catch (error) {
    console.error(
      "Get group replies error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch group replies.",
    });
  }
};

// Create a reply to a discussion post
const createGroupReply = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Reply content is required.",
      });
    }

    const post = await GroupPost.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Discussion post not found.",
      });
    }

    const group = await StudyGroup.findById(post.group);

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
          "Only group members can reply to posts.",
      });
    }

    const reply = await GroupReply.create({
      post: postId,
      author: req.user._id,
      content: content.trim(),
    });

    const populatedReply =
      await GroupReply.findById(reply._id)
        .populate("author", "name email");

    res.status(201).json(populatedReply);
  } catch (error) {
    console.error(
      "Create group reply error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to create reply.",
    });
  }
};

// Update your own reply
const updateGroupReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Reply content is required.",
      });
    }

    const reply = await GroupReply.findById(id);

    if (!reply) {
      return res.status(404).json({
        message: "Reply not found.",
      });
    }

    if (
      reply.author.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only edit your own replies.",
      });
    }

    reply.content = content.trim();

    await reply.save();

    const updatedReply =
      await GroupReply.findById(reply._id)
        .populate("author", "name email");

    res.status(200).json(updatedReply);
  } catch (error) {
    console.error(
      "Update group reply error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to update reply.",
    });
  }
};

// Delete your own reply
const deleteGroupReply = async (req, res) => {
  try {
    const { id } = req.params;

    const reply = await GroupReply.findById(id);

    if (!reply) {
      return res.status(404).json({
        message: "Reply not found.",
      });
    }

    if (
      reply.author.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only delete your own replies.",
      });
    }

    await GroupReply.findByIdAndDelete(id);

    res.status(200).json({
      message: "Reply deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete group reply error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to delete reply.",
    });
  }
};

module.exports = {
  getGroupReplies,
  createGroupReply,
  updateGroupReply,
  deleteGroupReply,
};