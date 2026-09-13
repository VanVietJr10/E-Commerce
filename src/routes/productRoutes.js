const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authenticate = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");

router.get("/", productController.getProducts);
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  productController.createProduct,
);

module.exports = router;
