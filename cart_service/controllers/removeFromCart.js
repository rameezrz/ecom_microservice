const Cart = require("../models/cartModel");

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.cookies['userId'];
    console.log(productId);
    console.log(userId);
    const userCart = await Cart.findOne({ userId });
    if (userCart) {
      // Check if the product exists in the user's cart
      const productIndex = userCart.products.findIndex(
        (product) => product.item == productId
      );

      if (productIndex !== -1) {
        // Remove the product from the cart
        userCart.products.splice(productIndex, 1);
        
        // Save the updated cart
        const newCart = await userCart.save();
        
        res.status(200).json({
          success: true,
          message: "Product removed from cart successfully",
          cart: newCart,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "No matching product found in the cart",
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "No matching cart found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error... ${error.message}`,
    });
  }
};

module.exports = { removeFromCart };
