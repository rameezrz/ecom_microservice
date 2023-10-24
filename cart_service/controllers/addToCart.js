const Cart = require("../models/cartModel");
const {cartProducer} = require('../kafka/producer')
const {cartConsumer2} = require('../kafka/consumer')

const addToCart = async (req, res) => {
  try {
    const { productId,quantity } = req.body;
    const userId = req.cookies["userId"];
    await cartProducer(productId, 'add_to_cart');
    console.log('====================================');
    console.log('add-to-cart sent');
    console.log('====================================');
    const product = await cartConsumer2();
    console.log('====================================');
    console.log(product);
    console.log('====================================');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    if (product.stock <= 0 || product.stock <= quantity) {
      return res.status(200).json({
        success: false,
        message: "Out of Stock",
      });
    }

    let userCart = await Cart.findOne({ userId });
    console.log("userCart:", userCart);
    if (userCart) {
      const productExist = userCart.products.find((cartProduct) => cartProduct.item.toString() === productId);
      console.log(productExist);
      if (productExist) {
        if (productExist.quantity < product.stock) {
          userCart = await Cart.findOneAndUpdate(
            { userId, "products.item": productId },
            {
              $inc: { "products.$.quantity": quantity },
            },
            {
              new: true,
            }
          );
        } else {
          return res.status(200).json({
            success: false,
            message: "Out of Stock",
          });
        }
      } else {
        userCart = await Cart.findOneAndUpdate(
          { userId },
          {
            $push: { products: { item: productId, quantity: quantity } },
          },
          {
            new: true,
          }
        );
      }
    } else {
      userCart = new Cart({
        userId,
        products: [{ item: productId, quantity: quantity }],
      });
      await userCart.save();
    }
    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      cart: userCart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error... ${error.message}`,
    });
  }
};



module.exports = { addToCart };
