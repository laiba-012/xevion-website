const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
{
    // ===============================
    // Basic Information
    // ===============================

    name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
        minlength: 6,
    },

    // ===============================
    // Role
    // ===============================

    role: {
        type: String,
        enum: ["user", "instructor", "admin"],
        default: "user",
    },

    // ===============================
    // Instructor Profile
    // ===============================

    phone: {
        type: String,
        default: "",
    },

    designation: {
        type: String,
        default: "",
    },

    qualification: {
        type: String,
        default: "",
    },

    specialization: {
        type: String,
        default: "",
    },

    experience: {
        type: String,
        default: "",
    },

    gender: {
        type: String,
        enum: ["Male", "Female", "Other", ""],
        default: "",
    },

    address: {
        type: String,
        default: "",
    },

    bio: {
        type: String,
        default: "",
    },

    image: {
        type: String,
        default: "https://i.pravatar.cc/300",
    },

    // ===============================
    // Status
    // ===============================

    isActive: {
        type: Boolean,
        default: true,
    },

    // ===============================
    // Enrolled Courses & Progress
    // ===============================
    enrolledCourses: [
      {
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        },
        progress: {
          type: Number,
          default: 0,
        },
        completed: {
          type: Boolean,
          default: false,
        },
        completedLessons: [Number],
        startedAt: {
          type: Date,
          default: Date.now,
        },
        lastAccessed: {
          type: Date,
          default: Date.now,
        }
      }
    ],

    xp: {
      type: Number,
      default: 0,
    },

    level: {
      type: Number,
      default: 1,
    },

    badges: [
      {
        name: String,
        icon: String,
        earnedAt: { type: Date, default: Date.now }
      }
    ],

    streak: {
      current: { type: Number, default: 1 },
      longest: { type: Number, default: 1 },
      lastActivity: { type: Date, default: Date.now }
    },

},
{
    timestamps: true,
}
);

// ======================================
// Hash Password Before Saving
// ======================================

UserSchema.pre("save", async function () {

    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);

});

// ======================================
// Compare Password
// ======================================

UserSchema.methods.comparePassword = async function (password) {

    return await bcrypt.compare(password, this.password);

};

module.exports = mongoose.model("User", UserSchema);