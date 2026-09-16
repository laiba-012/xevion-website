const mongoose = require("mongoose");
const Course = require("../models/Course");
const Module = require("../models/Module");
const Lesson = require("../models/Lesson");

// ======================================
// Create Course
// ======================================

exports.createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      level,
      price,
      duration,
      thumbnail,
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    const course = await Course.create({
      title,
      description,
      category,
      level: level || "Beginner",
      price: price || 0,
      duration: duration || "0 Hours",
      thumbnail: thumbnail || "",

      // Instructor khud hi assign hoga ya body se
      instructor: req.body.instructor || req.user._id,

      // Course published by default so it shows up immediately
      status: "Published",
      publishedAt: new Date(),
    });

    const newCourse = await Course.findById(course._id)
      .populate("instructor", "name email");

    res.status(201).json({
      success: true,
      message: "Course created successfully.",
      course: newCourse,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



// ======================================
// Get All Courses
// ======================================

exports.getCourses = async (req, res) => {
  try {

    let courses;

    if (req.user && req.user.role === "admin") {

      // Admin sab courses dekhega
      courses = await Course.find()
        .populate("instructor", "name email")
        .sort({ createdAt: -1 });

    } else {

      // Student/Public sirf published
      courses = await Course.find({
        status: "Published",
      })
        .populate("instructor", "name email")
        .sort({ createdAt: -1 });

    }

    res.status(200).json({
      success: true,
      totalCourses: courses.length,
      courses,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// ======================================
// Get Single Course
// ======================================

exports.getCourse = async (req, res) => {
  try {
    const { id } = req.params;
    let course = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      course = await Course.findById(id).populate("instructor", "name email");
    }

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    // Also fetch modules and lessons for this course
    const modules = await Module.find({ course: course._id }).sort({ order: 1 });
    const moduleIds = modules.map(m => m._id);
    const lessons = await Lesson.find({ module: { $in: moduleIds } }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      course: {
        ...course.toObject(),
        modules,
        lessons,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================
// Get My Courses (Instructor/Admin)
// ======================================

exports.getMyCourses = async (req, res) => {
  try {

    let courses;

    if (req.user.role === "admin") {

      courses = await Course.find()
        .populate("instructor", "name email")
        .sort({ createdAt: -1 });

    } else {

      courses = await Course.find({
        instructor: req.user._id,
      })
        .populate("instructor", "name email")
        .sort({ createdAt: -1 });

    }

    res.status(200).json({
      success: true,
      totalCourses: courses.length,
      courses,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



// ======================================
// Get Pending Courses (Admin)
// ======================================

exports.getPendingCourses = async (req, res) => {
  try {

    const courses = await Course.find({
      status: "Pending",
    })
      .populate("instructor", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalCourses: courses.length,
      courses,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================
// Update Course
// ======================================

exports.updateCourse = async (req, res) => {
  try {

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Instructor sirf apna course edit kar sakta hai
    if (
      req.user.role === "instructor" &&
      course.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    course.title = req.body.title || course.title;
    course.description = req.body.description || course.description;
    course.category = req.body.category || course.category;
    course.level = req.body.level || course.level;
    course.price = req.body.price ?? course.price;
    course.duration = req.body.duration || course.duration;
    course.thumbnail = req.body.thumbnail || course.thumbnail;

    // Instructor edit kare to admin dobara approve karega
    if (req.user.role === "instructor") {
      course.status = "Pending";
    }

    // Sirf admin status change karega
    if (req.user.role === "admin" && req.body.status) {
      course.status = req.body.status;
    }

    await course.save();

    const updatedCourse = await Course.findById(course._id)
      .populate("instructor", "name email");

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course: updatedCourse,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



// ======================================
// Delete Course
// ======================================

exports.deleteCourse = async (req, res) => {
  try {

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Instructor sirf apna course delete kare
    if (
      req.user.role === "instructor" &&
      course.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await course.deleteOne();

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================
// Approve Course
// ======================================

exports.approveCourse = async (req, res) => {
  try {

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    course.status = "Published";

    await course.save();

    res.status(200).json({
      success: true,
      message: "Course approved successfully",
      course,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// ======================================
// Reject Course
// ======================================

exports.rejectCourse = async (req, res) => {
  try {

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    course.status = "Rejected";

    await course.save();

    res.status(200).json({
      success: true,
      message: "Course rejected successfully",
      course,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};