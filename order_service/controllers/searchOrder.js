const { searchOrder } = require("@rameezrz/db-search");

const findOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    await searchOrder(process.env.MONGO_DB_URI, orderId)
      .then((order) => {
        res.status(200).json({
          success: true,
          message: "Found matching order",
          order,
        });
      })
      .catch((error) => {
        res.status(404).json({
          success: false,
          message: error,
        });
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error... ${error.message}`,
    });
  }
};

module.exports = { findOrder };
