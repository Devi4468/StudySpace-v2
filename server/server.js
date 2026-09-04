const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
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


const app = express();

const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "StudySpace backend is running!",
  });
});

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
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});