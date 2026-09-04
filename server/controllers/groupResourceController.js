const GroupResource = require("../models/GroupResource");
const StudyGroup = require("../models/StudyGroup");
const cloudinary = require("../config/cloudinary");

// Check whether user is a member of the group
const checkMembership = (group, userId) => {
  return group.members.some(
    (memberId) =>
      memberId.toString() === userId.toString()
  );
};

// Upload PDF buffer to Cloudinary
const uploadPdfToCloudinary = (buffer, originalName) => {
  return new Promise((resolve, reject) => {
    const sanitizedName = originalName
      .replace(/\.pdf$/i, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .toLowerCase();

    const publicId = `studyspace/group-resources/${Date.now()}-${sanitizedName}`;

    const uploadStream = cloudinary.uploader.upload_stream(
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

// Get all resources shared in a group
const getGroupResources = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await StudyGroup.findById(groupId);

    if (!group) {
      return res.status(404).json({
        message: "Study group not found.",
      });
    }

    if (!checkMembership(group, req.user._id)) {
      return res.status(403).json({
        message:
          "Only group members can view shared resources.",
      });
    }

    const resources = await GroupResource.find({
      group: groupId,
    })
      .populate("sharedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(resources);
  } catch (error) {
    console.error(
      "Get group resources error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch group resources.",
    });
  }
};

// Share a resource in a group
const createGroupResource = async (req, res) => {
  try {
    const { groupId } = req.params;

    const {
      title,
      description,
      subject,
      resourceType,
      url,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Resource title is required.",
      });
    }

    if (!subject || !subject.trim()) {
      return res.status(400).json({
        message: "Subject is required.",
      });
    }

    const group = await StudyGroup.findById(groupId);

    if (!group) {
      return res.status(404).json({
        message: "Study group not found.",
      });
    }

    if (!checkMembership(group, req.user._id)) {
      return res.status(403).json({
        message:
          "Only group members can share resources.",
      });
    }

    // --------------------------------------------------
    // PDF UPLOAD
    // --------------------------------------------------

    if (req.file) {
      if (req.file.mimetype !== "application/pdf") {
        return res.status(400).json({
          message: "Only PDF files are allowed.",
        });
      }

      const uploadResult = await uploadPdfToCloudinary(
        req.file.buffer,
        req.file.originalname
      );

      const resource = await GroupResource.create({
        group: groupId,
        title: title.trim(),
        description: description?.trim() || "",
        subject: subject.trim(),
        resourceType: "PDF",
        sourceType: "pdf",
        url: uploadResult.secure_url,
        cloudinaryPublicId: uploadResult.public_id,
        sharedBy: req.user._id,
      });

      const populatedResource =
        await GroupResource.findById(resource._id)
          .populate("sharedBy", "name email");

      return res.status(201).json(populatedResource);
    }

    // --------------------------------------------------
    // NORMAL LINK
    // --------------------------------------------------

    if (!url || !url.trim()) {
      return res.status(400).json({
        message: "Resource link is required.",
      });
    }

    const resource = await GroupResource.create({
      group: groupId,
      title: title.trim(),
      description: description?.trim() || "",
      subject: subject.trim(),
      resourceType: resourceType || "Other",
      sourceType: "link",
      url: url.trim(),
      cloudinaryPublicId: null,
      sharedBy: req.user._id,
    });

    const populatedResource =
      await GroupResource.findById(resource._id)
        .populate("sharedBy", "name email");

    res.status(201).json(populatedResource);
  } catch (error) {
    console.error(
      "Create group resource error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to share resource.",
    });
  }
};

// Delete your own shared resource
const deleteGroupResource = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await GroupResource.findById(id);

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found.",
      });
    }

    if (
      resource.sharedBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only delete resources shared by you.",
      });
    }

    // Delete PDF from Cloudinary if it was uploaded there
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

    await GroupResource.findByIdAndDelete(id);

    res.status(200).json({
      message: "Resource deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete group resource error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to delete resource.",
    });
  }
};

module.exports = {
  getGroupResources,
  createGroupResource,
  deleteGroupResource,
};