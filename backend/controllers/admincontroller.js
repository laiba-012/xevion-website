const User = require("../models/User");
const Course = require("../models/Course");
const Module = require("../models/Module");
const Lesson = require("../models/Lesson");
const Blog = require("../models/Blog");
const Event = require("../models/Event");
const Sponsor = require("../models/Sponsor");

// =========================================
// GET DASHBOARD
// =========================================

exports.getDashboard = async (req, res) => {

    try {

        const totalUsers = await User.countDocuments();

        const totalInstructors = await User.countDocuments({
            role: "instructor",
        });

        const totalCourses = await Course.countDocuments();

        const totalModules = await Module.countDocuments();

        const totalLessons = await Lesson.countDocuments();

        const totalBlogs = await Blog.countDocuments();

        const totalEvents = await Event.countDocuments();

        const totalSponsors = await Sponsor.countDocuments();

        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(5);

        const recentCourses = await Course.find()
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({

            success: true,

            stats: {
                totalUsers,
                totalInstructors,
                totalCourses,
                totalModules,
                totalLessons,
                totalBlogs,
                totalEvents,
                totalSponsors,
            },

            recentUsers,

            recentCourses,

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message,

        });

    }

};

// =========================================
// GET ALL USERS
// =========================================

exports.getUsers = async (req, res) => {

  try {

    const users = await User.find({
      role: "student",
    })
      .select("-password")
      .populate("courses", "title")
      .sort({ createdAt: -1 });

    res.json({

      success: true,

      totalStudents: users.length,

      users,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

// =========================================
// DELETE USER
// =========================================

exports.deleteUser = async (req, res) => {

    try {

        await User.findByIdAndDelete(req.params.id);

        res.json({

            success: true,

            message: "User Deleted Successfully",

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// =========================================
// UPDATE USER STATUS
// =========================================

exports.updateUserStatus = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found",

            });

        }

        user.isActive = !user.isActive;

        await user.save();

        res.json({

            success: true,

            message: "Status Updated",

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};