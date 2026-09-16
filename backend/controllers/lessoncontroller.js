const Lesson = require("../models/Lesson");
const Module = require("../models/Module");

// ======================================
// Create Lesson
// ======================================

exports.createLesson = async (req, res) => {

  try {

    const {
      title,
      module,
      description,
      videoUrl,
      pdf,
      duration,
      order,
      resources,
      isPublished,
    } = req.body;

    // Validation

    if (!title || !module) {

      return res.status(400).json({

        success: false,

        message: "Title and Module are required.",

      });

    }

    // Check Module

    const moduleExists = await Module.findById(module);

    if (!moduleExists) {

      return res.status(404).json({

        success: false,

        message: "Module not found.",

      });

    }

    const lesson = await Lesson.create({

      title,

      module,

      description,

      videoUrl,

      pdf,

      duration,

      order,

      resources,

      isPublished,

      createdBy: req.user._id,

    });

    const populatedLesson = await Lesson.findById(lesson._id)

      .populate("module", "title")

      .populate("createdBy", "name email");

    res.status(201).json({

      success: true,

      message: "Lesson created successfully.",

      lesson: populatedLesson,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

// ======================================
// Get All Lessons
// ======================================

exports.getLessons = async (req, res) => {

  try {

    const lessons = await Lesson.find()

      .populate("module", "title")

      .populate("createdBy", "name email")

      .sort({ order: 1 });

    res.status(200).json({

      success: true,

      totalLessons: lessons.length,

      lessons,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

// ======================================
// Get Single Lesson
// ======================================

exports.getLesson = async (req, res) => {

  try {

    const lesson = await Lesson.findById(req.params.id)

      .populate("module", "title")

      .populate("createdBy", "name email");

    if (!lesson) {

      return res.status(404).json({

        success: false,

        message: "Lesson not found.",

      });

    }

    res.status(200).json({

      success: true,

      lesson,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};


// ======================================
// Get Lessons By Module
// ======================================

exports.getLessonsByModule = async (req, res) => {

  try {

    const lessons = await Lesson.find({
      module: req.params.moduleId,
    })
      .populate("module", "title")
      .populate("createdBy", "name email")
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      totalLessons: lessons.length,
      lessons,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ======================================
// Update Lesson
// ======================================

exports.updateLesson = async (req, res) => {

  try {

    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {

      return res.status(404).json({
        success: false,
        message: "Lesson not found.",
      });

    }

    lesson.title = req.body.title || lesson.title;
    lesson.description = req.body.description || lesson.description;
    lesson.videoUrl = req.body.videoUrl || lesson.videoUrl;
    lesson.pdf = req.body.pdf || lesson.pdf;
    lesson.duration = req.body.duration || lesson.duration;

    lesson.order =
      req.body.order !== undefined
        ? req.body.order
        : lesson.order;

    lesson.isPublished =
      req.body.isPublished !== undefined
        ? req.body.isPublished
        : lesson.isPublished;

    lesson.resources =
      req.body.resources || lesson.resources;

    // Module change

    if (req.body.module) {

      const moduleExists = await Module.findById(
        req.body.module
      );

      if (!moduleExists) {

        return res.status(404).json({
          success: false,
          message: "Module not found.",
        });

      }

      lesson.module = req.body.module;

    }

    await lesson.save();

    const updatedLesson = await Lesson.findById(
      lesson._id
    )
      .populate("module", "title")
      .populate("createdBy", "name email");

    res.status(200).json({

      success: true,

      message: "Lesson updated successfully.",

      lesson: updatedLesson,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

// ======================================
// Delete Lesson
// ======================================

exports.deleteLesson = async (req, res) => {

  try {

    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {

      return res.status(404).json({

        success: false,

        message: "Lesson not found.",

      });

    }

    await lesson.deleteOne();

    res.status(200).json({

      success: true,

      message: "Lesson deleted successfully.",

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};