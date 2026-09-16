const express = require("express");
const router = express.Router();

const {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  getMyCourses,
  getPendingCourses,
  approveCourse,
  rejectCourse,
} = require("../controllers/course.controller");

const { protect, authorize } = require("../middleware/auth.middleware");

// ======================================
// INSTRUCTOR + ADMIN
// ======================================

// Create Course
router.post(
  "/create",
  protect,
  authorize("admin", "instructor"),
  createCourse
);

// My Courses
router.get(
  "/my-courses",
  protect,
  authorize("admin", "instructor"),
  getMyCourses
);

// Update Course
router.put(
  "/:id",
  protect,
  authorize("admin", "instructor"),
  updateCourse
);

// Delete Course
router.delete(
  "/:id",
  protect,
  authorize("admin", "instructor"),
  deleteCourse
);

// ======================================
// ADMIN ONLY
// ======================================

// All Pending Courses
router.get(
  "/pending",
  protect,
  authorize("admin"),
  getPendingCourses
);

// Approve Course
router.put(
  "/approve/:id",
  protect,
  authorize("admin"),
  approveCourse
);

// Reject Course
router.put(
  "/reject/:id",
  protect,
  authorize("admin"),
  rejectCourse
);




// Published Courses Only (Public)
router.get("/", getCourses);

// Single Course
router.get("/:id", getCourse);

module.exports = router;