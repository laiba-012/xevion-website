const express = require('express');
const router = express.Router();
const { getBlogs, getBlog, createBlog, updateBlog, deleteBlog } = require('../controllers/blogcontroller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/', getBlogs);
router.get('/:slug', getBlog);

router.post('/', protect, authorize('admin', 'instructor'), createBlog);
router.put('/:id', protect, authorize('admin', 'instructor'), updateBlog);
router.delete('/:id', protect, authorize('admin', 'instructor'), deleteBlog);

module.exports = router;
