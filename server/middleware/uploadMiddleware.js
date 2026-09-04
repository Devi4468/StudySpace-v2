const multer = require("multer");

// Store the uploaded file temporarily in memory.
// It will then be sent directly to Cloudinary.
const storage = multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    // Maximum PDF size: 10 MB
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed."));
    }

    cb(null, true);
  },
});

module.exports = upload;