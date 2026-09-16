const User = require("../models/User");


// ============================================
// Create Instructor
// ============================================

exports.createInstructor = async (req, res) => {

    try {

        const {

            name,
            email,
            password,
            phone,
            designation,
            qualification,
            specialization,
            experience,
            gender,
            address,
            bio,
            image

        } = req.body;

        // Check Required Fields

        if (!name || !email || !password) {

            return res.status(400).json({

                success: false,

                message: "Name, Email and Password are required"

            });

        }

        // Email Already Exists

        const existingUser = await User.findOne({

            email

        });

        if (existingUser) {

            return res.status(400).json({

                success: false,

                message: "Instructor already exists"

            });

        }

        // Create Instructor

        const instructor = await User.create({

            name,
            email,
            password,

            phone,

            designation,

            qualification,

            specialization,

            experience,

            gender,

            address,

            bio,

            image,

            role: "instructor"

        });

        res.status(201).json({

            success: true,

            message: "Instructor Created Successfully",

            instructor

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};



// ============================================
// Get All Instructors
// ============================================

// ======================================
// GET ALL INSTRUCTORS
// ======================================

exports.getInstructors = async (req, res) => {

    try {

        const instructors = await User.find({
            role: "instructor"
        }).select("-password");

        res.status(200).json({
            success: true,
            total: instructors.length,
            instructors
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};



// ============================================
// Get Single Instructor
// ============================================

exports.getInstructor = async (req, res) => {

    try {

        const instructor = await User.findById(

            req.params.id

        );

        if (!instructor) {

            return res.status(404).json({

                success: false,

                message: "Instructor Not Found"

            });

        }

        res.json({

            success: true,

            instructor

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};




// ============================================
// Update Instructor
// ============================================

exports.updateInstructor = async (req, res) => {

    try {

        const instructor = await User.findByIdAndUpdate(

            req.params.id,

            req.body,

            {

                new: true

            }

        );

        res.json({

            success: true,

            message: "Instructor Updated Successfully",

            instructor

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};




// ============================================
// Delete Instructor
// ============================================

exports.deleteInstructor = async (req, res) => {

    try {

        await User.findByIdAndDelete(

            req.params.id

        );

        res.json({

            success: true,

            message: "Instructor Deleted Successfully"

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};