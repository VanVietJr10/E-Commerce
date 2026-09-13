const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authenticate = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");

router.get("/", categoryController.getCategory);

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  categoryController.createCategory,
);

module.exports = router;
