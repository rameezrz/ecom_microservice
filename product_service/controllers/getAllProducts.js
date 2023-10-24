const Product = require("../models/productModel");

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (products.length===0) {
      return res.status(404).json({
        success: true,
        message: "No Products in the Database",
      });
    }
    res.status(200).json({
      success: true,
      message: "Found products",
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error... ${error.message}`,
    });
  }
};

module.exports = { getAllProducts };
