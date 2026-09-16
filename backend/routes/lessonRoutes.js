const express = require("express");

const router = express.Router();

const {

  createLesson,
  getLessons,
  getLesson,
  getLessonsByModule,
  updateLesson,
  deleteLesson,

} = require("../controllers/lessoncontroller");

const {
    protect,
    authorize
} = require("../middleware/auth.middleware");

// ======================================
// ADMIN + INSTRUCTOR
// ======================================

// Create Lesson
router.post(
  "/",
  protect,
  authorize("admin", "instructor"),
  createLesson
);

// Update Lesson
router.put(
  "/:id",
  protect,
  authorize("admin", "instructor"),
  updateLesson
);

// Delete Lesson
router.delete(
  "/:id",
  protect,
  authorize("admin", "instructor"),
  deleteLesson
);

// ======================================
// GET ROUTES
// ======================================

// All Lessons
router.get(
  "/",
  protect,
  getLessons
);

// Single Lesson
router.get(
  "/lesson/:id",
  protect,
  getLesson
);

// Lessons By Module
router.get(
  "/module/:moduleId",
  protect,
  getLessonsByModule
);

module.exports = router;