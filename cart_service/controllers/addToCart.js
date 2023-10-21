const Cart = require("../models/cartModel");
const amqp = require("amqplib/callback_api");

const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.cookies["userId"];
    sendProductId(productId);
    const product = await getProductDetails();
    const stock = product?.stock;
    const userCart = await Cart.findOne({ userId });
    if (userCart) {
      let productExist = userCart.products.findIndex((product) => {
        return product.item == productId;
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

function sendProductId(productId) {
  try {
    amqp.connect("amqp://localhost", (err, conn) => {
      conn.createChannel((err, ch) => {
        const queue = "cart_to_product";

        ch.assertQueue(queue, { durable: false });
        ch.sendToQueue(queue, Buffer.from(productId));

        console.log(`Sent ${productId} to ${queue}`);
      });
    });
  } catch (error) {
    console.log(error);
  }
}

function getProductDetails() {
  return new Promise((resolve, reject) => {
    amqp.connect("amqp://localhost", (err, conn) => {
      conn.createChannel((err, ch) => {
        const queue = "product_to_cart";
        ch.assertQueue(queue, { durable: true });
        console.log("Waiting for product service");
        ch.consume(
          queue,
          (msg) => {
            console.log(`received ${msg.content.toString()} from ${queue}`);
            const product = JSON.parse(msg.content.toString());
            resolve(product);
          },
          { noAck: true }
        );
      });
    });
  });
}

module.exports = { addToCart };
