require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./src/routes/authRoutes");
const errorHandler = require("./src/middlewares/error");
const categoryRoutes = require("./src/routes/categoryRoutes");
const productRoutes = require("./src/routes/productRoutes");
const cartRoutes = require("./src/routes/cartRoutes");
const orderRoutes = require("./src/routes/orderRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`E-Commerce API running on port ${PORT}`);
});
