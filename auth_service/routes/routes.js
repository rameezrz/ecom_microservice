const express = require('express')
const router = express.Router()

const { userSignUp } = require('../controllers/registerUser')
const {userSignIn} = require('../controllers/signInUser')
const {signInAdmin} = require('../controllers/signInAdmin')

router.post('/register', userSignUp)
router.post('/login',userSignIn)
router.post('/admin-login',signInAdmin)


module.exports = router