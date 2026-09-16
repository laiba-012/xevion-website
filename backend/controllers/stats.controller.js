const User = require('../models/User');
const Course = require('../models/Course');
const Blog = require('../models/Blog');
const Event = require('../models/Event');

// ============================================
// GET HOME PAGE STATS
// ============================================
exports.getHomeStats = async (req, res) => {
  try {
    // ✅ Real database se stats fetch karein
    const [totalUsers, totalCourses, totalEvents, totalBlogs] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments({ status: "Published" }),
      Event.countDocuments(),
      Blog.countDocuments()
    ]);

    res.json({
      success: true,
      data: {
        community: totalUsers,
        courses: totalCourses,
        events: totalEvents,
        blogs: totalBlogs
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};