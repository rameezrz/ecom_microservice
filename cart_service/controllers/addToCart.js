const Cart = require("../models/cartModel");

const addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const userCart = await Cart.findOne({ userId });
    if (userCart) {
      let productExist = userCart.products.findIndex((product) => {
        return product.item == productId;
      });
      if (productExist != -1) {
        await Cart.findOneAndUpdate(
          { userId, "products.item": productId },
          {
            $inc: { "products.$.quantity": 1 },
          },
          {
            new: true,
          }
        ).then((cart) => {
          res.status(200).json({
            success: true,
            message: "Product added to cart successfully",
            cart,
          });
        });
      } else {
        await Cart.findOneAndUpdate(
          { userId },
          {
            $push: { products: { item: productId, quantity: 1 } },
          },
          {
            new: true,
          }
        ).then((cart) => {
          res.status(200).json({
            success: true,
            message: "Product added to cart successfully",
            cart,
          });
        });
      }
    } else {
      const newCart = new Cart({
        userId,
        products: [{ item: productId, quantity: 1 }],
      });
      newCart.save().then((cart) => {
        res.status(200).json({
          success: true,
          message: "Product added to cart successfully",
          cart,
        });
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error... ${error.message}`,
    });
  }
};

module.exports = { addToCart };
