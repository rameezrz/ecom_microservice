const Order = require('../models/orderModel')

const getUserAllOrders = async (req, res) => {
    try {
        const userId = req.cookies['userId'];

        const orders = await Order.find({ userId });

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No orders found for the user",
            });
        }

        res.status(200).json({
            success: true,
            message: "Found user's orders",
            orders,
        });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({
            success: false,
            message: `Internal server error... ${error.message}`,
        });
    }
};

module.exports = {getUserAllOrders}
