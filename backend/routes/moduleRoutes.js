const express = require("express");

const router = express.Router();

const {
  createModule,
  getModules,
  updateModule,
  deleteModule,
} = require("../controllers/modulecontroller");

const {
  protect,
  authorize,
} = require("../middleware/auth.middleware");

router.post(
  "/create",
  protect,
  authorize("instructor", "admin"),
  createModule
);

router.get(
  "/:courseId",
  protect,
  getModules
);


router.put(
  "/:id",
  protect,
  authorize("admin", "instructor"),
  updateModule
);

router.delete(
  "/:id",
  protect,
  authorize("admin", "instructor"),
  deleteModule
);
module.exports = router;