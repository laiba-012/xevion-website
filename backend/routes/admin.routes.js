const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/roleMiddleware");

const {
    getDashboard,
    getUsers,
    deleteUser,
    updateUserStatus,
} = require("../controllers/admincontroller");

const {
  createInstructor,
  getInstructors,
  updateInstructor,
  deleteInstructor,
} = require("../controllers/instructor.controller");

// ======================================
// Multer Configuration
// ======================================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

// ======================================
// Dashboard
// ======================================

router.get(
  "/dashboard",
  protect,
  authorize("admin"),
  getDashboard
);



// ======================================
// USER MANAGEMENT
// ======================================

// Get All Users
router.get(
  "/users",
  protect,
  authorize("admin"),
  getUsers
);

// Delete User
router.delete(
  "/users/:id",
  protect,
  authorize("admin"),
  deleteUser
);

// Activate / Deactivate User
router.put(
  "/users/status/:id",
  protect,
  authorize("admin"),
  updateUserStatus
);

// ======================================
// Instructor Management
// ======================================

// Create Instructor
router.post(
  "/instructors",
  protect,
  authorize("admin"),
  upload.single("profileImage"),
  createInstructor
);

// Get All Instructors
router.get(
  "/instructors",
  protect,
  authorize("admin"),
  getInstructors
);

// Update Instructor
router.put(
  "/instructors/:id",
  protect,
  authorize("admin"),
  upload.single("profileImage"),
  updateInstructor
);

// Delete Instructor
router.delete(
  "/instructors/:id",
  protect,
  authorize("admin"),
  deleteInstructor
);

module.exports = router;