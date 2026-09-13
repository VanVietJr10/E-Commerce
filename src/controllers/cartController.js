const { number, success } = require("zod");
const prisma = require("../config/db");

exports.addToCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity = 1 } = req.body;

    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: Number(productId),
      },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + Number(quantity) },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: Number(productId),
          quantity: Number(quantity),
        },
      });
    }
    res.status(201).json({
      success: true,
      message: "Da them thanh cong san pham",
    });
  } catch (e) {
    next(e);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    if (!cart) {
      return res.json({
        success: true,
        data: {
          items: [],
          totalAmount: 0,
        },
      });
    }
    const totalAmount = cart.items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    });

    res.status(201).json({
      success: true,
      data: {
        cartId: cart.id,
        items: cart.items,
        totalAmount,
      },
    });
  } catch (e) {
    next(e);
  }
};
