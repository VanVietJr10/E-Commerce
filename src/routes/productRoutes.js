const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authenticate = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");
const uploadCloud = require("../config/cloudinary");

router.post(
  "/upload",
  authenticate,
  authorize("ADMIN"),
  uploadCloud.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "Chưa chọn file ảnh!" });
    }
    return res.status(200).json({ imageUrl: req.file.path });
  },
);

router.get("/", productController.getProducts);
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  productController.createProduct,
);

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  productController.updateProduct,
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  productController.deleteProduct,
);

module.exports = router;
