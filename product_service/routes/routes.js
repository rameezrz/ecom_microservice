const express = require("express");
const router = express.Router();

const { addProduct } = require("../controllers/addProduct");
const { editProduct } = require("../controllers/editProduct");
const { getProduct } = require("../controllers/getProduct");

router.post("/add-product", addProduct);
router.put("/edit-product/:id", editProduct);
router.get("/get-product/:productId", getProduct);

module.exports = router;
