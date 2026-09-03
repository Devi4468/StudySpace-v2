const express = require("express");

const {
  getResources,
  createResource,
  updateResource,
  deleteResource,
} = require("../controllers/resourceController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getResources);

router.post("/", protect, createResource);

router.put("/:id", protect, updateResource);

router.delete(
  "/:id",
  protect,
  deleteResource
);

module.exports = router;