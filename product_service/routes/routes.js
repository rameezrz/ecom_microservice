const express = require("express");
const router = express.Router();

const { addProduct } = require("../controllers/addProduct");
const { editProduct } = require("../controllers/editProduct");

router.post("/add-product", addProduct);
router.put("/edit-product/:id", editProduct)

module.exports = router;
