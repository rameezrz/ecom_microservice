const Product = require("../models/productModel");

const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, stock } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        category,
        price,
        stock,
      },
      {
        new: true,
      }
    );
    if (updatedProduct) {
      res.status(200).json({
        success: true,
        message: "Product Edited Successfully",
        product: {
          Id: updatedProduct._id,
          name: updatedProduct.name,
          category: updatedProduct.category,
          price: updatedProduct.price,
          stock: updatedProduct.stock,
        },
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Product not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error... ${error.message}`,
    });
  }
};

module.exports = { editProduct };
