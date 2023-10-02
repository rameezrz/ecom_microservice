const express = require('express')
const router = express.Router()

const { userSignUp } = require('../controllers/registerUser')
const {userSignIn} = require('../controllers/signInUser')

router.post('/register', userSignUp)
router.post('/login',userSignIn)


module.exports = router