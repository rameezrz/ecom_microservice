const express = require("express");
const router = express.Router();

const {addToCart} = require('../controllers/addToCart')
const {removeFromCart} = require('../controllers/removeFromCart')
const {getUserCart} = require('../controllers/getUserCart')


router.get('/get-user-cart',getUserCart)
router.post("/add-to-cart", addToCart);
router.delete("/remove-from-cart/:productId", removeFromCart);

module.exports = router;
