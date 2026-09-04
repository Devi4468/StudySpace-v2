const mongoose = require("mongoose");

const groupResourceSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudyGroup",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    resourceType: {
      type: String,
      required: true,
      enum: [
        "Notes",
        "Video",
        "Article",
        "Website",
        "PDF",
        "Other",
      ],
      default: "Other",
    },

    // How the resource was shared
    sourceType: {
      type: String,
      enum: ["link", "pdf"],
      default: "link",
    },

    // URL of either:
    // - external resource (Google Drive, website, YouTube, etc.)
    // - uploaded PDF stored on Cloudinary
    url: {
      type: String,
      required: true,
      trim: true,
    },

    // Cloudinary public ID for uploaded PDFs.
    // This allows us to delete the actual PDF from Cloudinary
    // when the resource is deleted from StudySpace.
    cloudinaryPublicId: {
      type: String,
      default: null,
    },

    sharedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const GroupResource = mongoose.model(
  "GroupResource",
  groupResourceSchema
);

module.exports = GroupResource;