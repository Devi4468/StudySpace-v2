const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const resourceRoutes = require("./routes/resourceRoutes");
const questionRoutes = require("./routes/questionRoutes");
const groupRoutes = require("./routes/groupRoutes");
const userRoutes = require("./routes/userRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const groupPostRoutes = require("./routes/groupPostRoutes");
const groupReplyRoutes = require("./routes/groupReplyRoutes");
const groupQuestionRoutes = require("./routes/groupQuestionRoutes");
const groupResourceRoutes = require("./routes/groupResourceRoutes");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

connectDB();

// ======================================================
// CORS
// ======================================================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://study-space-v2-one.vercel.app",
    ],
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

app.use(express.json());

// ======================================================
// Health Check
// ======================================================

app.get("/", (req, res) => {
  res.json({
    message: "StudySpace backend is running!",
  });
});

// ======================================================
// API Routes
// ======================================================

app.use("/api/resources", resourceRoutes);

app.use("/api/questions", questionRoutes);

app.use("/api/groups", groupRoutes);

app.use("/api/users", userRoutes);

app.use("/api/bookmarks", bookmarkRoutes);

app.use(
  "/api/group-posts",
  groupPostRoutes
);

app.use(
  "/api/group-replies",
  groupReplyRoutes
);

app.use(
  "/api/group-questions",
  groupQuestionRoutes
);

app.use(
  "/api/group-resources",
  groupResourceRoutes
);

// ======================================================
// Start Server
// ======================================================

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});