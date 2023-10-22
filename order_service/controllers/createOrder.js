const Order = require("../models/orderModel");
const {orderProducer} = require('../kafka/producer')
const {orderConsumer} = require('../kafka/consumer')

const createOrder = async(req, res) => {
    try {
    const {
      paymentMethod,
      deliveryAddress,
      } = req.body;

      const userId = req.cookies['userId']
      console.log(userId);
      await orderProducer(userId)
      const products = await orderConsumer()
      if(products.length===0){
        return res.status(300).json({
          success: false,
          message: `User Cart is Empty`,
        });
      }
      const totalAmount = products.reduce((total,product)=>{
        const {quantity,price} = product
        return total+(quantity*price)
      },0)
          
    const newOrder = new Order({
      userId,
      totalAmount,
      paymentMethod,
      deliveryAddress,
      products
    });
    console.log(newOrder);
    newOrder.save().then((order) => {
      console.log("new order saved");
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
