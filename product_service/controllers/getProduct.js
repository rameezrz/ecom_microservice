const Product = require("../models/productModel");

const getProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    console.log(product);
    if (!product) {
      return res.status(200).json({
        success: false,
        message: "No Matching product Found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Found matching product",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error... ${error.message}`,
    });
  }
};

module.exports = { getProduct };
