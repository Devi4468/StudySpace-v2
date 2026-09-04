const express = require("express");

const {
  getGroupResources,
  createGroupResource,
  deleteGroupResource,
} = require("../controllers/groupResourceController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get(
  "/group/:groupId",
  protect,
  getGroupResources
);

router.post(
  "/group/:groupId",
  protect,
  upload.single("file"),
  createGroupResource
);

router.delete(
  "/:id",
  protect,
  deleteGroupResource
);

module.exports = router;