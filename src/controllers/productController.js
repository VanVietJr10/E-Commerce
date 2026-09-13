const { success } = require("zod");
const prisma = require("../config/db");

exports.getProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, categoryId } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const where = categoryId ? { categoryId: Number(categoryId) } : {};

    const [product, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limitNum,
        include: { category: true },
      }),
      prisma.product.count({ where }),
    ]);
    res.json({
      success: true,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
      data: product,
    });
  } catch (e) {
    next(e);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { name, price, stock, imageUrl, categoryId } = req.body;
    if (!name || !price) {
      res.status(400).json({
        success: false,
        message: "Ten san pham va gia khong duoc de trong",
      });
    }
    const product = await prisma.product.create({
      data: {
        name,
        price: Number(price),
        stock: Number(stock),
        imageUrl,
        categoryId: categoryId ? Number(categoryId) : null,
      },
    });
    res.status(201).json({
      success: true,
      message: "Tao thanh cong san pham",
      data: product,
    });
  } catch (e) {
    next(e);
  }
};
