const Blog = require('../models/Blog');

// Get All Blogs
exports.getBlogs = async (req, res) => {
  try {
    const filter = {};
    if (!req.user || req.user.role !== 'admin') {
      filter.isPublished = true;
    }
    const blogs = await Blog.find(filter)
      .populate('author', 'name email image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: blogs,
      total: blogs.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Blog
exports.getBlog = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ $or: [{ slug }, { _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : null }] })
      .populate('author', 'name email image');

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    blog.views = (blog.views || 0) + 1;
    await blog.save();

    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create Blog
exports.createBlog = async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, isPublished, isFeatured, featured } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const blog = await Blog.create({
      title,
      content,
      excerpt: excerpt || content.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...',
      category: category || 'general',
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
      isPublished: isPublished !== undefined ? isPublished : true,
      featured: isFeatured || featured || false,
      author: req.user?._id || req.body.author
    });

    const populated = await Blog.findById(blog._id).populate('author', 'name email image');

    res.status(201).json({ success: true, data: populated, message: 'Blog created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Blog
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const { title, content, excerpt, category, tags, isPublished, isFeatured, featured } = req.body;

    if (title) blog.title = title;
    if (content) blog.content = content;
    if (excerpt !== undefined) blog.excerpt = excerpt;
    if (category) blog.category = category;
    if (tags !== undefined) {
      blog.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
    }
    if (isPublished !== undefined) blog.isPublished = isPublished;
    if (isFeatured !== undefined || featured !== undefined) {
      blog.featured = isFeatured ?? featured;
    }

    await blog.save();
    const populated = await Blog.findById(blog._id).populate('author', 'name email image');

    res.status(200).json({ success: true, data: populated, message: 'Blog updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Blog
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    await Blog.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
