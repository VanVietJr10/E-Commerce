const { success } = require("zod");
const prisma = require("../config/db");
const { ca } = require("zod/v4/locales");

exports.getCategory = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: { products: true },
    });
    res.json({ success: true, data: categories });
  } catch (e) {
    next(e);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ message: "Ten danh muc khong duoc de trong" });
    }
    const category = await prisma.category.create({
      data: { name },
    });
    res.status(201).json({
      success: true,
      message: "Tao thanh cong danh muc",
      data: category,
    });
  } catch (e) {
    next(e);
  }
};
