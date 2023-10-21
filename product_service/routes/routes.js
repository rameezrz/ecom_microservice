const express = require("express");
const router = express.Router();

const { addProduct } = require("../controllers/addProduct");
const { editProduct } = require("../controllers/editProduct");
const { getProduct } = require("../controllers/getProduct");
const { getAllProducts } = require("../controllers/getAllProducts");
const {deleteProduct} = require("../controllers/deleteProduct")

router.post("/add-product", addProduct);
router.put("/edit-product/:id", editProduct);
router.get("/get-product/:productId", getProduct);
router.get("/get-all-products", getAllProducts);
router.delete("/delete-product/:productId", deleteProduct);

module.exports = router;
