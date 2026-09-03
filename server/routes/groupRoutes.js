const express = require("express");

const {
  getGroups,
  createGroup,
  joinGroup,
  leaveGroup,
  updateGroup,
  deleteGroup,
} = require("../controllers/groupController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  getGroups
);

router.post(
  "/",
  protect,
  createGroup
);

router.post(
  "/:id/join",
  protect,
  joinGroup
);

router.post(
  "/:id/leave",
  protect,
  leaveGroup
);

router.put(
  "/:id",
  protect,
  updateGroup
);

router.delete(
  "/:id",
  protect,
  deleteGroup
);

module.exports = router;