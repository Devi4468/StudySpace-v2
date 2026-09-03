const Resource = require("../models/Resource");

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

    if (
      !title ||
      !subject ||
      !description
    ) {
      return res.status(400).json({
        message:
          "Title, subject and description are required",
      });
    }

    const resource =
      await Resource.create({
        title,
        subject,
        description,
        type,
        link,
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

    resource.type =
      type ?? resource.type;

    resource.link =
      link ?? resource.link;

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