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
      await orderProducer(userId,"order_to_cart")
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
    newOrder.save().then(async(order) => {
      const message = {
        userId: newOrder.userId,
        products: newOrder.products.map((product) => ({
          productId: product.productId,
          quantity: product.quantity,
        })),
      };          
      await orderProducer(Buffer.from(JSON.stringify(message)),"order_created") 
      console.log("order created message sent");
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
