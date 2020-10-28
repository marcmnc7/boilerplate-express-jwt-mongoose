const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')
const { allow } = require('../middlewares/allow')

router.post('/login', allow(['*']), authController.login)
router.post('/logout', allow(['user']), authController.logout)
router.post('/register', allow(['*']), authController.register)
router.post('/refresh-token', allow(['*']), authController.refreshToken)

module.exports = router
