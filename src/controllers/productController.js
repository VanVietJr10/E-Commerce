const prisma = require("../config/db");
const { search } = require("../routes/productRoutes");

exports.getProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, categoryId } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const where = {};

    if (categoryId) {
      where.categoryId = Number(categoryId);
    }

    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    const [product, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limitNum,
        include: { category: true },
        orderBy: { id: "desc" },
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

// 2. Tạo sản phẩm mới
exports.createProduct = async (req, res, next) => {
  try {
    const { name, price, description, stock, imageUrl, categoryId } = req.body;

    // 🟢 CÓ RETURN Ở ĐÂY ĐỂ CHẶN KHÔNG BỊ CHẠY TIẾP
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Tên sản phẩm và giá không được để trống",
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        price: Number(price),
        description,
        stock: Number(stock) || 0,
        imageUrl,
        categoryId: categoryId ? Number(categoryId) : null,
      },
    });

    res.status(201).json({
      success: true,
      message: "Tạo thành công sản phẩm",
      data: product,
    });
  } catch (e) {
    next(e);
  }
};

// 3. Cập nhật sản phẩm (PUT /api/products/:id)
exports.updateProduct = async (req, res, next) => {
  try {
    const productId = Number(req.params.id);
    const { name, price, stock, imageUrl, description, categoryId } = req.body;

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
        categoryId:
          categoryId !== undefined
            ? categoryId
              ? Number(categoryId)
              : null
            : existingProduct.categoryId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Cập nhật sản phẩm thành công!",
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// 4. Xóa sản phẩm (DELETE /api/products/:id)
exports.deleteProduct = async (req, res, next) => {
  try {
    const productId = Number(req.params.id);

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm để xóa!" });
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    res
      .status(200)
      .json({ success: true, message: "Xóa sản phẩm thành công!" });
  } catch (error) {
    next(error);
  }
};
