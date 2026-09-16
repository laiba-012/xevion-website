const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const User = require("../models/User");

// ======================================
// Enroll Course
// ======================================
exports.enrollCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if already in Enrollment collection
    let enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (!enrollment) {
      enrollment = await Enrollment.create({
        student: req.user._id,
        course: courseId,
      });
    }

    // Sync into User.enrolledCourses
    const user = await User.findById(req.user._id);
    if (user) {
      if (!user.enrolledCourses) user.enrolledCourses = [];
      const alreadyInUser = user.enrolledCourses.some(
        ec => ec.course && ec.course.toString() === courseId
      );
      if (!alreadyInUser) {
        user.enrolledCourses.push({
          course: courseId,
          progress: enrollment.progress || 0,
          completed: enrollment.completed || false,
          completedLessons: [],
          startedAt: new Date(),
        });
        await user.save();
      }
    }

    // Add student to Course.students if not present
    if (!course.students) course.students = [];
    if (!course.students.some(s => s && s.toString() === req.user._id.toString())) {
      course.students.push(req.user._id);
      await course.save();
    }

    res.status(200).json({
      success: true,
      message: "Course Enrolled Successfully",
      enrollment,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================
// My Enrollments
// ======================================
exports.getMyEnrollments = async (req, res) => {

  try {

    const enrollments = await Enrollment.find({
      student: req.user._id,
    }).populate("course");

    // Also sync and aggregate with user.enrolledCourses so nothing is missed
    const user = await User.findById(req.user._id).populate("enrolledCourses.course");
    const combined = [...enrollments];

    if (user && user.enrolledCourses) {
      for (const ec of user.enrolledCourses) {
        if (ec.course && !combined.some(e => e.course?._id?.toString() === ec.course._id?.toString())) {
          combined.push({
            _id: ec._id || ec.course._id,
            student: req.user._id,
            course: ec.course,
            progress: ec.progress || 0,
            completed: ec.completed || false,
            createdAt: ec.startedAt || new Date()
          });

          // Ensure Enrollment doc also exists in DB
          try {
            await Enrollment.create({
              student: req.user._id,
              course: ec.course._id,
              progress: ec.progress || 0,
              completed: ec.completed || false
            });
          } catch (e) {}
        }
      }
    }

    res.json({
      success: true,
      enrollments: combined,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ======================================
// Update Progress
// ======================================
exports.updateProgress = async (req, res) => {

  try {

    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    enrollment.progress = req.body.progress;

    await enrollment.save();

    res.json({
      success: true,
      enrollment,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ======================================
// Complete Course
// ======================================
exports.completeCourse = async (req, res) => {

  try {

    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    enrollment.completed = true;
    enrollment.progress = 100;

    await enrollment.save();

    res.json({
      success: true,
      message: "Course Completed",
      enrollment,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};