const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/auth");
const orderController = require("../controllers/orderController");

router.use(authenticate);

router.get("/", orderController.getMyOrders);
router.post("/", orderController.createOrder);

module.exports = router;
