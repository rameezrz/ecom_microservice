const Cart = require("../models/cartModel");

const getUserCart = async (req, res) => {
  try {
    const userId = req.cookies["userId"];
    const cart = await Cart.findOne({ userId });
    if (cart.products.length === 0) {
      res.status(200).json({
        success: true,
        message: "User Cart is Empty",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Found matching User Cart",
        cart,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error... ${error.message}`,
    });
  }
};

module.exports = { getUserCart };
