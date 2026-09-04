const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: [
        "Notes",
        "Tutorial",
        "Video",
        "Article",
        "PDF",
      ],
      default: "Notes",
    },

    // link is used for both normal URLs
    // and the Cloudinary URL of uploaded PDFs.
    link: {
      type: String,
      default: "",
      trim: true,
    },

    // Tells us whether the resource came from
    // a normal URL or an uploaded PDF.
    sourceType: {
      type: String,
      enum: ["link", "pdf"],
      default: "link",
    },

    // Used only for PDFs uploaded to Cloudinary.
    // This allows us to remove the PDF from Cloudinary
    // when the resource is deleted.
    cloudinaryPublicId: {
      type: String,
      default: null,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Resource = mongoose.model(
  "Resource",
  resourceSchema
);

module.exports = Resource;