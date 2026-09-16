const Module = require("../models/Module");

// ==========================
// Create Module
// ==========================
exports.createModule = async (req, res) => {
  try {
    const module = await Module.create({
      title: req.body.title,
      course: req.body.course,
      order: req.body.order,
    });

    res.status(201).json({
      success: true,
      module,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Get Modules of a Course
// ==========================
exports.getModules = async (req, res) => {
  try {
   const modules = await Module.find({
  course: req.params.courseId,
}).sort({ order: 1 });

    res.json({
      success: true,
      modules,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    module.title = req.body.title || module.title;
    module.order = req.body.order || module.order;

    await module.save();

    res.json({
      success: true,
      message: "Module Updated Successfully",
      module,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    await module.deleteOne();

    res.json({
      success: true,
      message: "Module Deleted Successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};