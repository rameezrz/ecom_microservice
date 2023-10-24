const express = require("express");
const router = express.Router();


const { getAllOrders } = require("../controllers/getAllOrders");
const {findOrder} = require('../controllers/searchOrder')



router.get("/get-all-orders", getAllOrders);
router.get("/search/:orderId",findOrder)


module.exports = router;