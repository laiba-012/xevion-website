const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/auth.middleware');
const {
  getStats,
  enrollCourse,
  getCourseContent,
  updateCourseProgress,
  getAnnouncements,
  getProfile,
  updateProfile,
  uploadAvatar
} = require('../controllers/user.controller');

// ===============================
// Multer Configuration for Avatar
// ===============================
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Profile Management
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/profile/avatar', protect, upload.single('avatar'), uploadAvatar);

// Dashboard
router.get('/stats', protect, getStats);
router.get('/announcements', protect, getAnnouncements);

// Course Learning
router.post('/courses/enroll', protect, enrollCourse);
router.get('/courses/:courseId/content', protect, getCourseContent);
router.put('/courses/progress', protect, updateCourseProgress);

module.exports = router;