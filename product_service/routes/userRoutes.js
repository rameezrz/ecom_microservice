const express = require("express");
const router = express.Router();


const { getProduct } = require("../controllers/getProduct");
const { getAllProducts } = require("../controllers/getAllProducts");

router.get("/get-product/:productId", getProduct);
router.get("/get-all-products", getAllProducts);

module.exports = router;
