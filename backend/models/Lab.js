const mongoose = require('mongoose');

const LabSchema = new mongoose.Schema({
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
    enum: ['linux', 'network', 'web', 'crypto', 'reverse', 'forensics'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    required: true
  },
  // For web-based Linux
  containerImage: {
    type: String,
    default: 'ubuntu:latest'
  },
  containerCommand: {
    type: String,
    default: '/bin/bash'
  },
  // Lab content
  instructions: {
    type: String,
    required: true
  },
  initialCode: {
    type: String,
    default: ''
  },
  solution: {
    type: String,
    default: ''
  },
  hints: [String],
  // Scoring
  points: {
    type: Number,
    default: 100
  },
  // Completion tracking
  completedBy: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    completedAt: { type: Date, default: Date.now }
  }],
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
LabSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

module.exports = mongoose.model('Lab', LabSchema);