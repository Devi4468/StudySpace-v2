const Resource = require("../models/Resource");
const cloudinary = require("../config/cloudinary");

// =========================
// Upload PDF to Cloudinary
// =========================

const uploadPdfToCloudinary = (
  buffer,
  originalName
) => {
  return new Promise((resolve, reject) => {
    const sanitizedName = originalName
      .replace(/\.pdf$/i, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .toLowerCase();

    const publicId =
      `studyspace/resources/${Date.now()}-${sanitizedName}`;

    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          public_id: publicId,
          format: "pdf",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

    uploadStream.end(buffer);
  });
};

// =========================
// Get All Resources
// =========================

const getResources = async (req, res) => {
  try {
    const resources =
      await Resource.find()
        .populate(
          "uploadedBy",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json(resources);
  } catch (error) {
    console.error(
      "Error fetching resources:",
      error.message
    );

    res.status(500).json({
      message:
        "Failed to fetch resources",
    });
  }
};

// =========================
// Create Resource
// =========================

const createResource = async (req, res) => {
  try {
    const {
      title,
      subject,
      description,
      type,
      link,
    } = req.body;

    // Basic validation
    if (
      !title ||
      !title.trim() ||
      !subject ||
      !subject.trim() ||
      !description ||
      !description.trim()
    ) {
      return res.status(400).json({
        message:
          "Title, subject and description are required",
      });
    }

    // =========================
    // PDF Upload
    // =========================

    if (req.file) {
      if (
        req.file.mimetype !==
        "application/pdf"
      ) {
        return res.status(400).json({
          message:
            "Only PDF files are allowed.",
        });
      }

      const uploadResult =
        await uploadPdfToCloudinary(
          req.file.buffer,
          req.file.originalname
        );

      const resource =
        await Resource.create({
          title: title.trim(),
          subject: subject.trim(),
          description: description.trim(),
          type: "PDF",
          link: uploadResult.secure_url,
          sourceType: "pdf",
          cloudinaryPublicId:
            uploadResult.public_id,
          uploadedBy: req.user._id,
        });

      const populatedResource =
        await Resource.findById(
          resource._id
        ).populate(
          "uploadedBy",
          "name email"
        );

      return res.status(201).json(
        populatedResource
      );
    }

    // =========================
    // Normal Link Resource
    // =========================

    if (!link || !link.trim()) {
      return res.status(400).json({
        message:
          "Please provide a resource link or upload a PDF.",
      });
    }

    const resource =
      await Resource.create({
        title: title.trim(),
        subject: subject.trim(),
        description: description.trim(),
        type: type || "Notes",
        link: link.trim(),
        sourceType: "link",
        cloudinaryPublicId: null,
        uploadedBy: req.user._id,
      });

    const populatedResource =
      await Resource.findById(
        resource._id
      ).populate(
        "uploadedBy",
        "name email"
      );

    res.status(201).json(
      populatedResource
    );
  } catch (error) {
    console.error(
      "Error creating resource:",
      error.message
    );

    res.status(500).json({
      message:
        "Failed to create resource",
    });
  }
};

// =========================
// Update Resource
// =========================

const updateResource = async (
  req,
  res
) => {
  try {
    const resource =
      await Resource.findById(
        req.params.id
      );

    if (!resource) {
      return res.status(404).json({
        message:
          "Resource not found",
      });
    }

    if (
      resource.uploadedBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only edit your own resources",
      });
    }

    const {
      title,
      subject,
      description,
      type,
      link,
    } = req.body;

    resource.title =
      title ?? resource.title;

    resource.subject =
      subject ?? resource.subject;

    resource.description =
      description ??
      resource.description;

    // For an uploaded PDF, keep the type as PDF.
    if (resource.sourceType === "pdf") {
      resource.type = "PDF";
    } else {
      resource.type =
        type ?? resource.type;
    }

    // Do not replace a PDF's Cloudinary link
    // with an empty/missing link during edit.
    if (
      resource.sourceType === "link"
    ) {
      resource.link =
        link ?? resource.link;
    }

    await resource.save();

    const updatedResource =
      await Resource.findById(
        resource._id
      ).populate(
        "uploadedBy",
        "name email"
      );

    res.status(200).json(
      updatedResource
    );
  } catch (error) {
    console.error(
      "Error updating resource:",
      error.message
    );

    res.status(500).json({
      message:
        "Failed to update resource",
    });
  }
};

// =========================
// Delete Resource
// =========================

const deleteResource = async (
  req,
  res
) => {
  try {
    const resource =
      await Resource.findById(
        req.params.id
      );

    if (!resource) {
      return res.status(404).json({
        message:
          "Resource not found",
      });
    }

    if (
      resource.uploadedBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only delete your own resources",
      });
    }

    // =========================
    // Delete PDF from Cloudinary
    // =========================

    if (
      resource.sourceType === "pdf" &&
      resource.cloudinaryPublicId
    ) {
      try {
        await cloudinary.uploader.destroy(
          resource.cloudinaryPublicId,
          {
            resource_type: "image",
            type: "upload",
            invalidate: true,
          }
        );
      } catch (cloudinaryError) {
        console.error(
          "Cloudinary delete error:",
          cloudinaryError.message
        );
      }
    }

    await resource.deleteOne();

    res.status(200).json({
      message:
        "Resource deleted successfully",
    });
  } catch (error) {
    console.error(
      "Error deleting resource:",
      error.message
    );

    res.status(500).json({
      message:
        "Failed to delete resource",
    });
  }
};

module.exports = {
  getResources,
  createResource,
  updateResource,
  deleteResource,
};