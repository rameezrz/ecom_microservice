const Order = require("../models/orderModel");

const createOrder = (req, res) => {
    try {
    const {
      userId,
      totalAmount,
      paymentMethod,
      deliveryAddress,
      productId,
      quantity,
      price,
      } = req.body;
      
    const newOrder = new Order({
      userId,
      totalAmount,
      paymentMethod,
      deliveryAddress,
      products: {
        item: productId,
        quantity,
        price,
      },
    });
    newOrder.save().then((order) => {
      res.status(200).json({
        success: true,
        message: "Order created successfully",
        order,
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error... ${error.message}`,
    });
  }
};

module.exports = {createOrder}
