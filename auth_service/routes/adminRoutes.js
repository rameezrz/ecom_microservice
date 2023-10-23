const express = require('express')
const router = express.Router()


const {signInAdmin} = require('../controllers/signInAdmin')
const {adminLogout} = require('../controllers/adminLogout')

router.post('/login',signInAdmin)
router.delete('/logout',adminLogout)


module.exports = router