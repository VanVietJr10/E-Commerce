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
    const { name, price, description, stock, imageUrl, categoryId } = req.body;
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
        description,
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

exports.updateProduct = async (req, res) => {
  try {
    const productId = Number(req.params.id);
    const { name, price, stock, imageUrl, description } = req.body;

    // Kiểm tra sản phẩm có tồn tại không
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
    }

    // Tiến hành cập nhật
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name: name !== undefined ? name : existingProduct.name,
        price: price !== undefined ? Number(price) : existingProduct.price,
        stock: stock !== undefined ? Number(stock) : existingProduct.stock,
        imageUrl: imageUrl !== undefined ? imageUrl : existingProduct.imageUrl,
        description:
          description !== undefined ? description : existingProduct.description,
      },
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi cập nhật sản phẩm: " + error.message });
  }
};

// 🟢 4. MỚI: Xóa sản phẩm (DELETE /api/products/:id)
exports.deleteProduct = async (req, res) => {
  try {
    const productId = Number(req.params.id);

    // Kiểm tra sản phẩm có tồn tại không
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm để xóa!" });
    }

    // Xóa sản phẩm khỏi CSDL
    await prisma.product.delete({
      where: { id: productId },
    });

    res.status(200).json({ message: "Xóa sản phẩm thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa sản phẩm: " + error.message });
  }
};
