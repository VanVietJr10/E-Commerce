const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authenticate = require("../middlewares/auth");
const { route } = require("./authRoutes");

router.use(authenticate);

router.get("/", cartController.getCart);
router.post("/add", cartController.addToCart);

module.exports = router;
