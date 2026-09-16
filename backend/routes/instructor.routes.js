const express = require("express");

const router = express.Router();

const {

    createInstructor,

    getInstructors,

    getInstructor,

    updateInstructor,

    deleteInstructor

} = require("../controllers/instructor.controller");

const { protect } = require("../middleware/auth.middleware");

const { authorize } = require("../middleware/roleMiddleware");


// =======================================
// Admin Only Routes
// =======================================

// Create Instructor
router.post(
    "/create",
    protect,
    authorize("admin"),
    createInstructor
);

// Get All Instructors
router.get(
    "/",
    protect,
    authorize("admin"),
    getInstructors
);

// Get Single Instructor
router.get(
    "/:id",
    protect,
    authorize("admin"),
    getInstructor
);

// Update Instructor
router.put(
    "/:id",
    protect,
    authorize("admin"),
    updateInstructor
);

// Delete Instructor
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteInstructor
);

module.exports = router;