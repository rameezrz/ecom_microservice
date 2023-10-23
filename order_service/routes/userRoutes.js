const express = require('express')
const router = express.Router()

const {createOrder} = require('../controllers/createOrder')

router.post('/place-order',createOrder)

module.exports = router