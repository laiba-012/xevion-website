const express = require("express");
const router = express.Router();

const {
  enrollCourse,
  getMyEnrollments,
} = require("../controllers/enrollmentcontroller");

const { protect } = require("../middleware/auth.middleware");

router.post("/:courseId", protect, enrollCourse);

router.get("/my", protect, getMyEnrollments);

module.exports = router;
