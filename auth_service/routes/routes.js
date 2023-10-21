const express = require('express')
const router = express.Router()

const { userSignUp } = require('../controllers/registerUser')
const {userSignIn} = require('../controllers/signInUser')
const {userLogout} = require('../controllers/userLogout')
const {signInAdmin} = require('../controllers/signInAdmin')

router.post('/register', userSignUp)
router.post('/login',userSignIn)
router.delete('/logout',userLogout)
router.post('/admin-login',signInAdmin)


module.exports = router