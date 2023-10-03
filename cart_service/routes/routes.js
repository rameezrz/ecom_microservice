const express = require("express");
const router = express.Router();

const {addToCart} = require('../controllers/addToCart')
const {removeFromCart} = require('../controllers/removeFromCart')

router.post("/add-to-cart", addToCart);
router.delete("/remove-from-cart", removeFromCart);

module.exports = router;
