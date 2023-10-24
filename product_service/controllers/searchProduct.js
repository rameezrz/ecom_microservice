const { searchProduct } = require("@rameezrz/db-search");

const findProduct = async (req, res) => {
  try {
    const query = req.params.search;
    await searchProduct(process.env.MONGO_DB_URI, query)
      .then((products) => {
        res.status(200).json({
          success: true,
          message: "Found matching products",
          products,
        });
      })
      .catch((error) => {
        res.status(404).json({
          success: false,
          message: error,
        });
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error... ${error.message}`,
    });
  }
};

module.exports = { findProduct };
