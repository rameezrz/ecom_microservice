const express = require("express");
const router = express.Router();


const { getProduct } = require("../controllers/getProduct");
const { getAllProducts } = require("../controllers/getAllProducts");
const {findProduct} = require('../controllers/searchProduct')

router.get("/get-product/:productId", getProduct);
router.get("/get-all-products", getAllProducts);
router.get("/search/:search",findProduct)

module.exports = router;
