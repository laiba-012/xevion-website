const mongoose = require('mongoose');

const LearningPathSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  category: {
    type: String,
    enum: ['cybersecurity', 'programming', 'ai-ml', 'networking', 'osint', 'ctf'],
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  // Courses in this path
  courses: [{
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    order: { type: Number },
    required: { type: Boolean, default: true }
  }],
  // Labs in this path
  labs: [{
    lab: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab' },
    order: { type: Number },
    required: { type: Boolean, default: true }
  }],
  duration: {
    type: Number, // in weeks
    default: 4
  },
  participants: {
    type: Number,
    default: 0
  },
  thumbnail: {
    type: String,
    default: null
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create slug before saving
LearningPathSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

module.exports = mongoose.model('LearningPath', LearningPathSchema);