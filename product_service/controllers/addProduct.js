const Product = require("../models/productModel");

const addProduct = (req, res) => {
  try {
    const { name, category, price, stock } = req.body;
    const newProduct = new Product({
      name,
      category,
      price,
      stock,
    });
    newProduct.save().then((product) => {
      res.json({
        success: true,
        message: `${name} added successfully`,
        product: {
          Id: product._id,
          name: product.name,
          category: product.category,
          price: product.price,
          stock: product.stock,
        },
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error... ${error.message}`,
    });
  }
};

module.exports = {addProduct}
