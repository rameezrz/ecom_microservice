const Order = require('../models/orderModel')

const getAllOrders = async(req,res)=>{
    try {
        const orders = await Order.find();
        if (orders.length===0) {
          return res.status(404).json({
            success: true,
            message: "No orders in the Database",
          });
        }
        res.status(200).json({
          success: true,
          message: "Found orders",
          orders,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: `Internal server error... ${error.message}`,
        });
      }
}

module.exports = {getAllOrders}