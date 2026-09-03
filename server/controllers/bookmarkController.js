const Bookmark = require("../models/Bookmark");

// Get all bookmarks of the logged-in user
const getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({
      user: req.user._id,
    })
      .populate({
        path: "resource",
        populate: {
          path: "uploadedBy",
          select: "name email",
        },
      })
      .populate({
        path: "question",
        populate: {
          path: "author",
          select: "name email",
        },
      })
      .sort({
        createdAt: -1,
      });

    res.status(200).json(bookmarks);
  } catch (error) {
    console.error(
      "Error fetching bookmarks:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch bookmarks",
    });
  }
};

// Add a bookmark
const addBookmark = async (req, res) => {
  try {
    const { resourceId, questionId } =
      req.body;

    // A bookmark must belong to either
    // a resource or a question.
    if (!resourceId && !questionId) {
      return res.status(400).json({
        message:
          "Resource or question is required",
      });
    }

    // Do not allow both at the same time.
    if (resourceId && questionId) {
      return res.status(400).json({
        message:
          "Bookmark can contain only one item",
      });
    }

    const existingBookmark =
      await Bookmark.findOne({
        user: req.user._id,
        ...(resourceId
          ? { resource: resourceId }
          : { question: questionId }),
      });

    if (existingBookmark) {
      return res.status(400).json({
        message: "Already bookmarked",
      });
    }

    const bookmark =
      await Bookmark.create({
        user: req.user._id,
        resource: resourceId || null,
        question: questionId || null,
      });

    const populatedBookmark =
      await Bookmark.findById(
        bookmark._id
      )
        .populate({
          path: "resource",
          populate: {
            path: "uploadedBy",
            select: "name email",
          },
        })
        .populate({
          path: "question",
          populate: {
            path: "author",
            select: "name email",
          },
        });

    res.status(201).json(
      populatedBookmark
    );
  } catch (error) {
    console.error(
      "Error adding bookmark:",
      error.message
    );

    res.status(500).json({
      message: "Failed to add bookmark",
    });
  }
};

// Remove a bookmark
const removeBookmark = async (
  req,
  res
) => {
  try {
    const { resourceId, questionId } =
      req.body;

    if (!resourceId && !questionId) {
      return res.status(400).json({
        message:
          "Resource or question is required",
      });
    }

    const bookmark =
      await Bookmark.findOne({
        user: req.user._id,
        ...(resourceId
          ? { resource: resourceId }
          : { question: questionId }),
      });

    if (!bookmark) {
      return res.status(404).json({
        message: "Bookmark not found",
      });
    }

    await bookmark.deleteOne();

    res.status(200).json({
      message:
        "Bookmark removed successfully",
    });
  } catch (error) {
    console.error(
      "Error removing bookmark:",
      error.message
    );

    res.status(500).json({
      message:
        "Failed to remove bookmark",
    });
  }
};

// Check whether an item is bookmarked
const checkBookmark = async (
  req,
  res
) => {
  try {
    const { resourceId, questionId } =
      req.query;

    if (!resourceId && !questionId) {
      return res.status(400).json({
        message:
          "Resource or question is required",
      });
    }

    const bookmark =
      await Bookmark.findOne({
        user: req.user._id,
        ...(resourceId
          ? { resource: resourceId }
          : { question: questionId }),
      });

    res.status(200).json({
      bookmarked: Boolean(bookmark),
    });
  } catch (error) {
    console.error(
      "Error checking bookmark:",
      error.message
    );

    res.status(500).json({
      message:
        "Failed to check bookmark",
    });
  }
};

module.exports = {
  getBookmarks,
  addBookmark,
  removeBookmark,
  checkBookmark,
};