require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// ===============================
// Routes Imports
// ===============================

const adminRoutes = require("./routes/admin.routes");
const authRoutes = require("./routes/auth.routes");
const instructorRoutes = require("./routes/instructor.routes");
const courseRoutes = require("./routes/course.routes");
const moduleRoutes = require("./routes/moduleRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const enrollmentRoutes = require("./routes/enrollmentroutes");
const statsRoutes = require("./routes/stats.routes");
const userRoutes = require("./routes/user.routes");
const blogRoutes = require("./routes/blogRoutes");

// ===============================
// Middleware
// ===============================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// ===============================
// Static Upload Folder
// ===============================

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ===============================
// API Routes
// ===============================

app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/instructors", instructorRoutes);

app.use("/api/courses", courseRoutes);

app.use("/api/modules", moduleRoutes);

app.use("/api/lessons", lessonRoutes);

app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);

// ===============================
// Health Route
// ===============================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Cyberion Server Running Successfully",
  });
});

// ===============================
// MongoDB
// ===============================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.log("❌ MongoDB Error:", err.message);
  });

// ===============================
// Error Handler
// ===============================

app.use((err, req, res, next) => {
  console.log(err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ===============================
// Server
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server Running On Port ${PORT}`);
});