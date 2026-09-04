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

// ======================================================
// Resource Bookmark Index
// ======================================================
// A user can bookmark the same resource only once.
// Documents where "resource" is not an ObjectId
// (for example question bookmarks) are ignored.
bookmarkSchema.index(
  { user: 1, resource: 1 },
  {
    unique: true,
    partialFilterExpression: {
      resource: { $type: "objectId" },
    },
  }
);

// ======================================================
// Question Bookmark Index
// ======================================================
// A user can bookmark the same question only once.
// Documents where "question" is not an ObjectId
// (for example resource bookmarks) are ignored.
bookmarkSchema.index(
  { user: 1, question: 1 },
  {
    unique: true,
    partialFilterExpression: {
      question: { $type: "objectId" },
    },
  }
);

const Bookmark = mongoose.model(
  "Bookmark",
  bookmarkSchema
);

module.exports = Bookmark;