const Cart = require("../models/cartModel");
const {cartProducer} = require('../kafka/producer')
const {cartConsumer2} = require('../kafka/consumer')

const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.cookies["userId"];
    await cartProducer(productId,'add_to_cart');
    console.log('add-to-cart sent');
    const product = await cartConsumer2();
    const stock = product.stock;
    const userCart = await Cart.findOne({ userId });
    if (userCart) {
      let productExist = userCart.products.findIndex((product) => {
        return product._id == productId;
      });
      if (productExist != -1) {
        if (userCart.products[productExist].quantity < stock) {
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
          res.status(200).json({
            success: false,
            message: "Out of Stock",
          });
        }
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
