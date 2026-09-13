const { date, includes, success } = require("zod");
const prisma = require("../config/db");

exports.createOrder = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length == 0) {
      return res.status(400).json({ message: "Gio hang cua ban dang trong" });
    }

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        res.status(400).json({
          message: `San pham ${item.product.name} khong du so luong trong kho`,
        });
      }
    }

    const totalAmount = cart.items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          status: "PENDING",
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              price: item.product.price,
              quantity: item.quantity,
            })),
          },
        },
        include: { items: true },
      });
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    res.status(201).json({
      success: true,
      message: "Dat hang thanh cong",
      data: order,
    });
  } catch (e) {
    next(e);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: orders });
  } catch (e) {
    next(e);
  }
};
