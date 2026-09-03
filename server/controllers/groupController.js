const StudyGroup = require("../models/StudyGroup");

// =========================
// Get All Study Groups
// =========================

const getGroups = async (req, res) => {
  try {
    const groups =
      await StudyGroup.find()
        .populate(
          "createdBy",
          "name email"
        )
        .populate(
          "members",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json(groups);
  } catch (error) {
    console.error(
      "Error fetching study groups:",
      error.message
    );

    res.status(500).json({
      message:
        "Failed to fetch study groups",
    });
  }
};

// =========================
// Create Study Group
// =========================

const createGroup = async (req, res) => {
  try {
    const {
      name,
      description,
      subject,
      maxMembers,
    } = req.body;

    if (
      !name ||
      !description ||
      !subject
    ) {
      return res.status(400).json({
        message:
          "Name, description and subject are required",
      });
    }

    const group =
      await StudyGroup.create({
        name,
        description,
        subject,
        maxMembers:
          Number(maxMembers) || 10,
        createdBy: req.user._id,
        members: [],
      });

    const populatedGroup =
      await StudyGroup.findById(
        group._id
      )
        .populate(
          "createdBy",
          "name email"
        )
        .populate(
          "members",
          "name email"
        );

    res.status(201).json(
      populatedGroup
    );
  } catch (error) {
    console.error(
      "Error creating study group:",
      error.message
    );

    res.status(500).json({
      message:
        "Failed to create study group",
    });
  }
};

// =========================
// Join Study Group
// =========================

const joinGroup = async (req, res) => {
  try {
    const group =
      await StudyGroup.findById(
        req.params.id
      );

    if (!group) {
      return res.status(404).json({
        message:
          "Study group not found",
      });
    }

    const userId =
      req.user._id.toString();

    const alreadyMember =
      group.members.some(
        (memberId) =>
          memberId.toString() ===
          userId
      );

    if (alreadyMember) {
      return res.status(400).json({
        message:
          "You are already a member of this group",
      });
    }

    if (
      group.members.length >=
      group.maxMembers
    ) {
      return res.status(400).json({
        message:
          "This study group is full",
      });
    }

    group.members.push(
      req.user._id
    );

    await group.save();

    const populatedGroup =
      await StudyGroup.findById(
        group._id
      )
        .populate(
          "createdBy",
          "name email"
        )
        .populate(
          "members",
          "name email"
        );

    res.status(200).json(
      populatedGroup
    );
  } catch (error) {
    console.error(
      "Error joining study group:",
      error.message
    );

    res.status(500).json({
      message:
        "Failed to join study group",
    });
  }
};

// =========================
// Leave Study Group
// =========================

const leaveGroup = async (req, res) => {
  try {
    const group =
      await StudyGroup.findById(
        req.params.id
      );

    if (!group) {
      return res.status(404).json({
        message:
          "Study group not found",
      });
    }

    const userId =
      req.user._id.toString();

    const isMember =
      group.members.some(
        (memberId) =>
          memberId.toString() ===
          userId
      );

    if (!isMember) {
      return res.status(400).json({
        message:
          "You are not a member of this group",
      });
    }

    group.members =
      group.members.filter(
        (memberId) =>
          memberId.toString() !==
          userId
      );

    await group.save();

    const populatedGroup =
      await StudyGroup.findById(
        group._id
      )
        .populate(
          "createdBy",
          "name email"
        )
        .populate(
          "members",
          "name email"
        );

    res.status(200).json(
      populatedGroup
    );
  } catch (error) {
    console.error(
      "Error leaving study group:",
      error.message
    );

    res.status(500).json({
      message:
        "Failed to leave study group",
    });
  }
};

// =========================
// Update Study Group
// =========================

const updateGroup = async (
  req,
  res
) => {
  try {
    const group =
      await StudyGroup.findById(
        req.params.id
      );

    if (!group) {
      return res.status(404).json({
        message:
          "Study group not found",
      });
    }

    // Only creator can edit
    if (
      group.createdBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only edit your own study groups",
      });
    }

    const {
      name,
      description,
      subject,
      maxMembers,
    } = req.body;

    group.name =
      name ?? group.name;

    group.description =
      description ??
      group.description;

    group.subject =
      subject ?? group.subject;

    if (maxMembers !== undefined) {
      group.maxMembers =
        Number(maxMembers);
    }

    await group.save();

    const updatedGroup =
      await StudyGroup.findById(
        group._id
      )
        .populate(
          "createdBy",
          "name email"
        )
        .populate(
          "members",
          "name email"
        );

    res.status(200).json(
      updatedGroup
    );
  } catch (error) {
    console.error(
      "Error updating study group:",
      error.message
    );

    res.status(500).json({
      message:
        "Failed to update study group",
    });
  }
};

// =========================
// Delete Study Group
// =========================

const deleteGroup = async (
  req,
  res
) => {
  try {
    const group =
      await StudyGroup.findById(
        req.params.id
      );

    if (!group) {
      return res.status(404).json({
        message:
          "Study group not found",
      });
    }

    // Only creator can delete
    if (
      group.createdBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only delete your own study groups",
      });
    }

    await group.deleteOne();

    res.status(200).json({
      message:
        "Study group deleted successfully",
    });
  } catch (error) {
    console.error(
      "Error deleting study group:",
      error.message
    );

    res.status(500).json({
      message:
        "Failed to delete study group",
    });
  }
};

module.exports = {
  getGroups,
  createGroup,
  joinGroup,
  leaveGroup,
  updateGroup,
  deleteGroup,
};