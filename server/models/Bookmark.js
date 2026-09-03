const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resource",
      default: null,
    },

    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent the same user from bookmarking
// the same resource more than once.
bookmarkSchema.index(
  { user: 1, resource: 1 },
  {
    unique: true,
    sparse: true,
  }
);

// Prevent the same user from bookmarking
// the same question more than once.
bookmarkSchema.index(
  { user: 1, question: 1 },
  {
    unique: true,
    sparse: true,
  }
);

const Bookmark = mongoose.model(
  "Bookmark",
  bookmarkSchema
);

module.exports = Bookmark;