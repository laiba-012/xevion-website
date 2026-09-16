const multer = require("multer");
const path = require("path");

// Storage
const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, "uploads/");

    },

    filename: function (req, file, cb) {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname);

        cb(null, uniqueName);

    }

});

// File Filter

const fileFilter = (req, file, cb) => {

    const allowed = /jpg|jpeg|png|webp/;

    const ext = allowed.test(
        path.extname(file.originalname).toLowerCase()
    );

    const mime = allowed.test(file.mimetype);

    if (ext && mime) {

        cb(null, true);

    } else {

        cb(new Error("Only Images Allowed"));

    }

};

module.exports = multer({

    storage,

    limits: {

        fileSize: 5 * 1024 * 1024,

    },

    fileFilter,

});