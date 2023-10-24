const express = require('express')
const router = express.Router()

const {createOrder} = require('../controllers/createOrder')
const {getUserAllOrders} = require('../controllers/getUserAllOrders')

router.post('/place-order',createOrder)
router.get('/get-all-orders',getUserAllOrders)

module.exports = router